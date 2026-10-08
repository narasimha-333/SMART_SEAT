package com.smartseat.dto;

import com.smartseat.entity.SeatStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SeatResponse {

    private Long showSeatId;

    private Long seatId;

    private String seatNumber;

    private String seatType;

    private SeatStatus status;
}