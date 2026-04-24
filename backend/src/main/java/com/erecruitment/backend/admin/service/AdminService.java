package com.erecruitment.backend.admin.service;

import com.erecruitment.backend.admin.dto.PlatformStatsResponse;
import com.erecruitment.backend.application.repository.JobApplicationRepository;
import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.RoleRepository;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }

    public List<JobOffer> getAllJobOffers() {
        return jobOfferRepository.findAll();
    }

    @Transactional
    public void deleteJobOffer(Long jobId) {
        if (!jobOfferRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job offer not found");
        }
        jobOfferRepository.deleteById(jobId);
    }

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
