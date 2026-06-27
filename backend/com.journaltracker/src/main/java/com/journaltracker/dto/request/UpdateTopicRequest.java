package com.journaltracker.dto.request;
import lombok.Data;

@Data
public class UpdateTopicRequest {
    private String name;
    private String description;
    private boolean isTrending;
}