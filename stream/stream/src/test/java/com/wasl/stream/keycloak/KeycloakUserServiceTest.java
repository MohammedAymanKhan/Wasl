package com.wasl.stream.keycloak;

import com.wasl.stream.invitation.dto.KeycloakUserDTO;
import org.junit.jupiter.api.Test;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class KeycloakUserServiceTest {

    @Autowired
    KeycloakUserService keycloakUserService;
    @Autowired
    Keycloak keycloak;

    @Test
    public void getUsersByIdsTest(){
        keycloakUserService.getUsersByIds(List.of("3e1fb512-8e4a-4894-9666-16c887f8992b","613d3e44-9379-4bc2-bde0-799cefad1cbd",
                "146b1b02-52a2-4335-ac2f-7812943ca888"));
    }

    @Test
    public void searchUsersTest(){
        List<KeycloakUserDTO> users = keycloakUserService.searchUsers("ak", "");
        System.out.println(users.size());
    }

    @Test
    public void searchUserByNameORByEmailTest(){
        List<UserRepresentation> users = keycloak.realm("Wasl").users()
                .search(
                        "ak",  // General search term
                        null,           // First result (pagination)
                        null           // Max results
                );

        System.out.println(users.size());
        for (UserRepresentation user : users){
            System.out.println(user.getEmail());
        }
    }
}
