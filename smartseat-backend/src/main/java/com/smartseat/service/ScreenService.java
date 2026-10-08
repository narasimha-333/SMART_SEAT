package com.smartseat.service;

import com.smartseat.dto.ScreenRequest;
import com.smartseat.dto.ScreenResponse;
import com.smartseat.entity.Screen;
import com.smartseat.entity.Seat;
import com.smartseat.entity.Theatre;
import com.smartseat.repository.ScreenRepository;
import com.smartseat.repository.SeatRepository;
import com.smartseat.repository.TheatreRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScreenService {

    private final ScreenRepository screenRepository;
    private final TheatreRepository theatreRepository;
    private final SeatRepository seatRepository;

    public ScreenService(
            ScreenRepository screenRepository,
            TheatreRepository theatreRepository,
            SeatRepository seatRepository) {

        this.screenRepository = screenRepository;
        this.theatreRepository = theatreRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public ScreenResponse createScreen(
            Long theatreId,
            ScreenRequest request) {

        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() ->
                        new RuntimeException("Theatre not found"));

        int totalSeats =
                request.getRows() * request.getSeatsPerRow();

        Screen screen = Screen.builder()
                .name(request.getName())
                .totalSeats(totalSeats)
                .theatre(theatre)
                .build();

        Screen savedScreen = screenRepository.save(screen);

        createSeats(
                savedScreen,
                request.getRows(),
                request.getSeatsPerRow()
        );

        return ScreenResponse.builder()
                .id(savedScreen.getId())
                .name(savedScreen.getName())
                .totalSeats(savedScreen.getTotalSeats())
                .theatreId(theatre.getId())
                .build();
    }

    private void createSeats(
            Screen screen,
            int rows,
            int seatsPerRow) {

        for (int row = 0; row < rows; row++) {

            char rowLetter = (char) ('A' + row);

            for (int seat = 1; seat <= seatsPerRow; seat++) {

                Seat newSeat = Seat.builder()
                        .seatNumber(
                                rowLetter + String.valueOf(seat)
                        )
                        .seatType("REGULAR")
                        .screen(screen)
                        .build();

                seatRepository.save(newSeat);
            }
        }
    }
}