package com.magazin.controller;

import com.magazin.model.Cos;
import com.magazin.service.CosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cos")
public class CosController {

    @Autowired
    private CosService cosService;

    @GetMapping("/utilizator/{id}")
    public List<Cos> getByUtilizator(@PathVariable Long id) {
        return cosService.getCosuriByUtilizator(id);
    }

    @PostMapping
    public Cos create(@RequestBody Cos cos) {
        return cosService.saveCos(cos);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        cosService.deleteCos(id);
    }
}