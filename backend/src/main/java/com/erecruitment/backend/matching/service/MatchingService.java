package com.erecruitment.backend.matching.service;

import com.erecruitment.backend.candidate.entity.CandidateProfile;
import com.erecruitment.backend.candidate.repository.CandidateProfileRepository;
import com.erecruitment.backend.common.exception.ResourceNotFoundException;
import com.erecruitment.backend.job.entity.JobOffer;
import com.erecruitment.backend.job.repository.JobOfferRepository;
import com.erecruitment.backend.matching.dto.MatchResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private static final double SKILL_WEIGHT = 0.40;
    private static final double EXPERIENCE_WEIGHT = 0.25;
    private static final double LOCATION_WEIGHT = 0.15;
    private static final double SALARY_WEIGHT = 0.10;
    private static final double CONTRACT_WEIGHT = 0.10;

    private static final double RULE_BASED_FINAL_WEIGHT = 0.60;
    private static final double SEMANTIC_FINAL_WEIGHT = 0.40;

    @Value("${app.matching.max-results:30}")
    private int maxResults;

    private final CandidateProfileRepository candidateProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final EmbeddingService embeddingService;

    public MatchResultDTO calculateMatchScore(CandidateProfile candidate, JobOffer job) {
        Set<String> candidateSkills = parseSkills(candidate.getSkills());
        Set<String> requiredSkills = parseSkills(job.getRequiredSkills());

        int skillScore = calculateSkillScore(candidateSkills, requiredSkills);
        int experienceScore = calculateExperienceScore(candidate, job);
        int locationScore = calculateLocationScore(candidate, job);
        int salaryScore = calculateSalaryScore(candidate, job);
        int contractScore = calculateContractScore(candidate, job);

        int ruleBasedScore = calculateRuleBasedScore(
                candidateSkills,
                skillScore,
                experienceScore,
                locationScore,
                salaryScore,
                contractScore
        );

        boolean semanticScoreAvailable = true;
        int semanticScore;
        try {
            semanticScore = clampScore((int) Math.round(computeSemanticScore(candidate, job)));
        } catch (RuntimeException ex) {
            semanticScoreAvailable = false;
            semanticScore = ruleBasedScore;
        }

        int finalScore = semanticScoreAvailable
                ? clampScore((int) Math.round((RULE_BASED_FINAL_WEIGHT * ruleBasedScore) + (SEMANTIC_FINAL_WEIGHT * semanticScore)))
                : ruleBasedScore;

        Map<String, Integer> breakdown = new LinkedHashMap<>();
        breakdown.put("skills", skillScore);
        breakdown.put("experience", experienceScore);
        breakdown.put("location", locationScore);
        breakdown.put("salary", salaryScore);
        breakdown.put("contract", contractScore);

        return MatchResultDTO.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .contractType(job.getContractType())
                .salary(job.getSalary())
                .score(finalScore)
                .matchCategory(resolveMatchCategory(finalScore))
                .ruleBasedScore(ruleBasedScore)
                .semanticScore(semanticScore)
                .breakdown(breakdown)
                .explanations(buildExplanations(
                        candidate,
                        job,
                        breakdown,
                        candidateSkills,
                        requiredSkills,
                        semanticScore,
                        semanticScoreAvailable
                ))
                .build();
    }

    public double computeSemanticScore(CandidateProfile candidate, JobOffer job) {
        String candidateText = buildCandidateText(candidate);
        String jobText = buildJobText(job);

        List<Double> candidateEmbedding = getCandidateEmbedding(candidate, candidateText);
        List<Double> jobEmbedding = getJobEmbedding(job, jobText);

        double similarity = cosineSimilarity(candidateEmbedding, jobEmbedding);
        double normalizedSimilarity = clampDouble(similarity, 0.0, 1.0);
        return normalizedSimilarity * 100.0;
    }

    @Cacheable(value = "candidateMatches", key = "#candidateId")
    public List<MatchResultDTO> getMatchesForCandidate(Long candidateId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        return jobOfferRepository.findByActiveTrue().stream()
                .map(job -> calculateMatchScore(candidate, job))
                .sorted(Comparator
                        .comparingInt(MatchResultDTO::score)
                        .reversed()
                        .thenComparing(MatchResultDTO::jobId, Comparator.reverseOrder()))
                .limit(maxResults > 0 ? maxResults : Long.MAX_VALUE)
                .toList();
    }

    @Cacheable(value = "candidateJobMatches", key = "#candidateId + ':' + #jobId")
    public MatchResultDTO getMatchForCandidateAndJob(Long candidateId, Long jobId) {
        CandidateProfile candidate = candidateProfileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));

        JobOffer jobOffer = jobOfferRepository.findOneWithRecruiterById(jobId)
                .filter(JobOffer::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Job offer not found"));

        return calculateMatchScore(candidate, jobOffer);
    }

    private int calculateRuleBasedScore(
            Set<String> candidateSkills,
            int skillScore,
            int experienceScore,
            int locationScore,
            int salaryScore,
            int contractScore
    ) {
        int weightedTotalScore = (int) Math.round(
                (skillScore * SKILL_WEIGHT)
                        + (experienceScore * EXPERIENCE_WEIGHT)
                        + (locationScore * LOCATION_WEIGHT)
                        + (salaryScore * SALARY_WEIGHT)
                        + (contractScore * CONTRACT_WEIGHT)
        );

        return candidateSkills.isEmpty() ? 0 : clampScore(weightedTotalScore);
    }

    private int calculateSkillScore(Set<String> candidateSkills, Set<String> requiredSkills) {
        if (requiredSkills.isEmpty() || candidateSkills.isEmpty()) {
            return 0;
        }

        long matches = requiredSkills.stream()
                .filter(candidateSkills::contains)
                .count();

        return clampScore((int) Math.round((matches * 100.0) / requiredSkills.size()));
    }

    private int calculateExperienceScore(CandidateProfile candidate, JobOffer job) {
        int candidateYears = Math.max(0, candidate.getYearsOfExperience() == null ? 0 : candidate.getYearsOfExperience());
        int requiredYears = Math.max(0, job.getRequiredExperienceYears() == null ? 0 : job.getRequiredExperienceYears());

        if (requiredYears == 0) {
            return 100;
        }

        if (candidateYears >= requiredYears) {
            return 100;
        }

        return clampScore((int) Math.round((candidateYears * 100.0) / requiredYears));
    }

    private int calculateLocationScore(CandidateProfile candidate, JobOffer job) {
        String candidateLocationRaw = firstNonBlank(candidate.getPreferredLocation(), candidate.getAddress());
        if (candidateLocationRaw == null || isBlank(job.getLocation())) {
            return 30;
        }

        LocationParts candidateLocation = parseLocation(candidateLocationRaw);
        LocationParts jobLocation = parseLocation(job.getLocation());

        if (!candidateLocation.city().isEmpty() && candidateLocation.city().equals(jobLocation.city())) {
            return 100;
        }

        if (!candidateLocation.country().isEmpty() && candidateLocation.country().equals(jobLocation.country())) {
            return 70;
        }

        return 30;
    }

    private int calculateSalaryScore(CandidateProfile candidate, JobOffer job) {
        if (candidate.getExpectedSalary() == null || job.getSalary() == null) {
            return 50;
        }

        return candidate.getExpectedSalary().compareTo(job.getSalary()) <= 0 ? 100 : 50;
    }

    private int calculateContractScore(CandidateProfile candidate, JobOffer job) {
        if (isBlank(candidate.getPreferredContractType()) || isBlank(job.getContractType())) {
            return 50;
        }

        return normalize(candidate.getPreferredContractType()).equals(normalize(job.getContractType()))
                ? 100
                : 50;
    }

    private List<String> buildExplanations(
            CandidateProfile candidate,
            JobOffer job,
            Map<String, Integer> breakdown,
            Set<String> candidateSkills,
            Set<String> requiredSkills,
            int semanticScore,
            boolean semanticScoreAvailable
    ) {
        List<String> explanations = new ArrayList<>();

        Set<String> matchedSkills = requiredSkills.stream()
                .filter(candidateSkills::contains)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        if (!semanticScoreAvailable) {
            explanations.add("Semantic matching is temporarily unavailable, so this score uses rule-based matching only");
        } else if (semanticScore >= 85) {
            explanations.add("Strong semantic similarity with your profile");
        } else if (semanticScore >= 70) {
            explanations.add("Job description closely matches your profile");
        } else if (semanticScore >= 50) {
            explanations.add("Moderate semantic overlap with your profile");
        } else {
            explanations.add("Limited semantic similarity with the job description");
        }

        int skillScore = breakdown.getOrDefault("skills", 0);
        if (skillScore >= 80 && !matchedSkills.isEmpty()) {
            explanations.add("Strong skill match (" + String.join(", ", matchedSkills.stream().limit(3).toList()) + ")");
        } else if (skillScore > 0) {
            explanations.add("Partial skill match with required technologies");
        } else {
            explanations.add("Missing most required skills for this role");
        }

        int experienceScore = breakdown.getOrDefault("experience", 0);
        if (experienceScore == 100) {
            explanations.add("Experience level meets or exceeds the requirement");
        } else if (experienceScore >= 70) {
            explanations.add("Experience is slightly below requirement");
        } else {
            explanations.add("Experience gap compared to role expectations");
        }

        int locationScore = breakdown.getOrDefault("location", 30);
        if (locationScore == 100) {
            explanations.add("Perfect location match");
        } else if (locationScore == 70) {
            explanations.add("Location aligns at country level");
        } else {
            explanations.add("Location is outside your preferred area");
        }

        int salaryScore = breakdown.getOrDefault("salary", 50);
        if (salaryScore == 100) {
            explanations.add("Salary is within your expected range");
        } else if (candidate.getExpectedSalary() == null || job.getSalary() == null) {
            explanations.add("Salary comparison is limited due to missing data");
        } else {
            explanations.add("Salary expectations are slightly higher than offered");
        }

        int contractScore = breakdown.getOrDefault("contract", 50);
        if (contractScore == 100) {
            explanations.add("Preferred contract type matches this offer");
        } else if (isBlank(candidate.getPreferredContractType())) {
            explanations.add("No preferred contract type set on your profile");
        } else {
            explanations.add("Contract type differs from your preference");
        }

        return explanations;
    }

    private List<Double> getCandidateEmbedding(CandidateProfile candidate, String candidateText) {
        Long candidateId = candidate.getUser() != null ? candidate.getUser().getId() : null;
        if (candidateId == null) {
            return embeddingService.getEmbedding(candidateText);
        }
        return embeddingService.getCandidateEmbedding(candidateId, candidateText);
    }

    private List<Double> getJobEmbedding(JobOffer job, String jobText) {
        if (job.getId() == null) {
            return embeddingService.getEmbedding(jobText);
        }
        return embeddingService.getJobEmbedding(job.getId(), jobText);
    }

    private String buildCandidateText(CandidateProfile candidate) {
        return Stream.of(
                        "Headline: " + safeValue(candidate.getHeadline()),
                        "Summary: " + safeValue(candidate.getSummary()),
                        "Skills: " + safeValue(candidate.getSkills())
                )
                .collect(Collectors.joining("\n"));
    }

    private String buildJobText(JobOffer job) {
        return Stream.of(
                        "Title: " + safeValue(job.getTitle()),
                        "Description: " + safeValue(job.getDescription()),
                        "Required skills: " + safeValue(job.getRequiredSkills())
                )
                .collect(Collectors.joining("\n"));
    }

    private double cosineSimilarity(List<Double> left, List<Double> right) {
        if (left == null || right == null || left.isEmpty() || right.isEmpty()) {
            return 0.0;
        }

        int dimensions = Math.min(left.size(), right.size());
        double dotProduct = 0.0;
        double leftNorm = 0.0;
        double rightNorm = 0.0;

        for (int i = 0; i < dimensions; i++) {
            double leftValue = left.get(i);
            double rightValue = right.get(i);
            dotProduct += leftValue * rightValue;
            leftNorm += leftValue * leftValue;
            rightNorm += rightValue * rightValue;
        }

        if (leftNorm == 0.0 || rightNorm == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
    }

    private Set<String> parseSkills(String rawSkills) {
        if (isBlank(rawSkills)) {
            return Set.of();
        }

        return List.of(rawSkills.split("[,;\\n]")).stream()
                .map(String::trim)
                .filter(skill -> !skill.isEmpty())
                .map(this::normalize)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private LocationParts parseLocation(String rawLocation) {
        if (isBlank(rawLocation)) {
            return new LocationParts("", "");
        }

        String[] parts = rawLocation.split(",");
        String city = normalize(parts[0]);
        String country = parts.length > 1 ? normalize(parts[parts.length - 1]) : "";
        return new LocationParts(city, country);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private String safeValue(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String firstNonBlank(String first, String second) {
        if (!isBlank(first)) {
            return first;
        }
        if (!isBlank(second)) {
            return second;
        }
        return null;
    }

    private int clampScore(int value) {
        return Math.max(0, Math.min(100, value));
    }

    private String resolveMatchCategory(int score) {
        if (score >= 80) {
            return "HIGH_MATCH";
        }
        if (score >= 60) {
            return "GOOD_MATCH";
        }
        return "EXPLORE";
    }

    private double clampDouble(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private record LocationParts(String city, String country) {
    }
}
