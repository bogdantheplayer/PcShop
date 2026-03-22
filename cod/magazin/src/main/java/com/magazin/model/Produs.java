package com.magazin.model;

import jakarta.persistence.*;

@Entity
public class Produs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nume;
    
    @Column(columnDefinition = "TEXT")
    private String descriere;
    
    private String categorie;
    private double pret;
    private int stoc;
    
    @Column(columnDefinition = "TEXT")
    private String specificatii;
    
    private String producator;
    
    
    
    private String imagine1;
    private String imagine2;
    private String imagine3;
    

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
    
    
    
    
     
    public String getImagine1() { return imagine1; }
    public void setImagine1(String imagine1) { this.imagine1 = imagine1; }

    public String getImagine2() { return imagine2; }
    public void setImagine2(String imagine2) {  this.imagine2 = imagine2; }

    public String getImagine3() {  return imagine3; }
    public void setImagine3(String imagine3) { this.imagine3 = imagine3; }

}