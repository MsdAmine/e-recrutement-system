package com.erecruitment.backend.candidate.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record UpdateCandidateProfileRequest(
        String phone,
        String address,
        String headline,
        String summary,
        String cvUrl,
        String skills,
        Integer yearsOfExperience,
        BigDecimal expectedSalary,
        String preferredContractType,
        String preferredLocation
) {
}
