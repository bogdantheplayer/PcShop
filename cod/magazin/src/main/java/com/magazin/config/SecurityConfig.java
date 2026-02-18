package com.magazin.config;

import com.magazin.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.security.config.Customizer;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults()) 
            .authorizeHttpRequests(auth -> auth
            		  .requestMatchers("/api/auth/**").permitAll()
            		  .requestMatchers("/api/produse/**").permitAll()
            		  .requestMatchers("/api/comenzi/**").permitAll()
            		  .requestMatchers("/api/cos/**").permitAll()
            		  .requestMatchers("/api/admin/**").hasRole("ADMIN")
            		  .anyRequest().authenticated()
            		)

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions().disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}