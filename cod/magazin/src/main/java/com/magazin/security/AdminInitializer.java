package com.magazin.security;

import com.magazin.model.Rol;
import com.magazin.model.Utilizator;
import com.magazin.repository.UtilizatorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(UtilizatorRepository repo) {
        return args -> {

            if (repo.findByEmail("admin@magazin.ro").isEmpty()) {

                BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

                Utilizator admin = new Utilizator();
                admin.setNume("Administrator");
                admin.setEmail("admin@magazin.ro");
                admin.setUsername("admin");
                admin.setTelefon("0000000000");
                admin.setParola(encoder.encode("admin123"));
                admin.setRol(Rol.ADMIN);

                repo.save(admin);

                System.out.println("ADMIN creat: admin@magazin.ro / admin123");
            }
        };
    }
}