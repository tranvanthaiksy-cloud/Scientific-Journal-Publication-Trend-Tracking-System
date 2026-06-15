package com.journaltracker.dto.request;

import com.journaltracker.entity.FollowType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FollowResquest {
    private long targetId;
    private FollowType followType;
}
