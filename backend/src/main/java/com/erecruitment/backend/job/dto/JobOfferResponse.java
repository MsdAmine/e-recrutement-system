package com.erecruitment.backend.job.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record JobOfferResponse(
        Long id,
        String title,
        String description,
        String contractType,
        String location,
        BigDecimal salary,
        Boolean active,
        LocalDateTime createdAt,
        Long recruiterId,
        String recruiterEmail
) {
}