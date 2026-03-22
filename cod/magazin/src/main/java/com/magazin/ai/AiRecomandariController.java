package com.magazin.ai;

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
@RequestMapping("/api/recomandari")
@CrossOrigin(origins = "http://localhost:3000")
public class AiRecomandariController {

    private final ProdusRepository produsRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final String AI_URL = "http://127.0.0.1:4891/v1/chat/completions";
    private final String MODEL_NAME = "Nous-Hermes-2-Mistral-7B-DPO";

    public AiRecomandariController(ProdusRepository produsRepository) {
        this.produsRepository = produsRepository;
    }

    @PostMapping("/ai")
    public List<Produs> recomandariAi(@RequestBody AiRecommendRequest req) {

        List<Produs> all = produsRepository.findAll();

        Set<Long> inCartIds = req.getCartProductIds() == null
                ? Set.of()
                : new LinkedHashSet<>(req.getCartProductIds());

        Set<String> cartCategories = normalizeSet(req.getCartCategories());
        Set<String> preferredCategories = buildPreferredCategories(cartCategories);

        List<Produs> allCandidates = all.stream()
                .filter(p -> p.getId() != null && !inCartIds.contains(p.getId()))
                .toList();

        if (allCandidates.isEmpty()) {
            return List.of();
        }

        List<Produs> shortlist = buildShortlist(allCandidates, cartCategories, preferredCategories);

        if (shortlist.isEmpty()) {
            return fallbackFull(allCandidates, cartCategories, preferredCategories);
        }

        String prompt = buildPrompt(cartCategories, preferredCategories, shortlist);

        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL_NAME);
        body.put("messages", List.of(
                Map.of("role", "system", "content",
                        "You are a shopping recommendation engine. Follow the output format exactly."),
                Map.of("role", "user", "content", prompt)
        ));
        body.put("temperature", 0.2);
        body.put("top_p", 0.9);
        body.put("max_tokens", 160);

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
                System.out.println("AI recomandari: raspuns gol.");
                return fallbackFull(allCandidates, cartCategories, preferredCategories);
            }

            Map choice = (Map) ((List) responseBody.get("choices")).get(0);
            Map message = (Map) choice.get("message");
            String content = (String) message.get("content");

            System.out.println("AI RAW RESPONSE recomandari:");
            System.out.println(content);

            List<Long> ids = extractIds(content, shortlist);

            if (ids.isEmpty()) {
                System.out.println("AI recomandari: nu am extras ID-uri valide.");
                return fallbackFull(allCandidates, cartCategories, preferredCategories);
            }

            Map<Long, Produs> byId = shortlist.stream()
                    .filter(p -> p.getId() != null)
                    .collect(Collectors.toMap(Produs::getId, p -> p));

            List<Produs> result = new ArrayList<>();
            Set<Long> used = new LinkedHashSet<>();

            for (Long id : ids) {
                Produs p = byId.get(id);
                if (p != null && used.add(id)) {
                    result.add(p);
                }
                if (result.size() >= 6) {
                    break;
                }
            }

            if (result.size() < 6) {
                List<Produs> extra = fallbackFill(
                        allCandidates,
                        cartCategories,
                        preferredCategories,
                        used,
                        6 - result.size()
                );
                result.addAll(extra);
            }

            if (result.isEmpty()) {
                return fallbackFull(allCandidates, cartCategories, preferredCategories);
            }

            return result.stream().limit(6).toList();

        } catch (Exception e) {
            System.out.println("AI recomandari error:");
            e.printStackTrace();
            return fallbackFull(allCandidates, cartCategories, preferredCategories);
        }
    }

    private String buildPrompt(Set<String> cartCategories,
                               Set<String> preferredCategories,
                               List<Produs> shortlist) {

        String cartText = cartCategories.isEmpty()
                ? "nimic"
                : String.join(", ", cartCategories);

        String preferredText = preferredCategories.isEmpty()
                ? "SSD, Placa de baza, Alimentare, Case"
                : String.join(", ", preferredCategories);

        return """
        User cart categories:
        %s

        Preferred complementary categories:
        %s

        Choose EXACTLY 6 product IDs from the list below.

        Rules:
        - strongly prefer complementary categories
        - avoid repeating categories already present in the cart
        - maximum 1 product from the same category already in cart
        - do not invent products
        - use only IDs from the list
        - prefer a balanced PC build

        Answer ONLY like this:
        IDS: id1,id2,id3,id4,id5,id6

        Products:
        %s
        """.formatted(cartText, preferredText, buildCompactList(shortlist));
    }

    private List<Produs> buildShortlist(List<Produs> candidates,
                                        Set<String> cartCategories,
                                        Set<String> preferredCategories) {

        List<Produs> preferred = new ArrayList<>();
        List<Produs> otherNonCart = new ArrayList<>();
        List<Produs> sameAsCart = new ArrayList<>();

        for (Produs p : candidates) {
            String cat = normalizeCategory(p.getCategorie());

            if (preferredCategories.contains(cat)) {
                preferred.add(p);
            } else if (!cartCategories.contains(cat)) {
                otherNonCart.add(p);
            } else {
                sameAsCart.add(p);
            }
        }

        List<Produs> shortlist = new ArrayList<>();
        addLimited(shortlist, preferred, 14);
        addLimited(shortlist, otherNonCart, 8);
        addLimited(shortlist, sameAsCart, 2);

        return shortlist.stream()
                .filter(Objects::nonNull)
                .filter(p -> p.getId() != null)
                .limit(24)
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

    private Set<String> buildPreferredCategories(Set<String> cartCategories) {
        boolean hasGpu = cartCategories.contains("Placa video");
        boolean hasRam = cartCategories.contains("RAM");
        boolean hasMb = cartCategories.contains("Placa de baza");
        boolean hasCpu = cartCategories.contains("Procesor");
        boolean hasSsd = cartCategories.contains("SSD");
        boolean hasHdd = cartCategories.contains("HDD");
        boolean hasPsu = cartCategories.contains("Alimentare");
        boolean hasCase = cartCategories.contains("Case");
        boolean hasCooler = cartCategories.contains("Coolere");
        boolean hasFans = cartCategories.contains("Ventilatoare");

        LinkedHashSet<String> preferred = new LinkedHashSet<>();

        if ((hasGpu || hasRam) && !hasMb) preferred.add("Placa de baza");
        if (hasGpu && !hasCpu) preferred.add("Procesor");
        if ((hasGpu || hasCpu || hasRam) && !hasSsd) preferred.add("SSD");
        if (!hasSsd && !hasHdd) preferred.add("SSD");
        if ((hasGpu || hasCpu || hasRam) && !hasPsu) preferred.add("Alimentare");
        if ((hasGpu || hasCpu || hasRam) && !hasCase) preferred.add("Case");
        if (hasCpu && !hasCooler) preferred.add("Coolere");
        if (hasCase && !hasFans) preferred.add("Ventilatoare");

        if (preferred.isEmpty()) {
            preferred.add("Placa de baza");
            preferred.add("SSD");
            preferred.add("Alimentare");
            preferred.add("Case");
            if (!hasRam) preferred.add("RAM");
        }

        preferred.removeAll(cartCategories);
        return preferred;
    }

    private String buildCompactList(List<Produs> list) {
        StringBuilder sb = new StringBuilder();

        for (Produs p : list) {
            sb.append("ID=").append(p.getId())
                    .append(" | ")
                    .append(nullSafe(p.getNume()))
                    .append(" | ")
                    .append(normalizeCategory(p.getCategorie()))
                    .append(" | ")
                    .append(nullSafe(p.getProducator()))
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
                if (result.size() >= 6) {
                    break;
                }
            } catch (Exception ignored) {
            }
        }

        return new ArrayList<>(result);
    }

    private List<Produs> fallbackFull(List<Produs> candidates,
                                      Set<String> cartCategories,
                                      Set<String> preferredCategories) {

        System.out.println("AI fallback complet activat");

        return fallbackFill(candidates, cartCategories, preferredCategories, new LinkedHashSet<>(), 6);
    }

    private List<Produs> fallbackFill(List<Produs> candidates,
                                      Set<String> cartCategories,
                                      Set<String> preferredCategories,
                                      Set<Long> used,
                                      int limit) {

        List<Produs> result = new ArrayList<>();

        for (Produs p : candidates) {
            if (result.size() >= limit) break;
            if (p.getId() == null) continue;
            String cat = normalizeCategory(p.getCategorie());

            if (preferredCategories.contains(cat) && used.add(p.getId())) {
                result.add(p);
            }
        }

        for (Produs p : candidates) {
            if (result.size() >= limit) break;
            if (p.getId() == null) continue;
            String cat = normalizeCategory(p.getCategorie());

            if (!cartCategories.contains(cat) && used.add(p.getId())) {
                result.add(p);
            }
        }

        for (Produs p : candidates) {
            if (result.size() >= limit) break;
            if (p.getId() == null) continue;

            if (used.add(p.getId())) {
                result.add(p);
            }
        }

        return result;
    }

    private Set<String> normalizeSet(List<String> input) {
        if (input == null) return new LinkedHashSet<>();
        return input.stream()
                .filter(Objects::nonNull)
                .map(this::normalizeCategory)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String normalizeCategory(String value) {
        if (value == null) return "";
        String v = value.trim();

        if (v.equalsIgnoreCase("Placa de bază")) return "Placa de baza";
        if (v.equalsIgnoreCase("Placa de baza")) return "Placa de baza";
        if (v.equalsIgnoreCase("Placă video")) return "Placa video";
        if (v.equalsIgnoreCase("Sursa")) return "Alimentare";

        return v;
    }

    private String nullSafe(String value) {
        return value == null ? "-" : value;
    }
}