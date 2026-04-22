package com.erecruitment.backend.candidate.dto;

import lombok.Builder;

@Builder
public record CandidateDashboardResponse(
        long totalApplications,
        long pendingApplications,
        long inReviewApplications,
        long acceptedApplications,
        long rejectedApplications
) {
}