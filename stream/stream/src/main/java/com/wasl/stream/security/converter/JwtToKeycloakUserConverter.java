package com.wasl.stream.security.converter;

import com.wasl.stream.security.dto.KeycloakUser;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtToKeycloakUserConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt source) {
        List<GrantedAuthority> roles = new ArrayList<>();

        parseRoles(source.getClaimAsStringList("realm_access").get(0), roles);
        parseRoles(source.getClaimAsStringList("resource_access").get(0), roles);

        KeycloakUser user = new KeycloakUser(source.getSubject(),
                source.getClaim("name"), source.getClaim("email"), roles);
        user.setAuthenticated(true);

        return user;
    }

    private static void parseRoles(String input, List<GrantedAuthority> roles) {
        int start = input.indexOf('[');
        int end   = input.indexOf(']');
        if (start < 0 || end < 0 || end <= start) {
            throw new IllegalArgumentException("Invalid roles string: " + input);
        }
        String insideBrackets = input.substring(start + 1, end);

        Arrays.stream(insideBrackets.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(SimpleGrantedAuthority::new)
                .forEach(roles::add);
    }
}
