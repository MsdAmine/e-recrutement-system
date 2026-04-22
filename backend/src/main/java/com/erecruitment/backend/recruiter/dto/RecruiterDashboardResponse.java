package com.erecruitment.backend.recruiter.dto;

import lombok.Builder;

@Builder
public record RecruiterDashboardResponse(
        long totalJobOffers,
        long activeJobOffers,
        long inactiveJobOffers,
        long totalApplicationsReceived,
        long pendingApplications,
        long inReviewApplications,
        long acceptedApplications,
        long rejectedApplications
) {
}