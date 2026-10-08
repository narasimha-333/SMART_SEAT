package com.smartseat.service;



import com.smartseat.dto.SeatResponse;
import com.smartseat.entity.ShowSeat;
import com.smartseat.repository.ShowSeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowSeatService {

    private final ShowSeatRepository showSeatRepository;

    public ShowSeatService(ShowSeatRepository showSeatRepository) {
        this.showSeatRepository = showSeatRepository;
    }

    public List<SeatResponse> getSeatsForShow(Long showId) {

        List<ShowSeat> showSeats =
                showSeatRepository.findByShowId(showId);

        System.out.println("Show ID: " + showId);
        System.out.println("ShowSeats found: " + showSeats.size());

        return showSeats.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private SeatResponse mapToResponse(ShowSeat showSeat) {

        return SeatResponse.builder()
                .showSeatId(showSeat.getId())
                .seatId(showSeat.getSeat().getId())
                .seatNumber(showSeat.getSeat().getSeatNumber())
                .seatType(showSeat.getSeat().getSeatType())
                .status(showSeat.getStatus())
                .build();
    }
}

