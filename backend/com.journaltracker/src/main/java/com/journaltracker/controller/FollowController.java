package com.journaltracker.controller;

import com.journaltracker.dto.request.FollowResquest;
import com.journaltracker.dto.response.ApiResponse;
import com.journaltracker.dto.response.FollowResponse;
import com.journaltracker.entity.FollowType;
import com.journaltracker.service.FollowService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/follows")
public class FollowController {
    private final FollowService followService;
    @PostMapping()
    public ResponseEntity<ApiResponse<FollowResponse>> follow(Authentication authentication,
                                                              @RequestBody FollowResquest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        followService.follow(authentication.getName(), request)
                ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> unfollow(Authentication authentication, @PathVariable Long id) {
        followService.unfollow(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<FollowResponse>>> getFollows(Authentication authentication,
                                                                        @RequestParam(required = false)FollowType type){
        List<FollowResponse> followers = followService.getMyFollowers(authentication.getName(), type);
        return ResponseEntity.ok(ApiResponse.success(followers));
    }
}
