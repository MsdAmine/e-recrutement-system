package com.erecruitment.backend.application.dto;

import com.erecruitment.backend.common.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UpdateApplicationStatusRequest(
        @NotNull ApplicationStatus status
) {
}