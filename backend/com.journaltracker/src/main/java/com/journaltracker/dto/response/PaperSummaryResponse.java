package com.journaltracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaperSummaryResponse {

    private Long id;

    private String title;

    private Integer publicationYear;

    private String journalName;

    private List<String> authors;

    private List<String> keywords;
}
