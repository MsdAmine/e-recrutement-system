package com.erecruitment.backend.candidate.controller;

import com.erecruitment.backend.candidate.dto.CandidateProfileResponse;
import com.erecruitment.backend.candidate.dto.UpdateCandidateProfileRequest;
import com.erecruitment.backend.candidate.service.CandidateProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.erecruitment.backend.candidate.dto.CandidateDashboardResponse;

@RestController
@RequestMapping("/api/candidate/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    @GetMapping
    public CandidateProfileResponse getMyProfile(Authentication authentication) {
        return candidateProfileService.getMyProfile(authentication.getName());
    }

    @PutMapping
    public CandidateProfileResponse updateMyProfile(
            @RequestBody UpdateCandidateProfileRequest request,
            Authentication authentication
    ) {
        return candidateProfileService.updateMyProfile(authentication.getName(), request);
    }

    @GetMapping("/dashboard")
    public CandidateDashboardResponse getMyDashboard(Authentication authentication) {
        return candidateProfileService.getMyDashboard(authentication.getName());
    }
}