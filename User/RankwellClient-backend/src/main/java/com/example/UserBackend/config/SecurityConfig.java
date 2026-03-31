package com.example.UserBackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;

@Configuration
public class SecurityConfig {

    @Value("${USER_SSL_ENABLED:false}")
    private boolean sslEnabled;

    
    @Value("${USER_FRONTEND_URL:http://localhost:2018}")
    private String userFrontendUrl;

    private String allowedOrigin;

    @PostConstruct
    void resolveAllowedOrigin() {
        String raw = userFrontendUrl == null ? "" : userFrontendUrl.trim();
        if (raw.isEmpty()) {
            allowedOrigin = "http://localhost:2018";
            return;
        }
        if (raw.startsWith("http://") || raw.startsWith("https://")) {
            allowedOrigin = raw;
            return;
        }
        allowedOrigin = (sslEnabled ? "https://" : "http://") + raw;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(allowedOrigin) // dynamic USER_FRONTEND_URL 
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }
}
