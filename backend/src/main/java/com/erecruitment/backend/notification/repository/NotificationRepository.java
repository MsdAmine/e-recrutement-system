package com.erecruitment.backend.notification.repository;

import com.erecruitment.backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Long recipientId);

    @EntityGraph(attributePaths = {"recipient"})
    Optional<Notification> findWithRecipientById(Long id);
}