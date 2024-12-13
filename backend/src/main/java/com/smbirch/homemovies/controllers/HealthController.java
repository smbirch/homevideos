package com.smbirch.homemovies.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Void> healthCheck() {
        log.info("Getting health check");
        return ResponseEntity.ok().build();
    }

}
