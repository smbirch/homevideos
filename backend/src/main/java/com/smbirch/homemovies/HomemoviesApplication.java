package com.smbirch.homemovies;

import java.util.Arrays;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class HomemoviesApplication {

  public static void main(String[] args) {
    SpringApplication.run(HomemoviesApplication.class, args);
  }

  @Bean
  @Order(Ordered.HIGHEST_PRECEDENCE)
  public CorsFilter corsFilter() {
    CorsConfiguration corsConfiguration = new CorsConfiguration();

    corsConfiguration.setAllowCredentials(true);

    // TODO: update this in prod
    corsConfiguration.addAllowedOriginPattern("*");
//    corsConfiguration.setAllowedOriginPatterns(Arrays.asList(
//            "http://localhost:[*]",
//            "http://192.168.*.*",
//            "http://10.*.*.*",
//            "http://172.16.*.*",
//            "https://*.smbirch.com",
//            "https://d1vqiwu0adek5c.cloudfront.net"
//    ));

    corsConfiguration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

    corsConfiguration.setAllowedHeaders(
        Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"));

    corsConfiguration.setExposedHeaders(
        Arrays.asList(
            "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Authorization"));

    corsConfiguration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);

    return new CorsFilter(source);
  }
}
