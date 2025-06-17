package com.wasl.stream.invitation;

import com.wasl.stream.invitation.dto.CreateInviteCommand;
import com.wasl.stream.invitation.dto.InviteDTO;
import com.wasl.stream.invitation.dto.NotificationDTO;
import com.wasl.stream.invitation.enums.InvitationStatus;
import com.wasl.stream.invitation.enums.NotificationType;
import com.wasl.stream.security.dto.KeycloakUser;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.junit.Assert.assertEquals;

@Testcontainers
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class InvitationAndNotificationServiceTest {

    @Autowired
    InvitationService invitationService;
    @Autowired
    NotificationService notificationService;

    @Container
    static final MySQLContainer<?> mySQLContainer =
            new MySQLContainer<>("mysql:5.7.34")
                    .withDatabaseName("wasldb")
                    .withUsername("wasl")
                    .withPassword("wasl123");


    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mySQLContainer::getUsername);
        registry.add("spring.datasource.password", mySQLContainer::getPassword);
    }

    public void setAuthentication(String name, String email){
        KeycloakUser user = new KeycloakUser(UUID.nameUUIDFromBytes(name.getBytes()).toString(), name, email, List.of());
        SecurityContextHolder.setContext(new SecurityContextImpl(user));
    }

    @AfterEach
    void clearSecurityContextHolder() {
        SecurityContextHolder.clearContext();
    }

    @Order(1)
    @Test
    public void createInviteTest(){
        setAuthentication("ayman", "ak@gmail.com");
        List<InviteDTO> inviteDTOs = invitationService.createInvite(new CreateInviteCommand(UUID.randomUUID(),
                List.of(UUID.nameUUIDFromBytes("usman".getBytes())), null, NotificationType.PERSONAL_IMMEDIATE));
        for(InviteDTO inviteDTO : inviteDTOs) {
            System.out.println("id: " + inviteDTO.id());
            System.out.println("ownerId: " + inviteDTO.ownerId());
            System.out.println("meetingId: " + inviteDTO.meetingId());
            System.out.println("participantId: " + inviteDTO.participantId());
            System.out.println("status: " + inviteDTO.status());
            System.out.println();
        }
    }

    @Order(2)
    @Test
    public void getUnreadNotificationsTest(){
        setAuthentication("usman","usman@gmail.com");
        List<NotificationDTO> notificationDTOS = notificationService.getUnreadNotifications();
        Assertions.assertEquals(1, notificationDTOS.size());
    }

    //These test for participant who response for meeting invitation by accepting or Rejecting
    @Order(3)
    @Test
    public void respondToInvitationTest(){
        setAuthentication("usman","usman@gmail.com");
        List<NotificationDTO> notificationDTOS = notificationService.getUnreadNotifications();
        invitationService.respondToInvitation(String.valueOf(notificationDTOS.get(0).Id()), InvitationStatus.JOINED);
    }

    //These test for response notification back to owner if participant accepted or Rejected
    @Order(4)
    @Test
    public void markAsReadTest(){
        setAuthentication("ayman", "ak@gmail.com");
        List<NotificationDTO> notificationDTOS = notificationService.getUnreadNotifications();
        boolean status = notificationService.markAsRead(String.valueOf(notificationDTOS.get(0).Id()));
        assertEquals(true, status);
    }


}
