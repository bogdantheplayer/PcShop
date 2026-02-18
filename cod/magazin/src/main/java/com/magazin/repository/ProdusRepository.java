package com.magazin.repository;

import com.magazin.model.Produs;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProdusRepository extends JpaRepository<Produs, Long> {
    List<Produs> findByCategorie(String categorie);
    List<Produs> findByNumeContainingIgnoreCase(String keyword);
}