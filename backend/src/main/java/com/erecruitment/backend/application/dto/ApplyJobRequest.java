package com.erecruitment.backend.application.dto;

import lombok.Builder;

@Builder
public record ApplyJobRequest(
        String coverLetter
) {
}