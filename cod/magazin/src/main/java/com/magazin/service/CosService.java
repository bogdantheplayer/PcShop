package com.magazin.service;

import com.magazin.model.Cos;
import com.magazin.repository.CosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CosService {

    @Autowired
    private CosRepository cosRepository;

    public List<Cos> getCosuriByUtilizator(Long utilizatorId) {
        return cosRepository.findByUtilizatorId(utilizatorId);
    }

    public Cos saveCos(Cos cos) {
        return cosRepository.save(cos);
    }

    public void deleteCos(Long id) {
        cosRepository.deleteById(id);
    }
}