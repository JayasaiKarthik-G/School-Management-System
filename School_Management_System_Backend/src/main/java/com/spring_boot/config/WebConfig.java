package com.spring_boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global MVC configuration.
 * Enables CORS for all API endpoints so that browser-based clients
 * (e.g., Swagger UI, React/Angular frontends) can call the API
 * during local development without being blocked by same-origin policy.
 *
 * <p>Adjust {@code allowedOrigins} for production deployments.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "https://school-management-system-nine-eosin.vercel.app/")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}