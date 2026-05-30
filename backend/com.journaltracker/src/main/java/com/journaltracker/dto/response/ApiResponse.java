package com.journaltracker.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T body;
    public static <T> ApiResponse<T> success(
            String message,
            T body
    ) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .body(body)
                .build();
    }
    public static <T> ApiResponse<T> success(T body) {
        return success("success", body);
    }
    public static <T> ApiResponse<T> error(String message, T body) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .body(body)
                .build();
    }
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .body(null)
                .build();
    }
}