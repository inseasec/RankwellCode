package com.spring.rankwelldemo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

			http
	        .csrf(csrf -> csrf.disable())
	        .cors(cors -> {})
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/auth/**").permitAll()
	            .requestMatchers("/organization/**").permitAll()
	            .anyRequest().authenticated()
	        );
	
	    return http.build();
    }
	
	 @Bean
	 public CorsConfigurationSource corsConfigurationSource() {

	       CorsConfiguration config = new CorsConfiguration();

	        config.setAllowedOriginPatterns(List.of(
	                "http://localhost",
	                "http://localhost:*",
	                "https://localhost",
	                "https://localhost:*",
	                "http://127.0.0.1:*",
	                "https://127.0.0.1:*",
	                "http://*.edtech.com",
	                "http://*.edtech.com:*",
	                "https://*.edtech.com",
	                "https://*.edtech.com:*"
	        ));
	        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
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
