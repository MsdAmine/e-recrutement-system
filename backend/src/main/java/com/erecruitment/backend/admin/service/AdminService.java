package com.erecruitment.backend.admin.service;

import com.erecruitment.backend.admin.dto.PlatformStatsResponse;
import com.erecruitment.backend.application.repository.JobApplicationRepository;
import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.job.dto.JobOfferResponse;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.user.dto.UserResponse;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.RoleRepository;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().getName().name())
                .enabled(user.isEnabled())
                .build();
    }

    @Transactional(readOnly = true)
    public List<JobOfferResponse> getAllJobOffers() {
        return jobOfferRepository.findAll().stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    private JobOfferResponse mapToJobResponse(JobOffer jobOffer) {
        return JobOfferResponse.builder()
                .id(jobOffer.getId())
                .title(jobOffer.getTitle())
                .description(jobOffer.getDescription())
                .contractType(jobOffer.getContractType())
                .location(jobOffer.getLocation())
                .salary(jobOffer.getSalary())
                .active(jobOffer.isActive())
                .createdAt(jobOffer.getCreatedAt())
                .recruiterId(jobOffer.getRecruiter().getId())
                .recruiterEmail(jobOffer.getRecruiter().getEmail())
                .build();
    }

    @Transactional
    public void deleteJobOffer(Long jobId) {
        if (!jobOfferRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job offer not found");
        }
        jobOfferRepository.deleteById(jobId);
    }

    @Transactional(readOnly = true)
    public PlatformStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole_Name(RoleName.ROLE_CANDIDATE);
        long totalRecruiters = userRepository.countByRole_Name(RoleName.ROLE_RECRUITER);
        long totalJobOffers = jobOfferRepository.count();
        long totalApplications = jobApplicationRepository.count();

        return PlatformStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCandidates(totalCandidates)
                .totalRecruiters(totalRecruiters)
                .totalJobOffers(totalJobOffers)
                .totalApplications(totalApplications)
                .build();
    }
}
