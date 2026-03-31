package com.example.UserBackend.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.UserBackend.entity.Organization;
import com.example.UserBackend.services.OrganizationService;

@RestController
@RequestMapping("/organization")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    /** Same base directory Admin uses for uploads (see global ORG_MEDIA_UPLOAD_ROOT). */
    @Value("${org.media.upload-root}")
    private String orgMediaUploadRoot;

    @GetMapping("/current")
    public Organization getCurrentOrganization() {
        return organizationService.getCurrentOrganization();
    }

    @GetMapping("/current/logo")
    public ResponseEntity<Resource> getCurrentOrganizationLogo() {
        Organization currentOrganization = organizationService.getCurrentOrganization();
        if (currentOrganization.getOrgLogo() == null || currentOrganization.getOrgLogo().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path base = Paths.get(orgMediaUploadRoot).toAbsolutePath().normalize();
            // DB stores paths as OrgName/file.png relative to ORG_MEDIA_UPLOAD_ROOT
            String relative = currentOrganization.getOrgLogo().trim().replace('\\', '/');
            while (relative.startsWith("/")) {
                relative = relative.substring(1);
            }
            Path filePath = base.resolve(relative).normalize();
            String baseStr = base.toString().toLowerCase(Locale.ROOT);
            String fileStr = filePath.toString().toLowerCase(Locale.ROOT);
            if (!fileStr.startsWith(baseStr)) {
                return ResponseEntity.badRequest().build();
            }
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

