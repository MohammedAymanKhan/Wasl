package com.wasl.stream.invitation;

import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
    @EntityGraph(attributePaths = {"invitation"})
    Optional<NotificationEntity> findByIdAndUserId(UUID id, UUID userId);

    Optional<NotificationEntity> findByIdAndUserIdAndType(UUID id, UUID userId, NotificationType type);

    @EntityGraph(attributePaths = {"invitation"})
    List<NotificationEntity> findByUserIdAndStatus(UUID userId, NotificationStatus status);

}
