package com.erecruitment.backend.job.service;

import com.erecruitment.backend.common.exception.ForbiddenOperationException;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.job.dto.JobOfferRequest;
import com.erecruitment.backend.job.dto.JobOfferResponse;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;

    public JobOfferResponse createJobOffer(String recruiterEmail, JobOfferRequest request) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        JobOffer jobOffer = JobOffer.builder()
                .title(request.title())
                .description(request.description())
                .contractType(request.contractType())
                .location(request.location())
                .salary(request.salary())
                .active(request.active())
                .recruiter(recruiter)
                .build();

        JobOffer saved = jobOfferRepository.save(jobOffer);
        return mapToResponse(saved);
    }

    public JobOfferResponse updateJobOffer(Long id, String recruiterEmail, JobOfferRequest request) {
        JobOffer jobOffer = jobOfferRepository.findOneWithRecruiterById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        if (!jobOffer.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new ForbiddenOperationException("You can only update your own job offers.");
        }

        jobOffer.setTitle(request.title());
        jobOffer.setDescription(request.description());
        jobOffer.setContractType(request.contractType());
        jobOffer.setLocation(request.location());
        jobOffer.setSalary(request.salary());
        jobOffer.setActive(request.active());

        JobOffer updated = jobOfferRepository.save(jobOffer);
        return mapToResponse(updated);
    }

    public void deleteJobOffer(Long id, String recruiterEmail) {
        JobOffer jobOffer = jobOfferRepository.findOneWithRecruiterById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        if (!jobOffer.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new ForbiddenOperationException("You can only delete your own job offers.");
        }

        jobOfferRepository.delete(jobOffer);
    }

    public Page<JobOfferResponse> getAllActiveJobOffers(Pageable pageable) {
        return jobOfferRepository.findByActiveTrue(pageable)
                .map(this::mapToResponse);
    }

    public JobOfferResponse getJobOfferById(Long id) {
        JobOffer jobOffer = jobOfferRepository.findOneWithRecruiterById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        return mapToResponse(jobOffer);
    }

    public Page<JobOfferResponse> getMyJobOffers(String recruiterEmail, Pageable pageable) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return jobOfferRepository.findByRecruiterId(recruiter.getId(), pageable)
                .map(this::mapToResponse);
    }

    private JobOfferResponse mapToResponse(JobOffer jobOffer) {
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
}
