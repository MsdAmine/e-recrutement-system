package com.erecruitment.backend.auth.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
        Long userId,
        String firstName,
        String lastName,
        String email,
        String role,
        String message
) {
}