package com.wasl.stream.videoStream;


import com.wasl.stream.security.dto.KeycloakUser;
import com.wasl.stream.videoStream.converter.JwtTokenUtility;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
class StreamTokenService {

    private final JwtTokenUtility jwtTokenUtility;

    public StreamTokenService(JwtTokenUtility jwtTokenUtility) {
        this.jwtTokenUtility = jwtTokenUtility;
    }


    public Optional<String> getStreamToken(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(!(authentication instanceof KeycloakUser user)){
            return Optional.empty();
        }

        return Optional.of(jwtTokenUtility.generateToken(user));
    }
}
