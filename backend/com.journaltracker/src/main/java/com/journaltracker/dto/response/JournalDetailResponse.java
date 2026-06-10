package com.journaltracker.dto.response;

import lombok.Data;

@Data
public class JournalDetailResponse {

    private Long id;

    private String name;

    private String issn;

    private String publisher;

    private String field;

    private Integer paperCount;

    private Boolean isFollowed;
}
