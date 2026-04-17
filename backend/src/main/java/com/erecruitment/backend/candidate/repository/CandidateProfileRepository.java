package com.erecruitment.backend.candidate.repository;

import com.erecruitment.backend.candidate.entity.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}