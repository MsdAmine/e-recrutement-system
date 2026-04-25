package com.erecruitment.backend.matching.controller;

import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.matching.dto.MatchResultDTO;
import com.erecruitment.backend.matching.service.MatchingService;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class MatchingController {

    private final MatchingService matchingService;
    private final UserRepository userRepository;

    @GetMapping
    public List<MatchResultDTO> getMatchesForLoggedInCandidate(Authentication authentication) {
        Long candidateId = resolveAuthenticatedUserId(authentication);
        return matchingService.getMatchesForCandidate(candidateId);
    }

    @GetMapping("/{jobId}")
    public MatchResultDTO getMatchForJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        Long candidateId = resolveAuthenticatedUserId(authentication);
        return matchingService.getMatchForCandidateAndJob(candidateId, jobId);
    }

    private Long resolveAuthenticatedUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }
}
