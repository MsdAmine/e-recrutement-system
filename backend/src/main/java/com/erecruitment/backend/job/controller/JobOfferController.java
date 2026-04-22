package com.erecruitment.backend.job.controller;

import com.erecruitment.backend.job.dto.JobOfferRequest;
import com.erecruitment.backend.job.dto.JobOfferResponse;
import com.erecruitment.backend.job.service.JobOfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping
    public Page<JobOfferResponse> getAllActiveJobOffers(Pageable pageable) {
        return jobOfferService.getAllActiveJobOffers(pageable);
    }

    @GetMapping("/{id}")
    public JobOfferResponse getJobOfferById(@PathVariable Long id) {
        return jobOfferService.getJobOfferById(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RECRUITER')")
    public Page<JobOfferResponse> getMyJobOffers(
            Authentication authentication,
            Pageable pageable
    ) {
        return jobOfferService.getMyJobOffers(authentication.getName(), pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('RECRUITER')")
    public JobOfferResponse createJobOffer(
            @Valid @RequestBody JobOfferRequest request,
            Authentication authentication
    ) {
        return jobOfferService.createJobOffer(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public JobOfferResponse updateJobOffer(
            @PathVariable Long id,
            @Valid @RequestBody JobOfferRequest request,
            Authentication authentication
    ) {
        return jobOfferService.updateJobOffer(id, authentication.getName(), request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('RECRUITER')")
    public void deleteJobOffer(@PathVariable Long id, Authentication authentication) {
        jobOfferService.deleteJobOffer(id, authentication.getName());
    }
}