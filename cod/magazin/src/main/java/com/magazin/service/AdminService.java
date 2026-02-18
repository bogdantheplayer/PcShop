package com.magazin.service;

import com.magazin.model.Comanda;
import com.magazin.model.Utilizator;
import com.magazin.repository.ComandaRepository;
import com.magazin.repository.UtilizatorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UtilizatorRepository utilizatorRepository;
    private final ComandaRepository comandaRepository;

    public AdminService(UtilizatorRepository utilizatorRepository,
                        ComandaRepository comandaRepository) {
        this.utilizatorRepository = utilizatorRepository;
        this.comandaRepository = comandaRepository;
    }

    public List<Utilizator> getAllUsers() {
        return utilizatorRepository.findAll();
    }

    public List<Comanda> getAllComenzi() {
        return comandaRepository.findAll();
    }
}