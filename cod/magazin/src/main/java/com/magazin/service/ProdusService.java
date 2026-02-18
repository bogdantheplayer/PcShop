package com.magazin.service;


import com.magazin.model.Produs;
import com.magazin.repository.ProdusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdusService {

    @Autowired
    private ProdusRepository produsRepository;

    public List<Produs> getAllProduse() {
        return produsRepository.findAll();
    }

    public Optional<Produs> getProdusById(Long id) {
        return produsRepository.findById(id);
    }

    public List<Produs> getProduseByCategorie(String categorie) {
        return produsRepository.findByCategorie(categorie);
    }

    public Produs saveProdus(Produs produs) {
        return produsRepository.save(produs);
    }

    public void deleteProdus(Long id) {
        produsRepository.deleteById(id);
    }
}