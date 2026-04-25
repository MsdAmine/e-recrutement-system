package com.erecruitment.backend.job.entity;

import com.erecruitment.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String contractType;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(columnDefinition = "TEXT")
    private String requiredSkills;

    private Integer requiredExperienceYears;

    @Column(nullable = false)
    private boolean active;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;
}
