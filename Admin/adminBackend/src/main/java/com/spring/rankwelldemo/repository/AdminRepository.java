package com.spring.rankwelldemo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.rankwelldemo.entity.Admin;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
}
