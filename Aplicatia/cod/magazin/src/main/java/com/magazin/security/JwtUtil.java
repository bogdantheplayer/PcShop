package com.magazin.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import com.magazin.model.Utilizator;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final String secret = "MyUltraStrongJWTSecretKey_1234567890!!";
    private final long expiration = 1000 * 60 * 60; // 1 ora
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes());

    // 🔐 TOKEN CU ROL
    public String generateToken(Utilizator user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", user.getRol().name()); // ADMIN / USER

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRol(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }
}