package com.erecruitment.backend.user.dto;

import lombok.Builder;

@Builder
public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String role
) {
}