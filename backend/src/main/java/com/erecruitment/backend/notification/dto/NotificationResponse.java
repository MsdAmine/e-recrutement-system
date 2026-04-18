package com.erecruitment.backend.notification.dto;

import com.erecruitment.backend.common.enums.NotificationType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NotificationResponse(
        Long id,
        String message,
        NotificationType type,
        Boolean read,
        LocalDateTime createdAt,
        Long recipientId,
        String recipientEmail
) {
}