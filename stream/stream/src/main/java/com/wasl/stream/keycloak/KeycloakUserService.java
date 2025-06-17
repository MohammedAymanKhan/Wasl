package com.wasl.stream.keycloak;

import com.wasl.stream.invitation.InvitationService;
import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import com.wasl.stream.security.dto.KeycloakUser;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KeycloakUserService {

    private final Keycloak keycloak;
    private final InvitationService invitationService;

    @Value("${keycloak.admin.realm}")
    private String realm;

    public KeycloakUserService(Keycloak keycloak, InvitationService invitationService) {
        this.keycloak = keycloak;
        this.invitationService = invitationService;
    }

    public List<KeycloakUserDTO> searchUsers(String query, String invitationId){
        if (query == null || query.trim().isEmpty() || query.isEmpty()) {
            return Collections.emptyList();
        }

        System.out.println("invitationId: "+invitationId);
        System.out.println("query: "+query);

        KeycloakUser mySelfUser = getUser();

        // Search in all relevant fields: username, email, firstName, lastName
        List<UserRepresentation> users = keycloak.realm(realm).users()
                .search(query,null, null);

        System.out.println("users: "+users.size());

        if(invitationId != null && !invitationId.isEmpty() && invitationId.length() == 36) {
            Set<UUID> alreadyInvitedUsers = invitationService.getAllInvitedUsers(invitationId);

            return users.stream().parallel()
                    .filter(user ->
                            !alreadyInvitedUsers.contains(UUID.fromString(user.getId())) &&
                                    !UUID.fromString(mySelfUser.getId()).equals(UUID.fromString(user.getId())))
                    .map(user -> new KeycloakUserDTO(user.getId(), user.getFirstName() + " " + user.getLastName(),
                            user.getEmail()))
                    .toList();
        }

        return users.stream().parallel()
                .filter(user ->
                                !UUID.fromString(mySelfUser.getId()).equals(UUID.fromString(user.getId())))
                .map(user -> new KeycloakUserDTO(user.getId(), user.getFirstName() + " " + user.getLastName(),
                        user.getEmail()))
                .toList();
    }

    public Map<UUID, KeycloakUserDTO> getUsersByIds(List<String> userIds){
        String idsParam = String.join(",", userIds);
        List<UserRepresentation> users = keycloak.realm(realm).users().searchByAttributes(idsParam);
        Map<UUID, KeycloakUserDTO> userDTOMap = new HashMap<>();
        users.stream().map(user -> new KeycloakUserDTO(user.getId(), user.getFirstName()+" "+user.getLastName(),
                user.getEmail())).forEach(user -> userDTOMap.put(UUID.fromString(user.id()), user));
        return userDTOMap;
    }

    private KeycloakUser getUser(){
        return (KeycloakUser) SecurityContextHolder.getContext().getAuthentication();
    }

}
