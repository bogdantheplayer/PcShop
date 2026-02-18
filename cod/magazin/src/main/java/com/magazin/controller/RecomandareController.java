package com.magazin.controller;

import com.magazin.model.Recomandare;
import com.magazin.service.RecomandareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recomandari")
public class RecomandareController {

    @Autowired
    private RecomandareService recomandareService;

    @GetMapping("/utilizator/{id}")
    public List<Recomandare> getByUtilizator(@PathVariable Long id) {
        return recomandareService.getRecomandariByUtilizator(id);
    }

    @PostMapping
    public Recomandare create(@RequestBody Recomandare recomandare) {
        return recomandareService.saveRecomandare(recomandare);
    }
}