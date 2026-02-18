package com.magazin.controller;

import com.magazin.model.Utilizator;
import com.magazin.service.UtilizatorService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/utilizatori")
public class UtilizatorController {

    @Autowired
    private UtilizatorService utilizatorService;

    @PostMapping
    public Utilizator create(@RequestBody Utilizator utilizator) {
        return utilizatorService.saveUtilizator(utilizator);
    }

    @GetMapping("/email/{email}")
    public Utilizator getByEmail(@PathVariable String email) {
        return utilizatorService.getByEmail(email).orElse(null);
    }
    
    @GetMapping
    public List<Utilizator> getAll() {
        return utilizatorService.getAllUtilizatori();
    }
    
    
    
    @PutMapping("/{id}")
    public Utilizator updateUser(@PathVariable Long id, @RequestBody Utilizator userDetails) {
        Utilizator utilizator = utilizatorService.getById(id).orElseThrow();

        utilizator.setNume(userDetails.getNume());
        utilizator.setUsername(userDetails.getUsername());
        utilizator.setTelefon(userDetails.getTelefon()); // nou

        return utilizatorService.saveUtilizator(utilizator);
    }
}