package com.journaltracker.repository;

import com.journaltracker.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    boolean existsByUserUsernameAndFollowTypeAndTargetId(
            String username,
            String followType,
            Long targetId
    );
}
