package com.spring.rankwelldemo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spring.rankwelldemo.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, Long>  {
	Optional<Organization> findFirstByOrderByIdAsc();
}
