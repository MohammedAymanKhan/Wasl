package com.wasl.stream.invitation;

import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
class NotificationEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation", referencedColumnName = "id", nullable = false)
    private MeetingInvitationEntity invitation;

    @Column
    private String message;

    @Enumerated(EnumType.STRING)
    @Column
    private NotificationStatus status = NotificationStatus.UNREAD;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}