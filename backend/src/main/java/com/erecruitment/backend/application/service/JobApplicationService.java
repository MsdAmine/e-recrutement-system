package com.erecruitment.backend.application.service;

import com.erecruitment.backend.application.dto.ApplyJobRequest;
import com.erecruitment.backend.application.dto.JobApplicationResponse;
import com.erecruitment.backend.application.dto.UpdateApplicationStatusRequest;
import com.erecruitment.backend.application.entity.JobApplication;
import com.erecruitment.backend.application.repository.JobApplicationRepository;
import com.erecruitment.backend.common.enums.ApplicationStatus;
import com.erecruitment.backend.common.enums.RoleName;
import com.erecruitment.backend.common.exception.DuplicateApplicationException;
import com.erecruitment.backend.common.exception.ForbiddenOperationException;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.user.entity.User;
import com.erecruitment.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobOfferRepository jobOfferRepository;
    private final UserRepository userRepository;

    public JobApplicationResponse applyToJob(Long jobOfferId, String candidateEmail, ApplyJobRequest request) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (candidate.getRole().getName() != RoleName.ROLE_CANDIDATE) {
            throw new ForbiddenOperationException("Only candidates can apply to job offers.");
        }

        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        if (!jobOffer.isActive()) {
            throw new ForbiddenOperationException("Cannot apply to an inactive job offer.");
        }

        if (jobApplicationRepository.existsByCandidateIdAndJobOfferId(candidate.getId(), jobOfferId)) {
            throw new DuplicateApplicationException("You have already applied to this job offer.");
        }

        JobApplication application = JobApplication.builder()
                .candidate(candidate)
                .jobOffer(jobOffer)
                .coverLetter(request.coverLetter())
                .status(ApplicationStatus.PENDING)
                .build();

        JobApplication saved = jobApplicationRepository.save(application);
        return mapToResponse(saved);
    }

    public List<JobApplicationResponse> getMyApplications(String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        return jobApplicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidate.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public JobApplicationResponse getMyApplicationById(Long applicationId, String candidateEmail) {
        User candidate = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (!application.getCandidate().getId().equals(candidate.getId())) {
            throw new ForbiddenOperationException("You can only access your own applications.");
        }

        return mapToResponse(application);
    }

    public List<JobApplicationResponse> getApplicationsForRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return jobApplicationRepository.findByJobOfferRecruiterIdOrderByAppliedAtDesc(recruiter.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public JobApplicationResponse updateApplicationStatus(
            Long applicationId,
            String recruiterEmail,
            UpdateApplicationStatusRequest request
    ) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        JobApplication application = jobApplicationRepository.findByIdAndJobOfferRecruiterId(applicationId, recruiter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found for this recruiter"));

        application.setStatus(request.status());

        JobApplication updated = jobApplicationRepository.save(application);
        return mapToResponse(updated);
    }

    public List<JobApplicationResponse> getApplicationsForSpecificJobOffer(Long jobOfferId, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        JobOffer jobOffer = jobOfferRepository.findById(jobOfferId)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        if (!jobOffer.getRecruiter().getId().equals(recruiter.getId())) {
            throw new ForbiddenOperationException("You can only access applications for your own job offers.");
        }

        return jobApplicationRepository.findByJobOfferIdOrderByAppliedAtDesc(jobOfferId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .candidateId(application.getCandidate().getId())
                .candidateEmail(application.getCandidate().getEmail())
                .jobOfferId(application.getJobOffer().getId())
                .jobOfferTitle(application.getJobOffer().getTitle())
                .build();
    }
}