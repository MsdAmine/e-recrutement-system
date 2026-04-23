package com.erecruitment.backend.recruiter.repository;

import com.erecruitment.backend.recruiter.entity.RecruiterProfile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<RecruiterProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
