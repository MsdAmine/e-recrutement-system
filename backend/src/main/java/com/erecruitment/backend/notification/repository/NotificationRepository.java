package com.erecruitment.backend.notification.repository;

import com.erecruitment.backend.notification.entity.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @EntityGraph(attributePaths = {"recipient"})
    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Long recipientId);

    @EntityGraph(attributePaths = {"recipient"})
    Optional<Notification> findWithRecipientById(Long id);

    @EntityGraph(attributePaths = {"recipient"})
    Page<Notification> findByRecipientId(Long recipientId, Pageable pageable);

    @EntityGraph(attributePaths = {"recipient"})
    Page<Notification> findByRecipientIdAndReadFalse(Long recipientId, Pageable pageable);
}