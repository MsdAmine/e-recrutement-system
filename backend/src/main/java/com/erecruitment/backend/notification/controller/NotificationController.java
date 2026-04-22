package com.erecruitment.backend.notification.controller;

import com.erecruitment.backend.notification.dto.NotificationResponse;
import com.erecruitment.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Page<NotificationResponse> getMyNotifications(
            Authentication authentication,
            Pageable pageable
    ) {
        return notificationService.getMyNotifications(authentication.getName(), pageable);
    }

    @GetMapping("/unread")
    public Page<NotificationResponse> getMyUnreadNotifications(
            Authentication authentication,
            Pageable pageable
    ) {
        return notificationService.getMyUnreadNotifications(authentication.getName(), pageable);
    }

    @PatchMapping("/{notificationId}/read")
    public NotificationResponse markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {
        return notificationService.markAsRead(notificationId, authentication.getName());
    }

    @PatchMapping("/read-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
    }
}