package com.erecruitment.backend.recruiter.service;

import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.recruiter.dto.RecruiterProfileResponse;
import com.erecruitment.backend.recruiter.dto.UpdateRecruiterProfileRequest;
import com.erecruitment.backend.recruiter.entity.RecruiterProfile;
import com.erecruitment.backend.recruiter.repository.RecruiterProfileRepository;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.erecruitment.backend.application.repository.JobApplicationRepository;
import com.erecruitment.backend.common.enums.ApplicationStatus;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.recruiter.dto.RecruiterDashboardResponse;

@Service
@RequiredArgsConstructor
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public RecruiterProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        return mapToResponse(profile);
    }

    public RecruiterProfileResponse updateMyProfile(String email, UpdateRecruiterProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        RecruiterProfile profile = recruiterProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        profile.setCompanyName(request.companyName());
        profile.setCompanyWebsite(request.companyWebsite());
        profile.setCompanySector(request.companySector());
        profile.setCompanyDescription(request.companyDescription());

        RecruiterProfile updated = recruiterProfileRepository.save(profile);
        return mapToResponse(updated);
    }

    private RecruiterProfileResponse mapToResponse(RecruiterProfile profile) {
        return RecruiterProfileResponse.builder()
                .userId(profile.getUser().getId())
                .firstName(profile.getUser().getFirstName())
                .lastName(profile.getUser().getLastName())
                .email(profile.getUser().getEmail())
                .companyName(profile.getCompanyName())
                .companyWebsite(profile.getCompanyWebsite())
                .companySector(profile.getCompanySector())
                .companyDescription(profile.getCompanyDescription())
                .build();
    }

    public RecruiterDashboardResponse getMyDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalJobOffers = jobOfferRepository.countByRecruiterId(user.getId());
        long activeJobOffers = jobOfferRepository.countByRecruiterIdAndActiveTrue(user.getId());
        long inactiveJobOffers = jobOfferRepository.countByRecruiterIdAndActiveFalse(user.getId());

        long totalApplicationsReceived = jobApplicationRepository.countByJobOfferRecruiterId(user.getId());
        long pendingApplications = jobApplicationRepository.countByJobOfferRecruiterIdAndStatus(user.getId(), ApplicationStatus.PENDING);
        long inReviewApplications = jobApplicationRepository.countByJobOfferRecruiterIdAndStatus(user.getId(), ApplicationStatus.IN_REVIEW);
        long acceptedApplications = jobApplicationRepository.countByJobOfferRecruiterIdAndStatus(user.getId(), ApplicationStatus.ACCEPTED);
        long rejectedApplications = jobApplicationRepository.countByJobOfferRecruiterIdAndStatus(user.getId(), ApplicationStatus.REJECTED);

        return RecruiterDashboardResponse.builder()
                .totalJobOffers(totalJobOffers)
                .activeJobOffers(activeJobOffers)
                .inactiveJobOffers(inactiveJobOffers)
                .totalApplicationsReceived(totalApplicationsReceived)
                .pendingApplications(pendingApplications)
                .inReviewApplications(inReviewApplications)
                .acceptedApplications(acceptedApplications)
                .rejectedApplications(rejectedApplications)
                .build();
    }
}