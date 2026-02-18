package com.magazin.controller;

import com.magazin.model.Utilizator;
import com.magazin.repository.UtilizatorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/utilizatori")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUtilizatorController {

    private final UtilizatorRepository utilizatorRepository;

    public AdminUtilizatorController(UtilizatorRepository utilizatorRepository) {
        this.utilizatorRepository = utilizatorRepository;
    }

    @GetMapping
    public List<Utilizator> getAll() {
        return utilizatorRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilizatorRepository.deleteById(id);
    }
}