package com.magazin.repository;

import com.magazin.model.Cos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CosRepository extends JpaRepository<Cos, Long> {
    List<Cos> findByUtilizatorId(Long utilizatorId);
    List<Cos> findByStatus(String status);
}