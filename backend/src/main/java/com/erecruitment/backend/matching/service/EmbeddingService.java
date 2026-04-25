package com.erecruitment.backend.matching.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingService {

    @Value("${app.embedding.api-url:https://api.openai.com/v1/embeddings}")
    private String embeddingApiUrl;

    @Value("${app.embedding.api-key:}")
    private String apiKey;

    @Value("${app.embedding.model:text-embedding-3-small}")
    private String model;

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Cacheable(value = "embeddingTextCache", key = "#text")
    public List<Double> getEmbedding(String text) {
        String normalizedText = normalizeText(text);
        if (normalizedText.isEmpty()) {
            return List.of();
        }

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Embedding API key is not configured");
        }

        try {
            String payload = objectMapper.writeValueAsString(Map.of(
                    "model", model,
                    "input", normalizedText
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(embeddingApiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Embedding provider returned HTTP " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode vectorNode = root.path("data").path(0).path("embedding");
            if (!vectorNode.isArray() || vectorNode.isEmpty()) {
                throw new IllegalStateException("Embedding response is missing vector data");
            }

            List<Double> vector = new ArrayList<>(vectorNode.size());
            vectorNode.forEach(value -> vector.add(value.asDouble()));
            return vector;
        } catch (IOException | InterruptedException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("Failed to fetch embedding from provider: {}", ex.getMessage());
            throw new IllegalStateException("Failed to fetch embedding", ex);
        }
    }

    @Cacheable(value = "candidateEmbeddings", key = "#candidateId")
    public List<Double> getCandidateEmbedding(Long candidateId, String text) {
        return getEmbedding(text);
    }

    @Cacheable(value = "jobEmbeddings", key = "#jobId")
    public List<Double> getJobEmbedding(Long jobId, String text) {
        return getEmbedding(text);
    }

    private String normalizeText(String text) {
        if (text == null) {
            return "";
        }
        return text.trim().replaceAll("\\s+", " ");
    }
}
