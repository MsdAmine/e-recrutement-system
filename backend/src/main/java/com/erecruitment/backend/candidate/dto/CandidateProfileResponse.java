package com.erecruitment.backend.candidate.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record CandidateProfileResponse(
        Long userId,
        String firstName,
        String lastName,
        String email,
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
