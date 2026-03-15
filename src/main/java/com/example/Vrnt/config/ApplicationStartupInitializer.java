package com.example.Vrnt.config;



import com.example.Vrnt.service.ExcelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

/**
 * Runs once when the Spring Boot app fully starts.
 * Creates the Excel file if it does NOT already exist.
 * If it exists, it is left untouched — no data is lost on restart.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicationStartupInitializer
        implements ApplicationListener<ApplicationReadyEvent> {

    private final ExcelService excelService;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        log.info("▶ App started — checking Excel file...");
        excelService.initExcelOnStartup();
    }
}
