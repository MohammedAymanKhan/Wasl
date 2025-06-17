package com.wasl.stream.invitation;

import com.wasl.stream.invitation.dto.CreateInviteCommand;
import com.wasl.stream.invitation.dto.InviteDTO;
import com.wasl.stream.invitation.enums.InvitationStatus;
import com.wasl.stream.invitation.validatorDTO.CreateInviteRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invite")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<List<InviteDTO>> create(@RequestBody @Validated CreateInviteRequest inviteRequest){
        CreateInviteCommand inviteCommand = new CreateInviteCommand(inviteRequest.meetingId(), inviteRequest.participantsId(),
                inviteRequest.message(), inviteRequest.type());
        List<InviteDTO> inviteDTOs = invitationService.createInvite(inviteCommand);
        return ResponseEntity.status(HttpStatus.CREATED).body(inviteDTOs);
    }

    @PatchMapping("/{notificationId}/respond")
    @ResponseStatus(code = HttpStatus.ACCEPTED)
    public void respondToInvitation(@PathVariable String notificationId, @RequestParam InvitationStatus statusResponse) {
        invitationService.respondToInvitation(notificationId, statusResponse);
    }


}
