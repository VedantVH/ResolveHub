package com.smartleave.backend.controller;

import com.smartleave.backend.aspect.PerformanceLoggingAspect;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/metrics")
public class SystemMetricsController {

    @GetMapping
    public ResponseEntity<Map<String, Long>> getPerformanceMetrics() {
        return ResponseEntity.ok(PerformanceLoggingAspect.getPerformanceMetrics());
    }
}
