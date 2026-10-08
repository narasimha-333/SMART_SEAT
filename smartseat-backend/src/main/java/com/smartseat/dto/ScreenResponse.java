package com.smartseat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ScreenResponse {

    private Long id;
    private String name;
    private Integer totalSeats;
    private Long theatreId;
}