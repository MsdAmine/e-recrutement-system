package com.erecruitment.backend.application.repository;

import com.erecruitment.backend.application.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    boolean existsByCandidateIdAndJobOfferId(Long candidateId, Long jobOfferId);
    List<JobApplication> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);
    List<JobApplication> findByJobOfferRecruiterIdOrderByAppliedAtDesc(Long recruiterId);
    List<JobApplication> findByJobOfferIdOrderByAppliedAtDesc(Long jobOfferId);
    Optional<JobApplication> findByIdAndJobOfferRecruiterId(Long id, Long recruiterId);

}