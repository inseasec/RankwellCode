package com.example.UserBackend;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RankwellClientBackendApplication {

	public static void main(String[] args) {

			String baseDir = System.getProperty("user.dir");
			File file = new File(baseDir, "../global-config.properties");

			if (file.exists() && file.isFile()) {
				System.out.println("✅ Global configuration file FOUND at: " + file.getAbsolutePath());
			} else {
				System.out.println("❌ Global configuration file NOT FOUND at: " + file.getAbsolutePath());
				System.out.println("⚠️ Please ensure 'global-config.properties' exists at the specified location.");
			}

		SpringApplication.run(RankwellClientBackendApplication.class, args);
	}

}
