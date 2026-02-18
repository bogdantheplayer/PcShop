package com.magazin.model;

import jakarta.persistence.*;

@Entity
public class Recomandare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long produsId;
    private Long utilizatorId;
    private String motiv;

    // getteri si setteri

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProdusId() { return produsId; }
    public void setProdusId(Long produsId) { this.produsId = produsId; }

    public Long getUtilizatorId() { return utilizatorId; }
    public void setUtilizatorId(Long utilizatorId) { this.utilizatorId = utilizatorId; }

    public String getMotiv() { return motiv; }
    public void setMotiv(String motiv) { this.motiv = motiv; }
}