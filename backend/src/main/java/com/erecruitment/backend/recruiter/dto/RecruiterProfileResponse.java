package com.erecruitment.backend.recruiter.dto;

import lombok.Builder;

@Builder
public record RecruiterProfileResponse(
        Long userId,
        String firstName,
        String lastName,
        String email,
        String companyName,
        String companyWebsite,
        String companySector,
        String companyDescription
) {
}