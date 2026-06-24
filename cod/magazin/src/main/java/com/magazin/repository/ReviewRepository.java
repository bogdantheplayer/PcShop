package com.magazin.repository;

import com.magazin.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProdusIdOrderByDataDesc(Long produsId);

    Optional<Review> findByProdusIdAndUserEmail(Long produsId, String userEmail);

    boolean existsByProdusIdAndUserEmail(Long produsId, String userEmail);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.produs.id = :produsId")
    Double getAverageRating(Long produsId);
}