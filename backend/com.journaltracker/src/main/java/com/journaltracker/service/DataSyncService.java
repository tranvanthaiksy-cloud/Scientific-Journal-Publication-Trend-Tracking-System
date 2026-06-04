package com.journaltracker.service;

import com.journaltracker.dto.SyncResult;

import java.time.LocalDate;

public interface DataSyncService {
    SyncResult syncFromSource(String sourceName, String query);
    SyncResult syncRecentPapers(String sourceName, LocalDate fromDate);
    SyncResult syncAllSources(String query);
}