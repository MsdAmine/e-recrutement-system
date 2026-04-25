package com.erecruitment.backend.candidate.service;

import com.erecruitment.backend.candidate.dto.CandidateProfileResponse;
import com.erecruitment.backend.candidate.dto.CandidateDashboardResponse;
import com.erecruitment.backend.candidate.dto.UpdateCandidateProfileRequest;
import com.erecruitment.backend.candidate.entity.CandidateProfile;
import com.erecruitment.backend.candidate.repository.CandidateProfileRepository;
import com.erecruitment.backend.application.repository.JobApplicationRepository;
import com.erecruitment.backend.common.enums.ApplicationStatus;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public CandidateProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        return mapToResponse(profile);
    }

    @CacheEvict(value = {"candidateMatches", "candidateJobMatches", "candidateEmbeddings"}, allEntries = true)
    public CandidateProfileResponse updateMyProfile(String email, UpdateCandidateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        profile.setPhone(request.phone());
        profile.setAddress(request.address());
        profile.setHeadline(request.headline());
        profile.setSummary(request.summary());
        profile.setCvUrl(request.cvUrl());
        profile.setSkills(request.skills());
        profile.setYearsOfExperience(request.yearsOfExperience());
        profile.setExpectedSalary(request.expectedSalary());
        profile.setPreferredContractType(request.preferredContractType());
        profile.setPreferredLocation(request.preferredLocation());

        candidateProfileRepository.save(profile);
        return mapToResponse(profile);
    }

    private CandidateProfileResponse mapToResponse(CandidateProfile profile) {
        return CandidateProfileResponse.builder()
                .userId(profile.getUser().getId())
                .firstName(profile.getUser().getFirstName())
                .lastName(profile.getUser().getLastName())
                .email(profile.getUser().getEmail())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .headline(profile.getHeadline())
                .summary(profile.getSummary())
                .cvUrl(profile.getCvUrl())
                .skills(profile.getSkills())
                .yearsOfExperience(profile.getYearsOfExperience())
                .expectedSalary(profile.getExpectedSalary())
                .preferredContractType(profile.getPreferredContractType())
                .preferredLocation(profile.getPreferredLocation())
                .build();
    }

    public CandidateDashboardResponse getMyDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long total = jobApplicationRepository.countByCandidateId(user.getId());
        long pending = jobApplicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.PENDING);
        long inReview = jobApplicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.IN_REVIEW);
        long accepted = jobApplicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.ACCEPTED);
        long rejected = jobApplicationRepository.countByCandidateIdAndStatus(user.getId(), ApplicationStatus.REJECTED);

        return CandidateDashboardResponse.builder()
                .totalApplications(total)
                .pendingApplications(pending)
                .inReviewApplications(inReview)
                .acceptedApplications(accepted)
                .rejectedApplications(rejected)
                .build();
    }

}
