package com.journaltracker.service.impl;

import com.journaltracker.dto.request.FollowResquest;
import com.journaltracker.dto.response.FollowResponse;
import com.journaltracker.entity.*;
import com.journaltracker.exception.AccessDeniedException;
import com.journaltracker.exception.DuplicateResourceException;
import com.journaltracker.exception.ResourceNotFoundException;
import com.journaltracker.repository.FollowRepository;
import com.journaltracker.repository.JournalRepository;
import com.journaltracker.repository.KeywordRepository;
import com.journaltracker.repository.ResearchTopicRepository;
import com.journaltracker.service.FollowService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
@AllArgsConstructor
@Builder
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserServiceImpl userService;
    private final JournalRepository journalRepository;
    private final ResearchTopicRepository researchTopicRepository;
    private final KeywordRepository keywordRepository;
    @Override
    public FollowResponse follow(String username, FollowResquest request) {
        User user = userService.getUserByUsername(username);
        if (followRepository.existsByUserAndFollowTypeAndTargetId(
                user,
                request.getFollowType(),
                request.getTargetId())) {
            throw new DuplicateResourceException("Already followed");
        }
        String name = getTargetName(request.getTargetId(),request.getFollowType());
        Follow follow = new Follow();
        follow.setUser(user);
        follow.setTargetId(request.getTargetId());
        follow.setFollowType(request.getFollowType());
        Follow savedFollow = followRepository.save(follow);
        FollowResponse response = FollowResponse.builder()
                .id(savedFollow.getId())
                .targetId(savedFollow.getTargetId())
                .targetName(name)
                .followType(savedFollow.getFollowType())
                .build();
        return response;
    }

    @Override
    public void unfollow(String username, long followerId) {
        User user = userService.getUserByUsername(username);
        Follow follow = followRepository.findById(followerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Follow not found"));
        if (!follow.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not your follow");
        }
        followRepository.delete(follow);
    }

    @Override
    public boolean isFollowing(String username, FollowResquest request) {
        User user = userService.getUserByUsername(username);
        return followRepository.existsByUserAndFollowTypeAndTargetId(
                user,
                request.getFollowType(),
                request.getTargetId())
        ;
    }

    @Override
    public List<FollowResponse> getMyFollowers(String username, FollowType type) {

        User user = userService.getUserByUsername(username);

        List<Follow> follows;

        if (type == null) {
            follows = followRepository.findByUser(user);
        } else {
            follows = followRepository.findByUserAndFollowType(user, type);
        }

        return follows.stream()
                .map(this::toResponse)
                .toList();
    }

    private FollowResponse toResponse(Follow follow) {
        return FollowResponse.builder()
                .id(follow.getId())
                .followType(follow.getFollowType())
                .targetId(follow.getTargetId())
                .targetName(
                        getTargetName(
                                follow.getTargetId(),
                                follow.getFollowType()))
                .createdAt(follow.getCreatedAt())
                .build();
    }

    public String getTargetName(long targetId, FollowType type){
            switch (type) {

                case JOURNAL:
                    Journal journal = journalRepository.findById(targetId)
                            .orElseThrow(() -> new ResourceNotFoundException("Journal not found with id: " + targetId));

                    return journal.getName();

                case TOPIC:
                    ResearchTopic topic = researchTopicRepository.findById(targetId)
                            .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + targetId));

                    return topic.getName();

                case KEYWORD:
                    Keyword keyword = keywordRepository.findById(targetId)
                            .orElseThrow(() ->new ResourceNotFoundException("TKeyword not found with id " + targetId));
                    return keyword.getName();

                default:
                    throw new IllegalArgumentException(
                            "Invalid follow type: " + type);
            }
    }
}
