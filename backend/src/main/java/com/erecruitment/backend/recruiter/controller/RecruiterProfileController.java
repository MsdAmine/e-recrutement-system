package com.erecruitment.backend.recruiter.controller;

import com.erecruitment.backend.recruiter.dto.RecruiterProfileResponse;
import com.erecruitment.backend.recruiter.dto.UpdateRecruiterProfileRequest;
import com.erecruitment.backend.recruiter.service.RecruiterProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiter/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterProfileController {

    private final RecruiterProfileService recruiterProfileService;

    @GetMapping
    public RecruiterProfileResponse getMyProfile(Authentication authentication) {
        return recruiterProfileService.getMyProfile(authentication.getName());
    }

    @PutMapping
    public RecruiterProfileResponse updateMyProfile(
            @RequestBody UpdateRecruiterProfileRequest request,
            Authentication authentication
    ) {
        return recruiterProfileService.updateMyProfile(authentication.getName(), request);
    }
}