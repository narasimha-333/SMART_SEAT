
        package com.smartseat.service;

import com.smartseat.dto.ShowRequest;
import com.smartseat.dto.ShowResponse;
import com.smartseat.entity.Movie;
import com.smartseat.entity.Screen;
import com.smartseat.entity.Seat;
import com.smartseat.entity.SeatStatus;
import com.smartseat.entity.Show;
import com.smartseat.entity.ShowSeat;
import com.smartseat.repository.MovieRepository;
import com.smartseat.repository.ScreenRepository;
import com.smartseat.repository.SeatRepository;
import com.smartseat.repository.ShowRepository;
import com.smartseat.repository.ShowSeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ShowSeatRepository showSeatRepository;

    public ShowService(
            ShowRepository showRepository,
            MovieRepository movieRepository,
            ScreenRepository screenRepository,
            SeatRepository seatRepository,
            ShowSeatRepository showSeatRepository) {

        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.screenRepository = screenRepository;
        this.seatRepository = seatRepository;
        this.showSeatRepository = showSeatRepository;
    }

    @Transactional
    public ShowResponse createShow(ShowRequest request) {

        // 1. Find movie
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() ->
                        new RuntimeException("Movie not found"));

        // 2. Find screen
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() ->
                        new RuntimeException("Screen not found"));

        // 3. Validate show time
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        // 4. Check for overlapping show on the same screen
        boolean overlapExists =
                showRepository
                        .existsByScreenIdAndStartTimeLessThanAndEndTimeGreaterThan(
                                screen.getId(),
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (overlapExists) {
            throw new RuntimeException(
                    "Another show is already scheduled on this screen during this time"
            );
        }

        // 5. Create Show
        Show show = Show.builder()
                .movie(movie)
                .screen(screen)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .ticketPrice(request.getTicketPrice())
                .build();

        // 6. Save Show
        Show savedShow = showRepository.save(show);

        // 7. Find all seats belonging to this screen
        List<Seat> seats =
                seatRepository.findByScreenId(screen.getId());

        // 8. Create ShowSeat for every seat
        for (Seat seat : seats) {

            ShowSeat showSeat = ShowSeat.builder()
                    .show(savedShow)
                    .seat(seat)
                    .status(SeatStatus.AVAILABLE)
                    .build();

            showSeatRepository.save(showSeat);
        }

        // 9. Return response
        return mapToResponse(savedShow);
    }

    public List<ShowResponse> getAllShows() {

        return showRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ShowResponse getShowById(Long id) {

        Show show = showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Show not found"));

        return mapToResponse(show);
    }

    public List<ShowResponse> getShowsByMovie(Long movieId) {

        return showRepository.findByMovieId(movieId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ShowResponse mapToResponse(Show show) {

        Screen screen = show.getScreen();

        return ShowResponse.builder()
                .id(show.getId())

                .movieId(show.getMovie().getId())
                .movieTitle(show.getMovie().getTitle())

                .screenId(screen.getId())
                .screenName(screen.getName())

                .theatreId(screen.getTheatre().getId())
                .theatreName(screen.getTheatre().getName())

                .startTime(show.getStartTime())
                .endTime(show.getEndTime())
                .ticketPrice(show.getTicketPrice())

                .build();
    }
}
