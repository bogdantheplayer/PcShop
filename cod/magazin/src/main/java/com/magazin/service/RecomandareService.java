package com.magazin.service;

import com.magazin.model.Recomandare;
import com.magazin.repository.RecomandareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecomandareService {

    @Autowired
    private RecomandareRepository recomandareRepository;

    public List<Recomandare> getRecomandariByUtilizator(Long utilizatorId) {
        return recomandareRepository.findByUtilizatorId(utilizatorId);
    }

    public Recomandare saveRecomandare(Recomandare recomandare) {
        return recomandareRepository.save(recomandare);
    }
}