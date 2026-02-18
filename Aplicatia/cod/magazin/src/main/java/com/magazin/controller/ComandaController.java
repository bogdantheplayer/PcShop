package com.magazin.controller;

import com.magazin.model.Comanda;
import com.magazin.service.ComandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comenzi")
public class ComandaController {

    @Autowired
    private ComandaService comandaService;

    @GetMapping("/utilizator/{id}")
    public List<Comanda> getByUtilizator(@PathVariable Long id) {
        return comandaService.getComenziByUtilizator(id);
    }

    @PostMapping
    public Comanda create(@RequestBody Comanda comanda) {
        return comandaService.saveComanda(comanda);
    }

    @GetMapping
    public List<Comanda> getAll() {
        return comandaService.getAllComenzi();
    }
}
