package com.journaltracker.dto;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
@Data
public class SyncResult {
    String sourceName;
    int totalFetched;
    int newPapers;
    int duplpicates;
    int errors;
    LocalDate synceAt;
}