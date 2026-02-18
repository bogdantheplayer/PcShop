package com.magazin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "utilizatori")
public class Utilizator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nume;
    private String email;

    private String parola;

    @Column(unique = true)
    private String username;
    
    private String telefon;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.USER;;
    
    
    // getteri si setteri
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNume() { return nume; }
    public void setNume(String nume) { this.nume = nume; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getParola() { return parola; }
    public void setParola(String parola) { this.parola = parola; }
    
    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }
    
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
}
