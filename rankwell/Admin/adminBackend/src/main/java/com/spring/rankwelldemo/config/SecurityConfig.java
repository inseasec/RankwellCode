package com.spring.rankwelldemo.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.annotation.PostConstruct;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${ADMIN_SSL_ENABLED:false}")
    private boolean sslEnabled;

    /**
     * Full origin (e.g. http://192.168.1.51:2019) or host[:port] if scheme is omitted.
     */
    @Value("${ADMIN_FRONTEND_URL:http://localhost:2019}")
    private String adminFrontendUrl;

    private String allowedOrigin;

    @PostConstruct
    void resolveAllowedOrigin() {
        String raw = adminFrontendUrl == null ? "" : adminFrontendUrl.trim();
        if (raw.isEmpty()) {
            allowedOrigin = "http://localhost:2019";
            return;
        }
        if (raw.startsWith("http://") || raw.startsWith("https://")) {
            allowedOrigin = raw;
            return;
        }
        allowedOrigin = (sslEnabled ? "https://" : "http://") + raw;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/assets/**",
                    "/**/*.js",
                    "/**/*.css",
                    "/**/*.png",
                    "/**/*.jpg",
                    "/**/*.svg"
                ).permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/organization/**").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
