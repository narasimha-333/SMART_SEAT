package com.smartseat.controller;

import com.smartseat.dto.SeatResponse;
import com.smartseat.service.ShowSeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowSeatController {

    private final ShowSeatService showSeatService;

    public ShowSeatController(ShowSeatService showSeatService) {
        this.showSeatService = showSeatService;
    }

    @GetMapping("/{showId}/seats")
    public List<SeatResponse> getSeatsForShow(
            @PathVariable Long showId) {

        return showSeatService.getSeatsForShow(showId);
    }
}