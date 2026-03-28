package com.spring.rankwelldemo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.rankwelldemo.entity.Admin;
import com.spring.rankwelldemo.services.AdminService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public Admin login(@RequestBody Admin admin) {
        return adminService.login(admin.getEmail(), admin.getPassword());
    }
    
}
