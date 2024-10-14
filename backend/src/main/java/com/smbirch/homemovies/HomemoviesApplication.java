package com.smbirch.homemovies;

import java.util.Arrays;
import java.util.List;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class HomemoviesApplication {

  public static void main(String[] args) {
    SpringApplication.run(HomemoviesApplication.class, args);
  }

  @Bean
  public CorsFilter corsFilter() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowCredentials(true);
    corsConfiguration.setAllowedOrigins(
        List.of(
            "http://localhost:4200",
            "http://localhost:3000",
            "http://homevideos.smbirch.com",
            "https://homevideos.smbirch.com",
            "http://www.homevideos.smbirch.com",
            "https://www.homevideos.smbirch.com"));
    corsConfiguration.setAllowedHeaders(List.of("*"));
    corsConfiguration.setExposedHeaders(List.of("*"));
    corsConfiguration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

    UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource =
        new UrlBasedCorsConfigurationSource();
    urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
    return new CorsFilter(urlBasedCorsConfigurationSource);
  }
}
