package com.smartseat.controller;

import com.smartseat.dto.CancelBookingRequest;
import com.smartseat.entity.Booking;
import com.smartseat.service.CancellationService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class CancellationController {

    private final CancellationService cancellationService;

    public CancellationController(
            CancellationService cancellationService) {

        this.cancellationService = cancellationService;
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelBooking(
            @Valid @RequestBody CancelBookingRequest request,
            Authentication authentication) {

        cancellationService.cancelBooking(
                request,
                authentication
        );

        return ResponseEntity.ok(
                "Booking cancelled successfully"
        );
    }
}