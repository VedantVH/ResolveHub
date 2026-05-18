package com.smartleave.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import com.smartleave.backend.security.ValidDateRange;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidDateRange
public class LeaveRequestDTO {
    private Long id;
    private String applicantName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status;
}
