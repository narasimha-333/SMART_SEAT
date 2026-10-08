package com.smartseat.controller;

import com.smartseat.dto.TheatreRequest;
import com.smartseat.dto.TheatreResponse;
import com.smartseat.service.TheatreService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
public class TheatreController {

    private final TheatreService theatreService;

    public TheatreController(TheatreService theatreService) {
        this.theatreService = theatreService;
    }

    @PostMapping
    public ResponseEntity<TheatreResponse> createTheatre(
            @Valid @RequestBody TheatreRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(theatreService.createTheatre(request));
    }

    @GetMapping
    public ResponseEntity<List<TheatreResponse>> getAllTheatres() {

        return ResponseEntity.ok(
                theatreService.getAllTheatres()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheatreResponse> getTheatre(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                theatreService.getTheatreById(id)
        );
    }
}