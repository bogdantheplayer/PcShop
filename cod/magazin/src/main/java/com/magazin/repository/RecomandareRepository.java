package com.magazin.repository;

import com.magazin.model.Recomandare;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecomandareRepository extends JpaRepository<Recomandare, Long> {
    List<Recomandare> findByUtilizatorId(Long utilizatorId);
}