package com.erecruitment.backend.recruiter.dto;

import lombok.Builder;

@Builder
public record UpdateRecruiterProfileRequest(
        String companyName,
        String companyWebsite,
        String companySector,
        String companyDescription
) {
}