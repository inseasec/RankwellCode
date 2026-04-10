package com.example.UserBackend.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.UserBackend.entity.Organization;
import com.example.UserBackend.repository.OrganizationRepository;
import com.example.UserBackend.services.OrganizationService;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Override
    public Organization getCurrentOrganization() {
        return organizationRepository.findFirstByOrderByIdAsc().orElse(new Organization());
    }
}

