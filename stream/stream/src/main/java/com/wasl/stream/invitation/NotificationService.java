package com.wasl.stream.invitation;

import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import com.wasl.stream.invitation.dto.NotificationDTO;
import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import com.wasl.stream.keycloak.KeycloakUserService;
import com.wasl.stream.security.dto.KeycloakUser;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final KeycloakUserService keycloakUserService;

    public NotificationService(NotificationRepository notificationRepository, KeycloakUserService keycloakUserService) {
        this.notificationRepository = notificationRepository;
        this.keycloakUserService = keycloakUserService;
    }

    public List<NotificationDTO> getUnreadNotifications(){
        KeycloakUser user = getUser();

        List<NotificationEntity> notificationEntityList = notificationRepository.findByUserIdAndStatus(UUID.fromString(user.getId()), NotificationStatus.UNREAD);

        List<String> userIds = notificationEntityList.stream()
                        .map(notificationEntity -> {
                            NotificationType type = notificationEntity.getType();
                            if(type.equals(NotificationType.INVITATION)) return notificationEntity.getInvitation().getOwnerId().toString();
                            else return notificationEntity.getInvitation().getParticipantId().toString();
                        }).toList();

        Map<UUID, KeycloakUserDTO> userDTOMap = keycloakUserService.getUsersByIds(userIds);

        return notificationEntityList.stream()
                .map(notificationEntity -> {
                    NotificationType type = notificationEntity.getType();
                    UUID userId;
                    if(type.equals(NotificationType.INVITATION)) userId = notificationEntity.getInvitation().getOwnerId();
                    else userId = notificationEntity.getInvitation().getParticipantId();

                    return new NotificationDTO(notificationEntity.getId().toString(),
                            notificationEntity.getInvitation().getMeetingId().toString(),
                            notificationEntity.getType(),
                            notificationEntity.getMessage(),
                            notificationEntity.getStatus(),
                            notificationEntity.getInvitation().getStatus(),
                            userDTOMap.get(userId));
                }).toList();
    }

    @Transactional
    public boolean markAsRead(String notificationId) {
        KeycloakUser user = getUser();
        Optional<NotificationEntity> optionalNotificationEntity = notificationRepository.findByIdAndUserIdAndType(UUID.fromString(notificationId),
                        UUID.fromString(user.getId()), NotificationType.RESPONSE);

        if(optionalNotificationEntity.isEmpty()) return false;

        NotificationEntity notificationEntity = optionalNotificationEntity.get();
        notificationEntity.setStatus(NotificationStatus.READ);
        notificationRepository.save(notificationEntity);
        return true;
    }

    private KeycloakUser getUser(){
        return (KeycloakUser) SecurityContextHolder.getContext().getAuthentication();
    }

}