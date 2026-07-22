package com.example.Vrnt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String uploadDir = "uploads/";
    private String normalExcelPath = "./VRNT_Data/normal_users.xlsx";
    private String adminExcelPath = "./VRNT_Data/admin_users.xlsx";
    private String excelPath;

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getNormalExcelPath() {
        return normalExcelPath;
    }

    public void setNormalExcelPath(String normalExcelPath) {
        this.normalExcelPath = normalExcelPath;
    }

    public String getAdminExcelPath() {
        return adminExcelPath;
    }

    public void setAdminExcelPath(String adminExcelPath) {
        this.adminExcelPath = adminExcelPath;
    }

    public String getExcelPath() {
        return excelPath;
    }

    public void setExcelPath(String excelPath) {
        this.excelPath = excelPath;
    }

    public Path resolveNormalExcelPath() {
        return resolveConfiguredPath(normalExcelPath, "./VRNT_Data/normal_users.xlsx");
    }

    public Path resolveAdminExcelPath() {
        return resolveConfiguredPath(adminExcelPath, "./VRNT_Data/admin_users.xlsx");
    }

    public Path resolveExcelPath() {
        return resolveConfiguredPath(excelPath, "./VRNT_Data/normal_users.xlsx");
    }

    private Path resolveConfiguredPath(String configuredPath, String fallback) {
        String effectivePath = (configuredPath == null || configuredPath.isBlank())
                ? fallback
                : configuredPath.trim();

        Path path = Paths.get(effectivePath);
        if (path.isAbsolute()) {
            return path.normalize();
        }

        return Paths.get(System.getProperty("user.dir"))
                .resolve(path)
                .normalize();
    }
}
