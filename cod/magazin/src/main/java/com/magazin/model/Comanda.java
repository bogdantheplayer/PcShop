package com.magazin.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Comanda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long utilizatorId;
    private double total;
    private LocalDateTime dataComanda;

    // date facturare
    private String adresa;
    private String oras;
    private String judet;
    private String tara;
    private String codPostal;
    
    
    
    // degatura cu produsele din comanda
    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ComandaProdus> produse;
    
    

    // getteri si setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUtilizatorId() { return utilizatorId; }
    public void setUtilizatorId(Long utilizatorId) { this.utilizatorId = utilizatorId; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public LocalDateTime getDataComanda() { return dataComanda; }
    public void setDataComanda(LocalDateTime dataComanda) { this.dataComanda = dataComanda; }

    public String getAdresa() { return adresa; }
    public void setAdresa(String adresa) { this.adresa = adresa; }

    public String getOras() { return oras; }
    public void setOras(String oras) { this.oras = oras; }

    public String getJudet() { return judet; }
    public void setJudet(String judet) { this.judet = judet; }

    public String getTara() { return tara; }
    public void setTara(String tara) { this.tara = tara; }

    public String getCodPostal() { return codPostal; }
    public void setCodPostal(String codPostal) { this.codPostal = codPostal; }
    
    
    
    public List<ComandaProdus> getProduse() { return produse; }
    public void setProduse(List<ComandaProdus> produse) {
        this.produse = produse;
        if (produse != null) {
            for (ComandaProdus p : produse) {
                p.setComanda(this); // legam fiecare produs de comanda
            }
        }
    }
    
}
