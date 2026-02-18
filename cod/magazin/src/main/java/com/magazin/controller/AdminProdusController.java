package com.magazin.controller;

import com.magazin.model.Produs;
import com.magazin.repository.ProdusRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/produse")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProdusController {

    private final ProdusRepository produsRepository;

    public AdminProdusController(ProdusRepository produsRepository) {
        this.produsRepository = produsRepository;
    }

    @GetMapping
    public List<Produs> getAll() {
        return produsRepository.findAll();
    }

    @PostMapping
    public Produs create(@RequestBody Produs produs) {
        return produsRepository.save(produs);
    }

    @PutMapping("/{id}")
    public Produs update(@PathVariable Long id, @RequestBody Produs produs) {
        Produs p = produsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produs inexistent"));

        p.setNume(produs.getNume());
        p.setPret(produs.getPret());
        p.setDescriere(produs.getDescriere());
        p.setCategorie(produs.getCategorie());
        p.setStoc(produs.getStoc());
        p.setSpecificatii(produs.getSpecificatii());
        p.setProducator(produs.getProducator());

        return produsRepository.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produsRepository.deleteById(id);
    }
}