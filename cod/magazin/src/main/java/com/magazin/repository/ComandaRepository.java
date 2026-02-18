package com.magazin.repository;

import com.magazin.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    List<Comanda> findByUtilizatorId(Long utilizatorId);
}