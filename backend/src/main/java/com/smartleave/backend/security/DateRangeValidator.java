package com.smartleave.backend.security;

import com.smartleave.backend.dto.LeaveRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, LeaveRequestDTO> {

    @Override
    public boolean isValid(LeaveRequestDTO dto, ConstraintValidatorContext context) {
        if (dto == null) {
            return true;
        }

        LocalDate start = dto.getStartDate();
        LocalDate end = dto.getEndDate();

        if (start == null || end == null) {
            return false;
        }

        // Custom validation business logic:
        // 1. Start date must be before or equal to End date
        // 2. Start date must not be in the past
        boolean isValid = !start.isAfter(end) && !start.isBefore(LocalDate.now());

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("The start date must be a current/future date and must fall before or equal to the end date.")
                   .addPropertyNode("startDate")
                   .addConstraintViolation();
        }

        return isValid;
    }
}
