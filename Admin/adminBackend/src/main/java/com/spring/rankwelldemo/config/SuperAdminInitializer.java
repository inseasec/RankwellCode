package com.spring.rankwelldemo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.spring.rankwelldemo.entity.Admin;
import com.spring.rankwelldemo.repository.AdminRepository;

@Configuration
public class SuperAdminInitializer implements CommandLineRunner{

	@Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String email = "superadmin@gmail.com";

        if (adminRepository.findByEmail(email).isEmpty()) {

            Admin admin = new Admin();
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode("super@123"));
            admin.setRole("ROLE_SUPER_ADMIN");

            adminRepository.save(admin);

            System.out.println("✅ Super Admin Created");
        } else {
            System.out.println("ℹ️ Super Admin Already Exists");
        }
    }
    
}
