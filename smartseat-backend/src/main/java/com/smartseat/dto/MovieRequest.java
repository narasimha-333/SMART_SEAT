package com.smartseat.dto;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieRequest {

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String genre;

    @NotBlank
    private String language;

    @NotNull
    @Positive
    private Integer durationMinutes;

    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private Double rating;

    private String posterUrl;
}