package com.erecruitment.backend.application.repository;

import com.erecruitment.backend.application.entity.JobApplication;
import com.erecruitment.backend.common.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByCandidateIdAndJobOfferId(Long candidateId, Long jobOfferId);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Optional<JobApplication> findByIdAndJobOfferRecruiterId(Long id, Long recruiterId);

    long countByCandidateId(Long candidateId);

    long countByCandidateIdAndStatus(Long candidateId, com.erecruitment.backend.common.enums.ApplicationStatus status);

    long countByJobOfferRecruiterId(Long recruiterId);

    long countByJobOfferRecruiterIdAndStatus(Long recruiterId,
            com.erecruitment.backend.common.enums.ApplicationStatus status);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Page<JobApplication> findByCandidateId(Long candidateId, Pageable pageable);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Page<JobApplication> findByJobOfferRecruiterId(Long recruiterId, Pageable pageable);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Page<JobApplication> findByJobOfferRecruiterIdAndStatus(
            Long recruiterId,
            ApplicationStatus status,
            Pageable pageable);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Page<JobApplication> findByJobOfferId(Long jobOfferId, Pageable pageable);

    @EntityGraph(attributePaths = { "candidate", "jobOffer" })
    Optional<JobApplication> findWithRelationsById(Long id);
}