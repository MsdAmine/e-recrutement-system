package com.erecruitment.backend.candidate.dto;

import lombok.Builder;

@Builder
public record UpdateCandidateProfileRequest(
        String phone,
        String address,
        String headline,
        String summary,
        String cvUrl
) {
}