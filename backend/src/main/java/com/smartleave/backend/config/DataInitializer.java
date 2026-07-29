package com.smartleave.backend.config;

import com.smartleave.backend.entity.User;
import com.smartleave.backend.entity.User.Role;
import com.smartleave.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@resolvehub.com")) {
                User admin = new User();
                admin.setName("HR Admin Specialist");
                admin.setEmail("admin@resolvehub.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("employee@resolvehub.com")) {
                User emp = new User();
                emp.setName("Default Employee");
                emp.setEmail("employee@resolvehub.com");
                emp.setPassword(passwordEncoder.encode("Employee@123"));
                emp.setRole(Role.USER);
                userRepository.save(emp);
            }
        };
    }
}
