package com.erecruitment.backend.candidate.service;

import com.erecruitment.backend.candidate.dto.CandidateProfileResponse;
import com.erecruitment.backend.candidate.dto.UpdateCandidateProfileRequest;
import com.erecruitment.backend.candidate.entity.CandidateProfile;
import com.erecruitment.backend.candidate.repository.CandidateProfileRepository;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    public CandidateProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        return mapToResponse(profile);
    }

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

        CandidateProfile updated = candidateProfileRepository.save(profile);
        return mapToResponse(updated);
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
                .build();
    }
}