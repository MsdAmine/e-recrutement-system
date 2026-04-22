package com.erecruitment.backend.job.repository;

import com.erecruitment.backend.job.entity.JobOffer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    @EntityGraph(attributePaths = {"recruiter"})
    Page<JobOffer> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"recruiter"})
    Page<JobOffer> findByRecruiterId(Long recruiterId, Pageable pageable);

    long countByRecruiterId(Long recruiterId);
    long countByRecruiterIdAndActiveTrue(Long recruiterId);
    long countByRecruiterIdAndActiveFalse(Long recruiterId);
}