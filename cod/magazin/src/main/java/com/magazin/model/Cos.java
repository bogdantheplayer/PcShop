package com.magazin.model;

import jakarta.persistence.*;

@Entity
public class Cos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long utilizatorId;

    private String status; // ex: "activ", "comandat"

    // getteri si setteri

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUtilizatorId() { return utilizatorId; }
    public void setUtilizatorId(Long utilizatorId) { this.utilizatorId = utilizatorId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}