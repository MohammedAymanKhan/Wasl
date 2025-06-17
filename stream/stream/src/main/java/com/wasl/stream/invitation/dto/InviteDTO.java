package com.wasl.stream.invitation.dto;

import java.util.UUID;

public record InviteDTO(
        UUID id,
        UUID meetingId,
        UUID ownerId,
        UUID participantId,
        String status) {
}
