package com.smartseat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TheatreResponse {

    private Long id;
    private String name;
    private String city;
    private String address;
}