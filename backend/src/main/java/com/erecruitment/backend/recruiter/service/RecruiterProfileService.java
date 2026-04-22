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

@Service
@RequiredArgsConstructor
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;

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
}