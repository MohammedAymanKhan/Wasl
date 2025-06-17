package com.wasl.stream.invitation;

import com.wasl.stream.invitation.dto.NotificationDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications();
        if(notifications == null|| notifications.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{notificationId}/mark-read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String notificationId) {
        boolean isSuccess = notificationService.markAsRead(notificationId);
        return isSuccess ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
