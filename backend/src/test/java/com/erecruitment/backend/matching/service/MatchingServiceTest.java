package com.erecruitment.backend.matching.service;

import com.erecruitment.backend.candidate.entity.CandidateProfile;
import com.erecruitment.backend.candidate.repository.CandidateProfileRepository;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.matching.dto.MatchResultDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private JobOfferRepository jobOfferRepository;

    @Mock
    private EmbeddingService embeddingService;

    @InjectMocks
    private MatchingService matchingService;

    @BeforeEach
    void setUp() {
        when(embeddingService.getEmbedding(anyString())).thenReturn(List.of(1.0, 0.0));
    }

    @Test
    void perfectMatchShouldReturnMaxScore() {
        CandidateProfile candidate = buildCandidate(
                "Java, Spring Boot, PostgreSQL",
                5,
                "Casablanca, Morocco",
                new BigDecimal("10000"),
                "CDI"
        );

        JobOffer job = buildJob(
                null,
                "Java, Spring Boot, PostgreSQL",
                3,
                "Casablanca, Morocco",
                new BigDecimal("12000"),
                "CDI"
        );

        MatchResultDTO result = matchingService.calculateMatchScore(candidate, job);

        assertEquals(100, result.score());
        assertEquals("HIGH_MATCH", result.matchCategory());
        assertEquals(100, result.ruleBasedScore());
        assertEquals(100, result.semanticScore());
        assertEquals(100, result.breakdown().get("skills"));
        assertTrue(result.explanations().stream().anyMatch(explanation -> explanation.contains("Strong skill match")));
    }

    @Test
    void missingSkillsShouldLowerRuleBasedScore() {
        CandidateProfile candidate = buildCandidate(
                "Java",
                5,
                "Casablanca, Morocco",
                new BigDecimal("10000"),
                "CDI"
        );

        JobOffer job = buildJob(
                null,
                "Java, Spring Boot, PostgreSQL",
                3,
                "Casablanca, Morocco",
                new BigDecimal("12000"),
                "CDI"
        );

        MatchResultDTO result = matchingService.calculateMatchScore(candidate, job);

        assertEquals(33, result.breakdown().get("skills"));
        assertTrue(result.ruleBasedScore() < 80);
        assertTrue(result.score() > result.ruleBasedScore());
        assertEquals("HIGH_MATCH", result.matchCategory());
    }

    @Test
    void wrongLocationShouldApplyPenalty() {
        CandidateProfile candidate = buildCandidate(
                "Java, Spring Boot",
                5,
                "Paris, France",
                new BigDecimal("10000"),
                "CDI"
        );

        JobOffer job = buildJob(
                null,
                "Java, Spring Boot",
                3,
                "Casablanca, Morocco",
                new BigDecimal("12000"),
                "CDI"
        );

        MatchResultDTO result = matchingService.calculateMatchScore(candidate, job);

        assertEquals(30, result.breakdown().get("location"));
    }

    @Test
    void noSkillsShouldReturnZeroScoreWhenSemanticFails() {
        when(embeddingService.getEmbedding(anyString())).thenThrow(new IllegalStateException("provider down"));

        CandidateProfile candidate = buildCandidate(
                null,
                5,
                "Casablanca, Morocco",
                new BigDecimal("10000"),
                "CDI"
        );

        JobOffer job = buildJob(
                null,
                "Java, Spring Boot",
                3,
                "Casablanca, Morocco",
                new BigDecimal("12000"),
                "CDI"
        );

        MatchResultDTO result = matchingService.calculateMatchScore(candidate, job);

        assertEquals(0, result.score());
        assertEquals("EXPLORE", result.matchCategory());
        assertEquals(0, result.ruleBasedScore());
        assertEquals(0, result.breakdown().get("skills"));
        assertTrue(result.explanations().stream().anyMatch(explanation -> explanation.contains("rule-based matching only")));
    }

    @Test
    void rankedMatchesShouldBeSortedAndFiltered() {
        when(embeddingService.getEmbedding(anyString())).thenAnswer(invocation -> {
            String text = invocation.getArgument(0, String.class);
            if (text.contains("React") || text.contains("TypeScript") || text.contains("Berlin")) {
                return List.of(0.0, 1.0);
            }
            return List.of(1.0, 0.0);
        });
        when(embeddingService.getJobEmbedding(anyLong(), anyString())).thenAnswer(invocation -> {
            String text = invocation.getArgument(1, String.class);
            if (text.contains("React") || text.contains("TypeScript") || text.contains("Berlin")) {
                return List.of(0.0, 1.0);
            }
            return List.of(1.0, 0.0);
        });

        CandidateProfile candidate = buildCandidate(
                "Java, Spring Boot, PostgreSQL",
                5,
                "Casablanca, Morocco",
                new BigDecimal("10000"),
                "CDI"
        );

        JobOffer highMatch = buildJob(
                10L,
                "Java, Spring Boot",
                3,
                "Casablanca, Morocco",
                new BigDecimal("12000"),
                "CDI"
        );

        JobOffer lowMatch = buildJob(
                11L,
                "React, TypeScript",
                8,
                "Berlin, Germany",
                new BigDecimal("7000"),
                "FREELANCE"
        );

        when(candidateProfileRepository.findByUserId(99L)).thenReturn(Optional.of(candidate));
        when(jobOfferRepository.findByActiveTrue()).thenReturn(List.of(lowMatch, highMatch));

        List<MatchResultDTO> results = matchingService.getMatchesForCandidate(99L);

        assertEquals(2, results.size());
        assertEquals(10L, results.get(0).jobId());
        assertTrue(results.get(0).score() >= results.get(1).score());
    }

    private CandidateProfile buildCandidate(
            String skills,
            Integer yearsOfExperience,
            String preferredLocation,
            BigDecimal expectedSalary,
            String preferredContractType
    ) {
        return CandidateProfile.builder()
                .skills(skills)
                .yearsOfExperience(yearsOfExperience)
                .preferredLocation(preferredLocation)
                .expectedSalary(expectedSalary)
                .preferredContractType(preferredContractType)
                .headline("Backend Developer")
                .summary("Experienced in backend systems")
                .build();
    }

    private JobOffer buildJob(
            Long id,
            String requiredSkills,
            Integer requiredExperienceYears,
            String location,
            BigDecimal salary,
            String contractType
    ) {
        return JobOffer.builder()
                .id(id)
                .title("Backend Engineer")
                .description("Role description")
                .requiredSkills(requiredSkills)
                .requiredExperienceYears(requiredExperienceYears)
                .location(location)
                .salary(salary)
                .contractType(contractType)
                .active(true)
                .build();
    }
}
