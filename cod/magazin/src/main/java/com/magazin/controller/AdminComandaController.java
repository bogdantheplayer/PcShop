package com.magazin.controller;

import com.magazin.model.Comanda;
import com.magazin.repository.ComandaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/comenzi")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminComandaController {

    private final ComandaRepository comandaRepository;

    public AdminComandaController(ComandaRepository comandaRepository) {
        this.comandaRepository = comandaRepository;
    }

    @GetMapping
    public List<Comanda> getAll() {
        return comandaRepository.findAll();
    }

    @PutMapping("/{id}")
    public Comanda update(@PathVariable Long id, @RequestBody Comanda updated) {
        Comanda c = comandaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda nu există"));

        c.setAdresa(updated.getAdresa());
        c.setOras(updated.getOras());
        c.setJudet(updated.getJudet());
        c.setTara(updated.getTara());
        c.setCodPostal(updated.getCodPostal());

        return comandaRepository.save(c);
    }
}