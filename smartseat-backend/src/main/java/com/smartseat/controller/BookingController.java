package com.smartseat.controller;

import com.smartseat.dto.BookingCreateResponse;
import com.smartseat.dto.BookingRequest;
import com.smartseat.dto.BookingResponse;
import com.smartseat.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingCreateResponse> bookSeats(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {

        BookingCreateResponse response =
                bookingService.bookSeats(
                        request,
                        authentication
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication) {

        List<BookingResponse> bookings =
                bookingService.getMyBookings(
                        authentication
                );

        return ResponseEntity.ok(bookings);
    }
}