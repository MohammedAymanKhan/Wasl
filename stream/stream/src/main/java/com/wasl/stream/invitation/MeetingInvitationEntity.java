package com.wasl.stream.invitation;

import com.wasl.stream.invitation.enums.InvitationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "meeting_invitations")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
class MeetingInvitationEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "meeting_id", nullable = false)
    private UUID meetingId;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "participant_id", nullable = false)
    private UUID participantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'JOINED') DEFAULT 'PENDING'")
    private InvitationStatus status = InvitationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}