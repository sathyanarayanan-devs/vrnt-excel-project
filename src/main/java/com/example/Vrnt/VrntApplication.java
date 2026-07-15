package com.example.Vrnt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.Vrnt.config.AppProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class VrntApplication {

	public static void main(String[] args) {
		SpringApplication.run(VrntApplication.class, args);
	}

}
