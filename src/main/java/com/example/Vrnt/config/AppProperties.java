package com.example.Vrnt.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String uploadDir = "uploads/";
    private String excelPath = "./VRNT_Data/vrnt_users.xlsx";

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getExcelPath() {
        return excelPath;
    }

    public void setExcelPath(String excelPath) {
        this.excelPath = excelPath;
    }

    public Path resolveExcelPath() {
        String configuredPath = (excelPath == null || excelPath.isBlank())
                ? "./VRNT_Data/vrnt_users.xlsx"
                : excelPath.trim();

        Path path = Paths.get(configuredPath);
        if (path.isAbsolute()) {
            return path.normalize();
        }

        return Paths.get(System.getProperty("user.dir"))
                .resolve(path)
                .normalize();
    }
}
