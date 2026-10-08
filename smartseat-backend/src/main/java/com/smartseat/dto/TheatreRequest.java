package com.smartseat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TheatreRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String city;

    private String address;
}