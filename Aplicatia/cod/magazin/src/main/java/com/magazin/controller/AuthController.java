package com.magazin.controller;

import com.magazin.model.Utilizator;
import com.magazin.repository.UtilizatorRepository;
import com.magazin.security.JwtUtil;
import com.magazin.service.UtilizatorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // React
public class AuthController {

    @Autowired
    private UtilizatorRepository utilizatorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UtilizatorService utilizatorService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilizator utilizator) {
        if (utilizatorRepository.findByEmail(utilizator.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email deja folosit!");
        }
        if (utilizatorRepository.findByUsername(utilizator.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username deja folosit!");
        }

        utilizator.setParola(encoder.encode(utilizator.getParola()));
        utilizator.setRol(com.magazin.model.Rol.USER);

        utilizatorRepository.save(utilizator);
        return ResponseEntity.ok("Utilizator înregistrat cu succes!");
    }

    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Utilizator utilizator) {

        Optional<Utilizator> userDb =
                utilizatorRepository.findByEmail(utilizator.getEmail());

        if (userDb.isPresent() &&
            encoder.matches(utilizator.getParola(), userDb.get().getParola())) {

            String token = jwtUtil.generateToken(userDb.get());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Date incorecte!");
    }
    
    
    
    
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);

            Optional<Utilizator> optionalUser = utilizatorService.getByEmail(email);

            if (optionalUser.isPresent()) {
                Utilizator user = optionalUser.get();
                user.setParola(null); // ascund parola manual
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body("Utilizatorul nu există");
            }

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Token invalid sau expirat");
        }
    }
}
