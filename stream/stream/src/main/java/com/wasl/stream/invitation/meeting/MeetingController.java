package com.wasl.stream.invitation.meeting;


import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/meeting")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @GetMapping
    public ResponseEntity<?> getMeetings(){
        List<UUID> meetingIds = meetingService.getMeetingIdsAsParticipant();
        return meetingIds.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(meetingIds);
    }

    @PostMapping("/participants")
    public ResponseEntity<?> getParticipants(@RequestBody List<UUID> meetingIds){
        Map<UUID, List<KeycloakUserDTO>> participants = meetingService.getParticipants(meetingIds);
        return participants.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(participants);
    }

}
