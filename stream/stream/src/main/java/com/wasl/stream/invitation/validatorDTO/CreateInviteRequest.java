package com.wasl.stream.invitation.validatorDTO;

import com.wasl.stream.invitation.enums.NotificationType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateInviteRequest(
        @NotNull(message = "need to provide meeting Id")
        UUID meetingId,
        @NotNull(message = "need to know to whom requested")
        @NotEmpty(message = "Need to select participants")
        List<UUID> participantsId,
        String message,
        NotificationType type) {}
