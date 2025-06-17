package com.wasl.stream.invitation.dto;

import com.wasl.stream.invitation.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public record CreateInviteCommand(
        UUID meetingId,
        List<UUID> participantsId,
        String message,
        NotificationType type) {}
