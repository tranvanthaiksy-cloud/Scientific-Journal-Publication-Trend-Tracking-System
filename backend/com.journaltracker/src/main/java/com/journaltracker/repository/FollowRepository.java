package com.journaltracker.repository;

import com.journaltracker.dto.response.FollowResponse;
import com.journaltracker.entity.Follow;
import com.journaltracker.entity.FollowType;
import com.journaltracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByUserUsernameAndFollowTypeAndTargetId(
            String username,
            String followType,
            Long targetId
    );

    boolean existsByUserAndFollowTypeAndTargetId(User user, FollowType followType, long targetId);
    Follow findByUserAndTargetId(User user, long targetId);

    List<Follow> findByUser(User user);

    List<Follow> findByUserAndFollowType(User user, FollowType type);
}
