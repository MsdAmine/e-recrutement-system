package com.erecruitment.backend.candidate.entity;

import com.erecruitment.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 30)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 255)
    private String headline;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 255)
    private String cvUrl;

    @Column(columnDefinition = "TEXT")
    private String skills;

    private Integer yearsOfExperience;

    @Column(precision = 12, scale = 2)
    private BigDecimal expectedSalary;

    @Column(length = 100)
    private String preferredContractType;

    @Column(length = 255)
    private String preferredLocation;
}
