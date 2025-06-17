package com.wasl.stream.invitation;


import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import com.wasl.stream.invitation.meeting.MeetingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@SpringBootTest
public class MeetingServiceTest {

    @Autowired
    MeetingService meetingService;

    @Test
    public void getParticipantsTest(){
        Map<UUID, List<KeycloakUserDTO>> participants = meetingService
                .getParticipants(List.of(UUID.fromString("9ca28d1e-665d-4ccd-b667-237d84055c43"),
                        UUID.fromString("660ae5a3-7cd8-4e23-bfae-ca0b6dbff227"),
                        UUID.fromString("b885934d-b0a3-4ffe-bb9c-5dabdd3a9da1")));
    }

}
