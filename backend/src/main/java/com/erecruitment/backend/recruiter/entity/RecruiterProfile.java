package com.erecruitment.backend.recruiter.entity;

import com.erecruitment.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiter_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 255)
    private String companyName;

    @Column(length = 255)
    private String companyWebsite;

    @Column(length = 255)
    private String companySector;

    @Column(columnDefinition = "TEXT")
    private String companyDescription;
}