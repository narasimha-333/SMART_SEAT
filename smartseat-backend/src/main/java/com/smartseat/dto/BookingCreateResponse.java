package com.smartseat.dto;

import com.smartseat.entity.BookingStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingCreateResponse {

    private Long bookingId;

    private String bookingReference;

    private Long showId;

    private double totalAmount;

    private BookingStatus status;
}