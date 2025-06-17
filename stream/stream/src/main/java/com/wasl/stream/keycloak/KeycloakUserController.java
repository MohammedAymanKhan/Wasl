package com.wasl.stream.keycloak;

import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


@RestController
@RequestMapping("/api/users")
public class KeycloakUserController {

    private final KeycloakUserService keycloakUserService;

    public KeycloakUserController(KeycloakUserService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<KeycloakUserDTO>> searchUsers(@RequestParam String query,
                                                             @RequestParam(required = false) String invitationId){
        List<KeycloakUserDTO> users = keycloakUserService.searchUsers(query, invitationId);

        return users.isEmpty() ? ResponseEntity.noContent().build() :
                ResponseEntity.ok(users);
    }
}