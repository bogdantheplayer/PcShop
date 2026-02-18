package com.magazin.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
public class ComandaProdus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // legatura cu comanda
    @ManyToOne
    @JoinColumn(name = "comanda_id")
    @JsonBackReference
    private Comanda comanda;

    // detalii produs
    private String numeProdus;
    private int cantitate;
    private double pret;

    // getteri si setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Comanda getComanda() { return comanda; }
    public void setComanda(Comanda comanda) { this.comanda = comanda; }

    public String getNumeProdus() { return numeProdus; }
    public void setNumeProdus(String numeProdus) { this.numeProdus = numeProdus; }

    public int getCantitate() { return cantitate; }
    public void setCantitate(int cantitate) { this.cantitate = cantitate; }

    public double getPret() { return pret; }
    public void setPret(double pret) { this.pret = pret; }
}
