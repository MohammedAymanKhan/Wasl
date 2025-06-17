package com.wasl.stream.invitation.dto;

import com.wasl.stream.invitation.enums.InvitationStatus;
import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;


public record NotificationDTO(
        String Id,
        String meetingId,
        NotificationType type,
        String message,
        NotificationStatus status,
        InvitationStatus answer,
        KeycloakUserDTO userDTO) {}
