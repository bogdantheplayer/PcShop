package com.magazin.service;

import com.magazin.model.Comanda;
import com.magazin.repository.ComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComandaService {

    @Autowired
    private ComandaRepository comandaRepository;

    public List<Comanda> getComenziByUtilizator(Long utilizatorId) {
        return comandaRepository.findByUtilizatorId(utilizatorId);
    }

    public Comanda saveComanda(Comanda comanda) {
        return comandaRepository.save(comanda);
    }

    public List<Comanda> getAllComenzi() {
        return comandaRepository.findAll();
    }
}
