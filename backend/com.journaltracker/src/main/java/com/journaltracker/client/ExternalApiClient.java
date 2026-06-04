package com.journaltracker.client;

import com.journaltracker.dto.RawPaperData;

import java.time.LocalDate;
import java.util.List;

public interface ExternalApiClient {
    String getSourceName();   // "OpenAlex", "Crossref", "SemanticScholar"
    List<RawPaperData> fetchPapers(String query, int page, int pageSize);
    List<RawPaperData> fetchRecentPapers(LocalDate fromDate, int page, int pageSize);
    boolean isAvailable();    // health check
}
