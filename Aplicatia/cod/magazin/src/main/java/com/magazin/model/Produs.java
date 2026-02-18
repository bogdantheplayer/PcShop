package com.magazin.model;

import jakarta.persistence.*;

@Entity
public class Produs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nume;
    private String descriere;
    private String categorie;
    private double pret;
    private int stoc;
    private String specificatii;
    private String producator;
    

    // getteri si setteri

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescriere() { return descriere; }
    public void setDescriere(String descriere) { this.descriere = descriere; }

    public String getNume() { return nume; }
    public void setNume(String nume) { this.nume = nume; }

    public String getCategorie() { return categorie; }
    public void setCategorie(String categorie) { this.categorie = categorie; }

    public double getPret() { return pret; }
    public void setPret(double pret) { this.pret = pret; }

    public int getStoc() { return stoc; }
    public void setStoc(int stoc) { this.stoc = stoc; }
    
    public String getSpecificatii() { return specificatii; }
    public void setSpecificatii(String specificatii) { this.specificatii = specificatii; }

    public String getProducator() { return producator; }
    public void setProducator(String producator) { this.producator = producator; }

}