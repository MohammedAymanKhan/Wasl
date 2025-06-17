package com.wasl.stream.videoStream.converter;

import com.wasl.stream.security.dto.KeycloakUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;


@Component
public class JwtTokenUtility {

    @Value("${Stream.secret-key}")
    private String SECRET_KEY;

    public String generateToken(KeycloakUser user) {
        return Jwts.builder()
                .setHeaderParam("alg", "HS256") // Set "alg" first
                .setHeaderParam("typ", "JWT")   // then "typ" second
                .claim("user_id", user.getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1000))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();
    }



}