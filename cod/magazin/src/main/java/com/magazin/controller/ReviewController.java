package com.magazin.controller;

import com.magazin.controller.ReviewRequest;
import com.magazin.model.Produs;
import com.magazin.model.Review;
import com.magazin.model.Utilizator;
import com.magazin.repository.ProdusRepository;
import com.magazin.repository.ReviewRepository;
import com.magazin.repository.UtilizatorRepository;
import com.magazin.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProdusRepository produsRepository;
    private final UtilizatorRepository utilizatorRepository;
    private final JwtUtil jwtUtil;

    public ReviewController(
            ReviewRepository reviewRepository,
            ProdusRepository produsRepository,
            UtilizatorRepository utilizatorRepository,
            JwtUtil jwtUtil
    ) {
        this.reviewRepository = reviewRepository;
        this.produsRepository = produsRepository;
        this.utilizatorRepository = utilizatorRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/{produsId}")
    public List<Review> getReviews(@PathVariable Long produsId) {
        return reviewRepository.findByProdusIdOrderByDataDesc(produsId);
    }

    @GetMapping("/{produsId}/average")
    public Double getAverage(@PathVariable Long produsId) {
        Double avg = reviewRepository.getAverageRating(produsId);
        return avg != null ? avg : 0.0;
    }

    @GetMapping("/{produsId}/my-review")
    public ResponseEntity<?> getMyReview(
            @PathVariable Long produsId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmailFromHeader(authHeader);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Nu esti autentificat."));
        }

        return reviewRepository.findByProdusIdAndUserEmail(produsId, email)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "id", null,
                        "rating", 0,
                        "comentariu", ""
                )));
    }

    @PostMapping("/{produsId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long produsId,
            @RequestBody ReviewRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmailFromHeader(authHeader);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Trebuie sa fii logat pentru a adauga review."));
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Rating-ul trebuie sa fie intre 1 si 5."));
        }

        Produs produs = produsRepository.findById(produsId)
                .orElseThrow(() -> new RuntimeException("Produs inexistent"));

        if (reviewRepository.existsByProdusIdAndUserEmail(produsId, email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Ai deja un review pentru acest produs."));
        }

        Utilizator user = utilizatorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilizator inexistent"));

        Review review = new Review();
        review.setProdus(produs);
        review.setRating(request.getRating());
        review.setComentariu(request.getComentariu());
        review.setUsername(user.getUsername() != null ? user.getUsername() : user.getNume());
        review.setUserEmail(user.getEmail());
        review.setData(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmailFromHeader(authHeader);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Nu esti autentificat."));
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Rating-ul trebuie sa fie intre 1 si 5."));
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review inexistent"));

        if (!review.getUserEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Nu ai voie sa modifici acest review."));
        }

        review.setRating(request.getRating());
        review.setComentariu(request.getComentariu());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String email = extractEmailFromHeader(authHeader);

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Nu esti autentificat."));
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review inexistent"));

        if (!review.getUserEmail().equals(email)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Nu ai voie sa stergi acest review."));
        }

        reviewRepository.delete(review);

        return ResponseEntity.ok(Map.of("message", "Review sters"));
    }

   
    
    
    private String extractEmailFromHeader(String authHeader) {
        try {
            System.out.println("AUTH HEADER REVIEW: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return null;
            }

            String token = authHeader.substring(7);
            System.out.println("TOKEN REVIEW: " + token);

            String email = jwtUtil.extractEmail(token);
            System.out.println("EMAIL REVIEW: " + email);

            return email;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}