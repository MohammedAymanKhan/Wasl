package com.wasl.stream.videoStream;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/token")
public class StreamTokenController {

    private final StreamTokenService tokenService;

    public StreamTokenController(StreamTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping
    public ResponseEntity<?> getStreamToken(){
        Optional<String> streamToken = tokenService.getStreamToken();
        return streamToken.isEmpty() ?
                ResponseEntity.status(HttpStatus.UNAUTHORIZED).build() :
                ResponseEntity.ok(streamToken);
    }

}
