package com.wasl.stream.invitation.meeting;

import com.wasl.stream.invitation.InvitationService;
import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import com.wasl.stream.keycloak.KeycloakUserService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MeetingService {

    private final InvitationService invitationService;
    private final KeycloakUserService keycloakUserService;


    public MeetingService(InvitationService invitationService, KeycloakUserService keycloakUserService) {
        this.invitationService = invitationService;
        this.keycloakUserService = keycloakUserService;
    }

    public List<UUID> getMeetingIdsAsParticipant(){
        return invitationService.getAllMeetingIdsAsParticipant();
    }

    public Map<UUID, List<KeycloakUserDTO>> getParticipants(List<UUID> meetingIds){
        Map<UUID,List<String>> participantIds = invitationService.getParticipantIds(meetingIds);

        Map<UUID, List<KeycloakUserDTO>> participants = new HashMap<>();

        if(!participantIds.isEmpty()) {
            List<String> userIds = new ArrayList<>();

            participantIds.forEach((meetingId, participantIdList) -> {
                userIds.addAll(participantIdList);
            });

            Map<UUID, KeycloakUserDTO> userDTOMap = keycloakUserService.getUsersByIds(userIds);

            for (UUID meetingId : participantIds.keySet()) {
                participants.put(meetingId, participantIds.get(meetingId).stream().map(userId -> userDTOMap.get(UUID.fromString(userId))).toList());
            }
        }

        return  participants;
    }

}
