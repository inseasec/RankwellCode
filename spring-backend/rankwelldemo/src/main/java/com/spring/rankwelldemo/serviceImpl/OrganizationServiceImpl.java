package com.spring.rankwelldemo.serviceImpl;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spring.rankwelldemo.entity.Organization;
import com.spring.rankwelldemo.repository.OrganizationRepository;
import com.spring.rankwelldemo.services.OrganizationService;

@Service
public class OrganizationServiceImpl implements OrganizationService{

	@Autowired
    private OrganizationRepository organizationRepository;
    
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/rankwellDemoData/";

    @Override
    public Organization saveOrUpdateOrganization(
    		Long id,
            String orgName,
            String orgEmail,
            String orgPhone,
            String orgAddress,
            MultipartFile orgLogo,
            MultipartFile orgBrandMedia,
            String orgAbout) {

    	 try {

    	        File baseDir = new File(UPLOAD_DIR);
    	        if (!baseDir.exists()) baseDir.mkdirs();

    	        String safeOrgFolderName = sanitizeFolderName(orgName);
    	        File organizationDir = new File(baseDir, safeOrgFolderName);
    	        if (!organizationDir.exists()) organizationDir.mkdirs();

    	        Organization org;

    	        // 🔥 UPDATE
    	        if (id != null) {
    	            org = organizationRepository.findById(id)
    	                    .orElseThrow(() -> new RuntimeException("Organization not found"));
    	        } 
    	        // 🔥 CREATE
    	        else {
    	            org = new Organization();
    	        }

    	        // Common fields
    	        org.setOrgName(orgName);
    	        org.setOrgEmail(orgEmail);
    	        org.setOrgPhone(orgPhone);
    	        org.setOrgAddress(orgAddress);
    	        org.setOrgAbout(orgAbout);

    	        // 🔥 Logo Upload (only if new file comes)
    	        if (orgLogo != null && !orgLogo.isEmpty()) {

    	            String fileName = System.currentTimeMillis() + "_" + orgLogo.getOriginalFilename();
    	            File dest = new File(organizationDir, fileName);
    	            orgLogo.transferTo(dest);

    	            org.setOrgLogo("uploads/rankwellDemoData/" + safeOrgFolderName + "/" + fileName);
    	        }

    	        // 🔥 Media Upload
    	        if (orgBrandMedia != null && !orgBrandMedia.isEmpty()) {

    	            String fileName = System.currentTimeMillis() + "_" + orgBrandMedia.getOriginalFilename();
    	            File dest = new File(organizationDir, fileName);
    	            orgBrandMedia.transferTo(dest);

    	            org.setOrgBrandMedia("uploads/rankwellDemoData/" + safeOrgFolderName + "/" + fileName);
    	        }

    	        return organizationRepository.save(org);

    	    } catch (IOException e) {
    	        throw new RuntimeException("File upload failed");
    	    }
    }

    @Override
    public Organization getOrganizationDetails(Long id) {
        if (id == null) {
            throw new RuntimeException("Organization id is required");
        }
        return organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
    }

    @Override
    public Organization saveCurrentOrganization(
            String orgName,
            String orgTagline,
            String orgEmail,
            String orgPhone,
            String orgAddress,
            String orgWebsite,
            String orgEstablishedYear,
            String orgValues,
            String orgAbout,
            String createdAt,
            MultipartFile orgLogo) {
        Organization existingOrg = organizationRepository.findFirstByOrderByIdAsc().orElse(null);
        Long existingId = existingOrg != null ? existingOrg.getId() : null;

        Organization savedOrg = saveOrUpdateOrganization(
                existingId,
                orgName,
                orgEmail,
                orgPhone,
                orgAddress,
                orgLogo,
                null,
                orgAbout
        );

        savedOrg.setOrgTagline(orgTagline);
        savedOrg.setOrgWebsite(orgWebsite);
        savedOrg.setOrgEstablishedYear(orgEstablishedYear);
        savedOrg.setOrgValues(orgValues);
        savedOrg.setCreatedAt(
                createdAt != null && !createdAt.isBlank()
                        ? createdAt
                        : (existingOrg != null ? existingOrg.getCreatedAt() : null)
        );

        return organizationRepository.save(savedOrg);
    }

    @Override
    public Organization getCurrentOrganization() {
        return organizationRepository.findFirstByOrderByIdAsc().orElse(new Organization());
    }

    private String sanitizeFolderName(String orgName) {
        if (orgName == null || orgName.trim().isEmpty()) {
            return "unknown-organization";
        }
        return orgName.trim()
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("_+", "_");
    }
}
