package com.spring.rankwelldemo.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.spring.rankwelldemo.entity.Admin;
import com.spring.rankwelldemo.repository.AdminRepository;
import com.spring.rankwelldemo.services.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

	 	@Autowired
	    private AdminRepository adminRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;

	    @Override
	    public Admin login(String email, String password) {

	        Admin admin = adminRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("Admin not found"));

	        if (passwordEncoder.matches(password, admin.getPassword())) {
	            return admin;
	        } else {
	            throw new RuntimeException("Invalid credentials");
	        }
	    }

}
