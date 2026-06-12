package com.journaltracker.service;

import com.journaltracker.dto.request.FollowResquest;
import com.journaltracker.dto.response.FollowResponse;
import com.journaltracker.entity.FollowType;

import java.util.List;

public interface FollowService {
    public FollowResponse follow(String username, FollowResquest request);
    public void unfollow(String username, long followerId);
    public boolean isFollowing(String username, FollowResquest request);
    public List<FollowResponse> getMyFollowers(String username, FollowType type);

}
