package com.wasl.stream.invitation;

import com.wasl.stream.invitation.dto.CreateInviteCommand;
import com.wasl.stream.invitation.dto.InviteDTO;
import com.wasl.stream.invitation.enums.InvitationStatus;
import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import com.wasl.stream.security.dto.KeycloakUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final NotificationRepository notificationRepository;

    public InvitationService(InvitationRepository invitationRepository, NotificationRepository notificationRepository) {
        this.invitationRepository = invitationRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public List<InviteDTO> createInvite(CreateInviteCommand inviteCommand){
        KeycloakUser user = getUser();
        List<InviteDTO> inviteDTOS = new ArrayList<>();

        for(UUID participantId : inviteCommand.participantsId()) {
            MeetingInvitationEntity invitationEntity = new MeetingInvitationEntity();
            invitationEntity.setMeetingId(inviteCommand.meetingId());
            invitationEntity.setOwnerId(UUID.fromString(user.getId()));
            invitationEntity.setParticipantId(participantId);

            invitationEntity = invitationRepository.save(invitationEntity);

            String message;

            if(inviteCommand.type() != null && !inviteCommand.type().toString().isEmpty()){
                message = inviteCommand.message() == null ? "You've been invited to Join a immediate personal meeting by " + user.getName() :
                        inviteCommand.message();
            }else{
                message = inviteCommand.message() == null ? "You've been invited to a meeting by " + user.getName() :
                        inviteCommand.message();
            }

            createNotification(participantId, invitationEntity, message, inviteCommand.type());

            inviteDTOS.add(new InviteDTO(invitationEntity.getId(), invitationEntity.getMeetingId(),
                    invitationEntity.getOwnerId(), invitationEntity.getParticipantId(),
                    invitationEntity.getStatus().toString()));
        }
        return inviteDTOS;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void createNotification(UUID userId, MeetingInvitationEntity invitationEntity, String message, NotificationType type){
        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setUserId(userId);
        notificationEntity.setType(type);
        notificationEntity.setInvitation(invitationEntity);
        notificationEntity.setMessage(message);
        notificationRepository.save(notificationEntity);
    }

    @Transactional
    public void respondToInvitation(String notificationId, InvitationStatus status) {
        KeycloakUser keycloakUser = getUser();

        Optional<NotificationEntity> optionalNotificationEntity = notificationRepository.findByIdAndUserId(UUID.fromString(notificationId),
                UUID.fromString(keycloakUser.getId()));

         if(optionalNotificationEntity.isEmpty()) return;

        NotificationEntity notificationEntity = optionalNotificationEntity.get();
        notificationEntity.setStatus(NotificationStatus.READ);
        notificationRepository.save(notificationEntity);

        MeetingInvitationEntity invitationEntity = notificationEntity.getInvitation();
        invitationEntity.setStatus(status);
        MeetingInvitationEntity updatedInvitation = invitationRepository.save(invitationEntity);

        String message = keycloakUser.getName() + " has " + status.toString().toLowerCase() + " your meeting invitation";
        createNotification(updatedInvitation.getOwnerId(), updatedInvitation, message, NotificationType.RESPONSE);
    }

    public Set<UUID> getAllInvitedUsers(String invitationId){
        return invitationRepository.findParticipantIdsByMeetingId(UUID.fromString(invitationId));
    }

    public List<UUID> getAllMeetingIdsAsParticipant(){
        KeycloakUser keycloakUser = getUser();
        return invitationRepository.findByParticipantIdAndStatus(UUID.fromString(keycloakUser.getId()), InvitationStatus.ACCEPTED);
    }

    public Map<UUID,List<String>> getParticipantIds(List<UUID> meetingIds){
        return invitationRepository.findByMeetingIdAndStatus(meetingIds, InvitationStatus.ACCEPTED);
    }

    private KeycloakUser getUser(){
        return (KeycloakUser) SecurityContextHolder.getContext().getAuthentication();
    }



}
