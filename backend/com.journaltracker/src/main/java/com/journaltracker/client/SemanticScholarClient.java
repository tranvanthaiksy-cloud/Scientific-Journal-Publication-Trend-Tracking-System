package com.journaltracker.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.journaltracker.dto.RawPaperData;
import com.google.common.util.concurrent.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SemanticScholarClient implements ExternalApiClient {

    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    // 100 requests / 5 minutes
    private static final RateLimiter RATE_LIMITER =
            RateLimiter.create(100.0 / (5 * 60));

    @Value("${external-api.semanticscholar.base-url}")
    private String baseUrl;

    @Value("${external-api.semanticscholar.api-key:}")
    private String apiKey;

    @Override
    public String getSourceName() {
        return "SemanticScholar";
    }

    @Override
    public List<RawPaperData> fetchPapers(String query, int page, int pageSize) {

        RATE_LIMITER.acquire();

        int offset = (page - 1) * pageSize;

        String url = UriComponentsBuilder
                .fromUriString(baseUrl + "/graph/v1/paper/search")
                .queryParam("query", query)
                .queryParam("limit", pageSize)
                .queryParam("offset", offset)
                .queryParam("fields", "title,abstract,year,authors,journal,externalIds")
                .toUriString();

        System.out.println("URL = " + url);

        String body;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-api-key", apiKey)
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("STATUS = " + response.statusCode());

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                        "Semantic Scholar API failed: " + response.statusCode()
                );
            }

            body = response.body();

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Semantic Scholar API", e);
        }

        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode papers = root.path("data");

            List<RawPaperData> results = new ArrayList<>();

            for (JsonNode paper : papers) {

                // ===== AUTHORS =====
                List<String> authors = new ArrayList<>();
                JsonNode authorNodes = paper.path("authors");

                if (authorNodes.isArray()) {
                    for (JsonNode author : authorNodes) {
                        String name = author.path("name").asText(null);
                        if (name != null && !name.isEmpty()) {
                            authors.add(name);
                        }
                    }
                }

                // ===== DOI =====
                JsonNode externalIds = paper.path("externalIds");
                String doi = (externalIds != null && !externalIds.isMissingNode())
                        ? externalIds.path("DOI").asText("")
                        : "";

                // ===== JOURNAL =====
                JsonNode journalNode = paper.path("journal");
                String journalName = (journalNode != null
                        && !journalNode.isMissingNode()
                        && !journalNode.isNull())
                        ? journalNode.path("name").asText("")
                        : "";

                // ===== BUILD DTO =====
                RawPaperData rawPaper = RawPaperData.builder()
                        .doi(doi)
                        .title(paper.path("title").asText(""))
                        .abstractText(paper.path("abstract").asText(""))
                        .publicationYear(
                                paper.path("year").isMissingNode()
                                        ? null
                                        : paper.path("year").asInt()
                        )
                        .journalName(journalName)
                        .authorNames(authors)
                        .build();

                results.add(rawPaper);
            }

            return results;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Semantic Scholar response", e);
        }
    }

    @Override
    public List<RawPaperData> fetchRecentPapers(java.time.LocalDate fromDate, int page, int pageSize) {
        String query = "year:" + fromDate.getYear();
        return fetchPapers(query, page, pageSize);
    }

    @Override
    public boolean isAvailable() {
        try {
            String url = baseUrl + "/graph/v1/paper/search?query=AI&limit=1";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-api-key", apiKey)
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            return response.statusCode() == 200;

        } catch (Exception e) {
            return false;
        }
    }
}