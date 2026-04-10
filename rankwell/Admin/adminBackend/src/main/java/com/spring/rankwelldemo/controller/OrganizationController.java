package com.spring.rankwelldemo.controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.spring.rankwelldemo.entity.Organization;
import com.spring.rankwelldemo.services.OrganizationService;

@RestController
@RequestMapping("/organization")
public class OrganizationController {

	@Autowired
    private OrganizationService organizationService;

    /** Must match {@code OrganizationServiceImpl} uploads (global {@code ORG_MEDIA_UPLOAD_ROOT}). */
    @Value("${org.media.upload-root}")
    private String orgMediaUploadRoot;

    @PostMapping("/saveOrUpdateOrg")
    public Organization saveOrUpdateOrganization(
    		@RequestParam(required = false) Long id,
            @RequestParam String orgName,
            @RequestParam String orgEmail,
            @RequestParam String orgPhone,
            @RequestParam String orgAddress,
            @RequestParam(required = false) MultipartFile orgLogo,
            @RequestParam(required = false) MultipartFile orgBrandMedia,
            @RequestParam String orgAbout
    ) {
        return organizationService.saveOrUpdateOrganization(
                id, orgName, orgEmail, orgPhone, orgAddress,
                orgLogo, orgBrandMedia, orgAbout
        );
    }

    @GetMapping("getOrganizationDetails/{id}")
    public Organization getOrganizationDetails(@PathVariable Long id) {
        return organizationService.getOrganizationDetails(id);
    }

    @PostMapping(value = "/current", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Organization saveCurrentOrganization(
            @RequestParam String orgName,
            @RequestParam(required = false, defaultValue = "") String orgTagline,
            @RequestParam(required = false, defaultValue = "") String orgEmail,
            @RequestParam(required = false, defaultValue = "") String orgPhone,
            @RequestParam(required = false, defaultValue = "") String orgAddress,
            @RequestParam(required = false, defaultValue = "") String orgWebsite,
            @RequestParam(required = false, defaultValue = "") String orgEstablishedYear,
            @RequestParam(required = false, defaultValue = "") String orgValues,
            @RequestParam(required = false, defaultValue = "") String orgAbout,
            @RequestParam(required = false, defaultValue = "") String createdAt,
            @RequestParam(required = false) MultipartFile orgLogo
    ) {
        return organizationService.saveCurrentOrganization(
                orgName, orgTagline, orgEmail, orgPhone, orgAddress,
                orgWebsite, orgEstablishedYear, orgValues, orgAbout, createdAt, orgLogo
        );
    }

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

            String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            try {
                String probed = Files.probeContentType(filePath);
                if (probed != null && !probed.isBlank()) {
                    contentType = probed;
                }
            } catch (IOException ignored) {
                // keep octet-stream / image default
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
