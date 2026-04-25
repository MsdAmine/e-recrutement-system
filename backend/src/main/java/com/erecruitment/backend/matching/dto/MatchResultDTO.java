package com.erecruitment.backend.matching.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Builder
public record MatchResultDTO(
        Long jobId,
        String title,
        String description,
        String location,
        String contractType,
        BigDecimal salary,
        Integer score,
        String matchCategory,
        Integer ruleBasedScore,
        Integer semanticScore,
        Map<String, Integer> breakdown,
        List<String> explanations
) {
}
