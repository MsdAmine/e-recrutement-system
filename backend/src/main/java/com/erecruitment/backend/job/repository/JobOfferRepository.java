package com.erecruitment.backend.job.repository;

import com.erecruitment.backend.job.entity.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByActiveTrueOrderByCreatedAtDesc();
    List<JobOffer> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
}