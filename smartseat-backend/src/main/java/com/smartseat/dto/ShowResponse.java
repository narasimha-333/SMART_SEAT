package com.smartseat.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ShowResponse {

    private Long id;

    private Long movieId;
    private String movieTitle;

    private Long screenId;
    private String screenName;

    private Long theatreId;
    private String theatreName;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Double ticketPrice;
}