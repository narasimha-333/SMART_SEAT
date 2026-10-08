package com.smartseat.dto;

import com.smartseat.entity.BookingStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class BookingResponse {

    private Long bookingId;

    private String bookingReference;

    private String movieTitle;

    private String theatreName;

    private String screenName;

    private LocalDateTime showStartTime;

    private LocalDateTime showEndTime;

    private List<String> seatNumbers;

    private Double totalAmount;

    private BookingStatus status;

    private LocalDateTime createdAt;
}