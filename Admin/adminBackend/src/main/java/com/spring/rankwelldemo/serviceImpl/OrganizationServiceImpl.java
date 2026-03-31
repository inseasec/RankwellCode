package com.spring.rankwelldemo.serviceImpl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.AccessDeniedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.spring.rankwelldemo.entity.Organization;
import com.spring.rankwelldemo.repository.OrganizationRepository;
import com.spring.rankwelldemo.services.OrganizationService;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Value("${org.media.upload-root}")
    private String orgMediaUploadRoot;

    /** DB stores paths as sanitizedOrgFolder/fileName under the upload root (e.g. seasec/1730..._logo.png). */
    private static String buildStoredRelativePath(String safeOrgFolderName, String fileName) {
        return safeOrgFolderName + "/" + fileName;
    }

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

        String safeOrgFolderName = sanitizeFolderName(orgName);

        Organization org;
        if (id != null) {
            org = organizationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Organization not found"));
        } else {
            org = new Organization();
        }

        org.setOrgName(orgName);
        org.setOrgEmail(orgEmail);
        org.setOrgPhone(orgPhone);
        org.setOrgAddress(orgAddress);
        org.setOrgAbout(orgAbout);

        boolean uploadLogo = hasMultipartFile(orgLogo);
        boolean uploadBrand = hasMultipartFile(orgBrandMedia);

        if (uploadLogo || uploadBrand) {
            try {
                Path baseRoot = Paths.get(orgMediaUploadRoot).toAbsolutePath().normalize();
                Files.createDirectories(baseRoot);
                Path orgDirPath = baseRoot.resolve(safeOrgFolderName);
                Files.createDirectories(orgDirPath);

                if (uploadLogo) {
                    deleteStoredRelativeFile(org.getOrgLogo());
                    String fileName = uniqueFileName(orgLogo.getOriginalFilename());
                    Path dest = orgDirPath.resolve(fileName);
                    copyMultipartToPath(orgLogo, dest);
                    org.setOrgLogo(buildStoredRelativePath(safeOrgFolderName, fileName));
                }

                if (uploadBrand) {
                    deleteStoredRelativeFile(org.getOrgBrandMedia());
                    String fileName = uniqueFileName(orgBrandMedia.getOriginalFilename());
                    Path dest = orgDirPath.resolve(fileName);
                    copyMultipartToPath(orgBrandMedia, dest);
                    org.setOrgBrandMedia(buildStoredRelativePath(safeOrgFolderName, fileName));
                }
            } catch (IOException | IllegalStateException e) {
                throw new RuntimeException(uploadFailureMessage(e), e);
            }
        }

        return organizationRepository.save(org);
    }

    private String uploadFailureMessage(Throwable e) {
        String base = "File upload failed under " + orgMediaUploadRoot + ": " + e.getMessage();
        if (containsAccessDenied(e)) {
            return base + ". The process user cannot create or write under this path on the server. "
                    + "Fix ownership (example): sudo chown -R <service-user>:<group> " + orgMediaUploadRoot
                    + " && sudo chmod u+rwx " + orgMediaUploadRoot;
        }
        return base;
    }

    private static boolean containsAccessDenied(Throwable e) {
        while (e != null) {
            if (e instanceof AccessDeniedException) {
                return true;
            }
            e = e.getCause();
        }
        return false;
    }

    private static boolean hasMultipartFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    /**
     * Safe file name for any OS (no spaces/parens); preserves a short extension when present.
     * e.g. {@code images (3).jfif} → {@code 1730..._images_3_.jfif}
     */
    private static String uniqueFileName(String originalFilename) {
        long ts = System.currentTimeMillis();
        if (originalFilename == null || originalFilename.isBlank()) {
            return ts + "_logo.bin";
        }
        String name = originalFilename.trim();
        String ext = "";
        int lastDot = name.lastIndexOf('.');
        if (lastDot > 0 && lastDot < name.length() - 1) {
            String rawExt = name.substring(lastDot + 1);
            ext = "." + sanitizeFileExtension(rawExt);
            name = name.substring(0, lastDot);
        }
        String base = sanitizeFileBaseName(name);
        if (base.isEmpty()) {
            base = "logo";
        }
        return ts + "_" + base + ext;
    }

    private static String sanitizeFileBaseName(String name) {
        return name.replaceAll("[^a-zA-Z0-9._-]", "_").replaceAll("_+", "_");
    }

    /** Letters/digits only, max length, so ".jfif" stays valid. */
    private static String sanitizeFileExtension(String ext) {
        if (ext == null || ext.isBlank()) {
            return "bin";
        }
        String s = ext.replaceAll("[^a-zA-Z0-9]", "").toLowerCase(Locale.ROOT);
        if (s.isEmpty()) {
            return "bin";
        }
        return s.length() > 8 ? s.substring(0, 8) : s;
    }

    private static void copyMultipartToPath(MultipartFile multipart, Path dest) throws IOException {
        try (InputStream in = multipart.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    /**
     * Removes a previously stored file under orgMediaUploadRoot when replacing uploads.
     */
    private void deleteStoredRelativeFile(String relativeStoredPath) {
        if (relativeStoredPath == null || relativeStoredPath.isBlank()) {
            return;
        }
        try {
            Path base = Paths.get(orgMediaUploadRoot).toAbsolutePath().normalize();
            String rel = relativeStoredPath.trim().replace('\\', '/');
            while (rel.startsWith("/")) {
                rel = rel.substring(1);
            }
            Path filePath = base.resolve(rel).normalize();
            String baseStr = base.toString().toLowerCase(Locale.ROOT);
            String fileStr = filePath.toString().toLowerCase(Locale.ROOT);
            if (!fileStr.startsWith(baseStr)) {
                return;
            }
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // Best-effort cleanup; new file still saves
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

    /**
     * Folder under ORG_MEDIA_UPLOAD_ROOT, e.g. {@code seasec} for company name "Seasec".
     * Lowercase for stable Linux paths.
     */
    private String sanitizeFolderName(String orgName) {
        if (orgName == null || orgName.trim().isEmpty()) {
            return "unknown-organization";
        }
        String safe = orgName.trim()
                .replaceAll("[^a-zA-Z0-9._-]", "_")
                .replaceAll("_+", "_");
        return safe.toLowerCase(Locale.ROOT);
    }
}
