package com.erecruitment.backend.candidate.dto;

import lombok.Builder;

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
        String cvUrl
) {
}