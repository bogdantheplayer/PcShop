package com.magazin.chatBot;

import com.magazin.model.Produs;
import com.magazin.repository.ProdusRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai-builder")
@CrossOrigin(origins = "http://localhost:3000")
public class AiBuilderController {

    private final ProdusRepository produsRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final String AI_URL = "http://127.0.0.1:4891/v1/chat/completions";
    private final String MODEL_NAME = "Nous-Hermes-2-Mistral-7B-DPO";

    public AiBuilderController(ProdusRepository produsRepository) {
        this.produsRepository = produsRepository;
    }

    @PostMapping("/chat")
    public AiBuilderResponse chat(@RequestBody AiBuilderRequest req) {
        List<Produs> allProducts = produsRepository.findAll();

        if (allProducts.isEmpty()) {
            AiBuilderResponse resp = new AiBuilderResponse();
            resp.setReply("Nu există produse în baza de date.");
            resp.setProduse(List.of());
            resp.setNote("Baza de date este goală.");
            return resp;
        }

        BuilderContext ctx = analyzeConversation(req);
        List<Produs> shortlist = buildShortlist(allProducts, ctx);

        if (shortlist.isEmpty()) {
            return fallbackResponse(req, allProducts, ctx);
        }

        String prompt = buildPrompt(req, shortlist, ctx);

        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL_NAME);
        body.put("messages", List.of(
                Map.of("role", "system", "content",
                        "You are a PC builder assistant. Follow the requested output format exactly."),
                Map.of("role", "user", "content", prompt)
        ));
        body.put("temperature", 0.25);
        body.put("top_p", 0.9);
        body.put("max_tokens", 220);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    AI_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    Map.class
            );

            Map responseBody = response.getBody();
            if (responseBody == null || responseBody.get("choices") == null) {
                return fallbackResponse(req, allProducts, ctx);
            }

            Map choice = (Map) ((List) responseBody.get("choices")).get(0);
            Map message = (Map) choice.get("message");
            String content = (String) message.get("content");

            System.out.println("AI BUILDER RAW RESPONSE:");
            System.out.println(content);

            String reply = extractSection(content, "REPLY");
            String note = extractSection(content, "NOTE");
            List<Long> ids = extractIds(content, shortlist);

            Map<Long, Produs> byId = shortlist.stream()
                    .filter(p -> p.getId() != null)
                    .collect(Collectors.toMap(Produs::getId, p -> p));

            List<Produs> produse = new ArrayList<>();
            Set<Long> used = new LinkedHashSet<>();

            for (Long id : ids) {
                Produs p = byId.get(id);
                if (p != null && used.add(id)) {
                    produse.add(p);
                }
                if (produse.size() >= 8) {
                    break;
                }
            }

            if (produse.size() < 6) {
                List<Produs> extra = fallbackFill(allProducts, ctx, used, 6 - produse.size());
                produse.addAll(extra);
            }

            if (produse.isEmpty()) {
                return fallbackResponse(req, allProducts, ctx);
            }

            AiBuilderResponse finalResp = new AiBuilderResponse();
            finalResp.setReply(buildFinalReply(reply, ctx, produse));
            finalResp.setProduse(produse.stream().limit(8).toList());
            finalResp.setNote(
                    note == null || note.isBlank()
                            ? buildLocalNote(ctx)
                            : note
            );

            return finalResp;

        } catch (Exception e) {
            System.out.println("AI BUILDER ERROR:");
            e.printStackTrace();
            return fallbackResponse(req, allProducts, ctx);
        }
    }

    private String buildPrompt(AiBuilderRequest req, List<Produs> produse, BuilderContext ctx) {
        String historyText = buildHistoryText(req);

        return """
        You are an AI PC builder.

        User profile inferred from conversation:
        - budget: %s
        - usage: %s
        - cpu preference: %s
        - gpu preference: %s
        - prefers balanced build: yes

        Instructions:
        - choose only products from the provided list
        - do not invent products
        - prefer a coherent PC build
        - try to include useful complementary categories
        - adapt the answer to the user's latest message
        - if the budget is small, prefer value products
        - if the budget is high, prefer stronger products
        - keep the reply natural and conversational

        Answer EXACTLY in this format:
        REPLY: short natural answer for the user
        IDS: id1,id2,id3,id4,id5,id6
        NOTE: short internal note

        Conversation history:
        %s

        Last user message:
        %s

        Available products:
        %s
        """.formatted(
                ctx.budgetText,
                ctx.usageText,
                ctx.cpuPreference,
                ctx.gpuPreference,
                historyText,
                req.getMessage() == null ? "" : req.getMessage(),
                buildCompactList(produse)
        );
    }

    private String buildHistoryText(AiBuilderRequest req) {
        if (req.getHistory() == null || req.getHistory().isEmpty()) {
            return "-";
        }

        return req.getHistory().stream()
                .filter(m -> m.getContent() != null && !m.getContent().isBlank())
                .map(m -> "[" + safe(m.getRole()) + "] " + m.getContent())
                .collect(Collectors.joining("\n"));
    }

    private BuilderContext analyzeConversation(AiBuilderRequest req) {
        StringBuilder allText = new StringBuilder();

        if (req.getHistory() != null) {
            for (AiChatMessage m : req.getHistory()) {
                if (m.getContent() != null) {
                    allText.append(" ").append(m.getContent());
                }
            }
        }

        if (req.getMessage() != null) {
            allText.append(" ").append(req.getMessage());
        }

        String text = allText.toString().toLowerCase(Locale.ROOT);

        BuilderContext ctx = new BuilderContext();

        ctx.budget = detectBudget(text);
        ctx.budgetText = ctx.budget == null ? "nespecificat" : ctx.budget + " RON";
        ctx.usageText = detectUsage(text);
        ctx.cpuPreference = detectCpuPreference(text);
        ctx.gpuPreference = detectGpuPreference(text);
        ctx.preferredCategories = buildPreferredCategoriesForUsage(ctx.usageText);

        return ctx;
    }

    private Integer detectBudget(String text) {
        Matcher m = Pattern.compile("(\\d{3,5})\\s*(lei|ron)?").matcher(text);
        Integer best = null;

        while (m.find()) {
            try {
                int value = Integer.parseInt(m.group(1));
                if (value >= 800 && value <= 30000) {
                    best = value;
                }
            } catch (Exception ignored) {
            }
        }

        return best;
    }

    private String detectUsage(String text) {
        if (containsAny(text, "gaming", "jocuri", "1080p", "1440p", "fps")) {
            return "gaming";
        }
        if (containsAny(text, "editare", "video", "render", "premiere", "after effects", "4k")) {
            return "editare video";
        }
        if (containsAny(text, "programare", "coding", "dezvoltare", "software")) {
            return "programare";
        }
        if (containsAny(text, "office", "birou", "facultate", "navigare", "uz general")) {
            return "office";
        }
        return "general";
    }

    private String detectCpuPreference(String text) {
        boolean intel = containsAny(text, "intel");
        boolean amd = containsAny(text, "amd", "ryzen");

        if (intel && !amd) return "Intel";
        if (amd && !intel) return "AMD";
        return "oricare";
    }

    private String detectGpuPreference(String text) {
        boolean nvidia = containsAny(text, "nvidia", "rtx", "gtx", "geforce");
        boolean amd = containsAny(text, "radeon");
        boolean integrated = containsAny(text, "fara placa video", "integrata", "integrat");

        if (integrated) return "fara GPU dedicat";
        if (nvidia && !amd) return "NVIDIA";
        if (amd && !nvidia) return "AMD";
        return "oricare";
    }

    private Set<String> buildPreferredCategoriesForUsage(String usage) {
        LinkedHashSet<String> cats = new LinkedHashSet<>();

        switch (usage.toLowerCase(Locale.ROOT)) {
            case "gaming" -> {
                cats.add("Procesor");
                cats.add("Placa video");
                cats.add("Placa de baza");
                cats.add("RAM");
                cats.add("SSD");
                cats.add("Alimentare");
                cats.add("Case");
            }
            case "editare video" -> {
                cats.add("Procesor");
                cats.add("Placa video");
                cats.add("RAM");
                cats.add("SSD");
                cats.add("Placa de baza");
                cats.add("Alimentare");
            }
            case "programare" -> {
                cats.add("Procesor");
                cats.add("RAM");
                cats.add("SSD");
                cats.add("Placa de baza");
                cats.add("Case");
                cats.add("Alimentare");
            }
            case "office" -> {
                cats.add("Procesor");
                cats.add("RAM");
                cats.add("SSD");
                cats.add("Placa de baza");
            }
            default -> {
                cats.add("Procesor");
                cats.add("Placa de baza");
                cats.add("RAM");
                cats.add("SSD");
                cats.add("Alimentare");
                cats.add("Case");
            }
        }

        return cats;
    }

    private List<Produs> buildShortlist(List<Produs> allProducts, BuilderContext ctx) {
        List<Produs> preferred = new ArrayList<>();
        List<Produs> neutral = new ArrayList<>();
        List<Produs> lowPriority = new ArrayList<>();

        for (Produs p : allProducts) {
            if (p.getId() == null) continue;

            String cat = normalizeCategory(p.getCategorie());
            String prod = safe(p.getProducator()).toLowerCase(Locale.ROOT);

            boolean categoryPreferred = ctx.preferredCategories.contains(cat);
            boolean producerPreferred = producerMatchesContext(prod, ctx);
            boolean priceFits = priceMatchesBudget(p.getPret(), ctx.budget);

            if (categoryPreferred && producerPreferred && priceFits) {
                preferred.add(p);
            } else if (categoryPreferred || producerPreferred || priceFits) {
                neutral.add(p);
            } else {
                lowPriority.add(p);
            }
        }

        List<Produs> shortlist = new ArrayList<>();
        addLimited(shortlist, sortByCategoryThenPrice(preferred), 18);
        addLimited(shortlist, sortByCategoryThenPrice(neutral), 10);
        addLimited(shortlist, sortByCategoryThenPrice(lowPriority), 6);

        return shortlist.stream()
                .filter(Objects::nonNull)
                .limit(28)
                .toList();
    }

    private boolean producerMatchesContext(String producer, BuilderContext ctx) {
        if (producer == null || producer.isBlank()) return true;

        if ("Intel".equalsIgnoreCase(ctx.cpuPreference)) {
            if (producer.contains("intel")) return true;
            if (producer.contains("amd")) return false;
        }

        if ("AMD".equalsIgnoreCase(ctx.cpuPreference)) {
            if (producer.contains("amd")) return true;
            if (producer.contains("intel")) return false;
        }

        if ("NVIDIA".equalsIgnoreCase(ctx.gpuPreference)) {
            if (producer.contains("nvidia") || producer.contains("msi") || producer.contains("gigabyte") || producer.contains("asus")) {
                return true;
            }
        }

        return true;
    }

    private boolean priceMatchesBudget(double pret, Integer budget) {
        if (budget == null) return true;
        if (budget <= 2500) return pret <= 1500;
        if (budget <= 5000) return pret <= 2500;
        if (budget <= 8000) return pret <= 4000;
        return true;
    }

    private List<Produs> sortByCategoryThenPrice(List<Produs> list) {
        return list.stream()
                .sorted(Comparator
                        .comparing((Produs p) -> normalizeCategory(p.getCategorie()))
                        .thenComparingDouble(Produs::getPret))
                .toList();
    }

    private void addLimited(List<Produs> target, List<Produs> source, int limit) {
        int count = 0;
        for (Produs p : source) {
            if (count >= limit) break;
            target.add(p);
            count++;
        }
    }

    private String buildCompactList(List<Produs> list) {
        StringBuilder sb = new StringBuilder();

        for (Produs p : list) {
            sb.append("ID=").append(p.getId())
                    .append(" | ")
                    .append(safe(p.getNume()))
                    .append(" | ")
                    .append(normalizeCategory(p.getCategorie()))
                    .append(" | ")
                    .append(safe(p.getProducator()))
                    .append(" | ")
                    .append(p.getPret())
                    .append(" RON\n");
        }

        return sb.toString();
    }

    private List<Long> extractIds(String content, List<Produs> shortlist) {
        if (content == null || content.isBlank()) {
            return List.of();
        }

        Set<Long> validIds = shortlist.stream()
                .map(Produs::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        LinkedHashSet<Long> result = new LinkedHashSet<>();

        Matcher idsLine = Pattern.compile("IDS\\s*:\\s*([0-9,\\s]+)", Pattern.CASE_INSENSITIVE)
                .matcher(content);

        if (idsLine.find()) {
            String group = idsLine.group(1);
            for (String part : group.split(",")) {
                try {
                    Long id = Long.parseLong(part.trim());
                    if (validIds.contains(id)) {
                        result.add(id);
                    }
                } catch (Exception ignored) {
                }
            }
        }

        if (!result.isEmpty()) {
            return new ArrayList<>(result);
        }

        Matcher anyNumber = Pattern.compile("\\b\\d+\\b").matcher(content);
        while (anyNumber.find()) {
            try {
                Long id = Long.parseLong(anyNumber.group());
                if (validIds.contains(id)) {
                    result.add(id);
                }
                if (result.size() >= 8) {
                    break;
                }
            } catch (Exception ignored) {
            }
        }

        return new ArrayList<>(result);
    }

    private String extractSection(String content, String sectionName) {
        if (content == null || content.isBlank()) return "";

        Pattern p = Pattern.compile(sectionName + "\\s*:\\s*(.*?)(?=\\n[A-Z]+\\s*:|$)",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Matcher m = p.matcher(content);

        if (m.find()) {
            return m.group(1).trim();
        }

        return "";
    }

    private String buildFinalReply(String aiReply, BuilderContext ctx, List<Produs> produse) {
        if (aiReply != null && !aiReply.isBlank()) {
            return aiReply;
        }

        String start;
        switch (ctx.usageText.toLowerCase(Locale.ROOT)) {
            case "gaming" -> start = "Ți-am pregătit o variantă de PC pentru gaming";
            case "editare video" -> start = "Ți-am pregătit o variantă de PC pentru editare video";
            case "programare" -> start = "Ți-am pregătit o variantă de PC pentru programare";
            case "office" -> start = "Ți-am pregătit o variantă de PC pentru office";
            default -> start = "Ți-am pregătit o configurație de bază";
        }

        if (ctx.budget != null) {
            start += " în jurul bugetului de " + ctx.budget + " RON";
        }

        return start + ". Poți să adaugi direct componentele care îți plac în coș, iar dacă vrei, pot rafina configurația.";
    }

    private String buildLocalNote(BuilderContext ctx) {
        return "Context detectat: usage=" + ctx.usageText +
                ", cpu=" + ctx.cpuPreference +
                ", gpu=" + ctx.gpuPreference +
                ", buget=" + ctx.budgetText;
    }

    private AiBuilderResponse fallbackResponse(AiBuilderRequest req, List<Produs> allProducts, BuilderContext ctx) {
        List<Produs> fallback = fallbackFill(allProducts, ctx, new LinkedHashSet<>(), 6);

        AiBuilderResponse resp = new AiBuilderResponse();
        resp.setReply(buildFinalReply("", ctx, fallback));
        resp.setProduse(fallback);
        resp.setNote("Fallback local activat.");
        return resp;
    }

    private List<Produs> fallbackFill(List<Produs> allProducts,
                                      BuilderContext ctx,
                                      Set<Long> used,
                                      int limit) {

        List<Produs> result = new ArrayList<>();

        for (String cat : ctx.preferredCategories) {
            for (Produs p : allProducts) {
                if (result.size() >= limit) break;
                if (p.getId() == null) continue;

                if (normalizeCategory(p.getCategorie()).equals(cat) && used.add(p.getId())) {
                    result.add(p);
                    break;
                }
            }
            if (result.size() >= limit) break;
        }

        for (Produs p : allProducts) {
            if (result.size() >= limit) break;
            if (p.getId() == null) continue;

            String cat = normalizeCategory(p.getCategorie());
            if (ctx.preferredCategories.contains(cat) && used.add(p.getId())) {
                result.add(p);
            }
        }

        for (Produs p : allProducts) {
            if (result.size() >= limit) break;
            if (p.getId() == null) continue;

            if (used.add(p.getId())) {
                result.add(p);
            }
        }

        return result;
    }

    private String normalizeCategory(String value) {
        if (value == null) return "";
        String v = value.trim();

        if (v.equalsIgnoreCase("Placa de bază")) return "Placa de baza";
        if (v.equalsIgnoreCase("Placă video")) return "Placa video";
        if (v.equalsIgnoreCase("Sursa")) return "Alimentare";

        return v;
    }

    private boolean containsAny(String text, String... values) {
        for (String v : values) {
            if (text.contains(v.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private String safe(String value) {
        return value == null ? "-" : value;
    }

    private static class BuilderContext {
        Integer budget;
        String budgetText;
        String usageText;
        String cpuPreference;
        String gpuPreference;
        Set<String> preferredCategories;
    }
}