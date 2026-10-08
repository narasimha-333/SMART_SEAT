package com.smartseat.controller;

import com.smartseat.dto.ScreenRequest;
import com.smartseat.dto.ScreenResponse;
import com.smartseat.service.ScreenService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/theatres/{theatreId}/screens")
public class ScreenController {

    private final ScreenService screenService;

    public ScreenController(ScreenService screenService) {
        this.screenService = screenService;
    }

    @PostMapping
    public ResponseEntity<ScreenResponse> createScreen(
            @PathVariable Long theatreId,
            @Valid @RequestBody ScreenRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        screenService.createScreen(
                                theatreId,
                                request
                        )
                );
    }
}