package com.smartleave.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Aspect
@Component
public class PerformanceLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(PerformanceLoggingAspect.class);
    
    // Concurrent map to hold performance metrics in-memory
    private static final Map<String, Long> performanceMetrics = new ConcurrentHashMap<>();

    @Around("execution(* com.smartleave.backend.service.*.*(..))")
    public Object profileServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();
        
        try {
            return joinPoint.proceed();
        } finally {
            long timeTaken = System.currentTimeMillis() - startTime;
            performanceMetrics.put(methodName, timeTaken);
            log.info("📊 Performance Aspect: Method [{}] executed in {} ms.", methodName, timeTaken);
        }
    }

    public static Map<String, Long> getPerformanceMetrics() {
        return performanceMetrics;
    }
}
