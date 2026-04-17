package com.erecruitment.backend.job.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record JobOfferRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String contractType,
        @NotBlank String location,
        BigDecimal salary,
        @NotNull Boolean active
) {
}