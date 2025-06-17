package com.wasl.stream.security.dto;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.UUID;

public class KeycloakUser extends AbstractAuthenticationToken {
    private String id;
    private String name;
    private String email;
    private List<GrantedAuthority> roles;

    public KeycloakUser(String id, String name, String email, List<GrantedAuthority> roles) {
        super(roles);
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<GrantedAuthority> getRoles() {
        return roles;
    }

    public void setRoles(List<GrantedAuthority> roles) {
        this.roles = roles;
    }

    @Override
    public Object getCredentials() {
        return null; // Credentials should be empty for JWT
    }

    @Override
    public Object getPrincipal() {
        return this.id; // Return identifier instead of 'this'
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", roles=" + roles +
                '}';
    }
}
