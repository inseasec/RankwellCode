package com.example.UserBackend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.UserBackend.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findFirstByOrderByIdAsc();
}

