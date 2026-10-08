package com.smartseat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MovieResponse {

    private Long id;
    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer durationMinutes;
    private Double rating;
    private String posterUrl;
}