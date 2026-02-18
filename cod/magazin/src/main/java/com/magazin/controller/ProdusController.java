package com.magazin.controller;


import com.magazin.model.Produs;
import com.magazin.service.ProdusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produse")
public class ProdusController {

    @Autowired
    private ProdusService produsService;

    @GetMapping
    public List<Produs> getAll() {
        return produsService.getAllProduse();
    }

    @GetMapping("/{id}")
    public Produs getById(@PathVariable Long id) {
        return produsService.getProdusById(id).orElse(null);
    }

    @PostMapping
    public Produs create(@RequestBody Produs produs) {
        return produsService.saveProdus(produs);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        produsService.deleteProdus(id);
    }
}