package com.wasl.stream.invitation;


import com.wasl.stream.invitation.enums.InvitationStatus;
import com.wasl.stream.invitation.enums.NotificationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class RepositoryTest {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    InvitationRepository invitationRepository;

    @Test
    public void findAllNotificationsByUserIdTest(){
        List<NotificationEntity> notificationEntityList = notificationRepository
                .findByUserIdAndStatus(UUID.fromString("613d3e44-9379-4bc2-bde0-799cefad1cbd"), NotificationStatus.UNREAD);
        System.out.println(notificationEntityList.size());
        assertEquals(1, notificationEntityList.size());
    }

    @Test
    public void findByIdAndUserIdAndTypeTest(){
        Optional<NotificationEntity> notificationEntities = notificationRepository.findByIdAndUserIdAndType(UUID.fromString("a8e07c50-9677-4188-ae8b" +
                        "-c04af55e6785"),
                UUID.fromString("613d3e44-9379-4bc2-bde0-799cefad1cbd"),NotificationType.INVITATION);

        assertNotNull(notificationEntities.get());
    }

    @Test
    public void findByParticipantIdTest(){
        List<UUID> meetingIds = invitationRepository.findByParticipantIdAndStatus(
                UUID.fromString("613d3e44-9379-4bc2-bde0-799cefad1cbd")
                , InvitationStatus.REJECTED);
    }

    @Test
    public void findByMeetingIdAndStatusTest(){
        Map<UUID,List<String>> participantsIds = invitationRepository.findByMeetingIdAndStatus(
                List.of(UUID.fromString("9ca28d1e-665d-4ccd-b667-237d84055c43"),
                        UUID.fromString("660ae5a3-7cd8-4e23-bfae-ca0b6dbff227"),
                        UUID.fromString("b885934d-b0a3-4ffe-bb9c-5dabdd3a9da1"))
                , InvitationStatus.ACCEPTED);

        participantsIds.forEach((meetingId, participantList) -> {
            System.out.println("MeetingId: " + meetingId);
            System.out.println("participants: " + participantsIds.get(meetingId));
        });

    }


}
