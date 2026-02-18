package com.magazin.service;

import com.magazin.model.Utilizator;
import com.magazin.repository.UtilizatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilizatorService {

    @Autowired
    private UtilizatorRepository utilizatorRepository;

    public Utilizator saveUtilizator(Utilizator utilizator) {
        return utilizatorRepository.save(utilizator);
    }

    public Optional<Utilizator> getByEmail(String email) {
        return utilizatorRepository.findByEmail(email);
    }

    public Optional<Utilizator> getByUsername(String username) {
        return utilizatorRepository.findByUsername(username);
    }

    public List<Utilizator> getAllUtilizatori() {
        return utilizatorRepository.findAll();    }
    
    public Optional<Utilizator> getById(Long id) {
        return utilizatorRepository.findById(id);
    }

    public void deleteUser(Long id) {
        utilizatorRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return utilizatorRepository.findByEmail(email).isPresent();
    }

    public boolean existsByUsername(String username) {
        return utilizatorRepository.findByUsername(username).isPresent();
    }
    
}