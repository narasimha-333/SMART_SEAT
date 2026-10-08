package com.smartseat.service;

import com.smartseat.dto.BookingCreateResponse;
import com.smartseat.dto.BookingRequest;
import com.smartseat.dto.BookingResponse;
import com.smartseat.entity.Booking;
import com.smartseat.entity.BookingSeat;
import com.smartseat.entity.BookingStatus;
import com.smartseat.entity.SeatStatus;
import com.smartseat.entity.Show;
import com.smartseat.entity.ShowSeat;
import com.smartseat.entity.User;
import com.smartseat.exception.ConflictException;
import com.smartseat.exception.ResourceNotFoundException;
import com.smartseat.repository.BookingRepository;
import com.smartseat.repository.BookingSeatRepository;
import com.smartseat.repository.ShowRepository;
import com.smartseat.repository.ShowSeatRepository;
import com.smartseat.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final UserRepository userRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ShowRepository showRepository,
            ShowSeatRepository showSeatRepository,
            UserRepository userRepository,
            BookingSeatRepository bookingSeatRepository) {

        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.showSeatRepository = showSeatRepository;
        this.userRepository = userRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Transactional
    public BookingCreateResponse bookSeats(
            BookingRequest request,
            Authentication authentication) {

        // 1. Find logged-in user
        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        // 2. Find show
        Show show = showRepository
                .findById(request.getShowId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Show not found"
                        ));

        // 3. Create booking reference
        String bookingReference =
                "SS-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        // 4. Create booking
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .user(user)
                .show(show)
                .totalAmount(0.0)
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        double totalAmount = 0.0;

        // 5. Process selected seats
        for (Long seatId : request.getSeatIds()) {

            // Find and lock the ShowSeat
            ShowSeat showSeat =
                    showSeatRepository
                            .findByShowIdAndSeatIdForUpdate(
                                    request.getShowId(),
                                    seatId
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Seat not found for this show"
                                    ));

            // 6. Check expired hold
            if (showSeat.getStatus() == SeatStatus.HELD
                    && showSeat.getHeldUntil() != null
                    && showSeat.getHeldUntil()
                    .isBefore(LocalDateTime.now())) {

                showSeat.setStatus(
                        SeatStatus.AVAILABLE
                );

                showSeat.setHeldUntil(null);
            }

            // 7. Check availability
            if (showSeat.getStatus()
                    != SeatStatus.AVAILABLE) {

                throw new ConflictException(
                        "Seat "
                                + showSeat.getSeat()
                                .getSeatNumber()
                                + " is not available"
                );
            }

            // 8. Hold seat for 10 minutes
            showSeat.setStatus(
                    SeatStatus.HELD
            );

            showSeat.setHeldUntil(
                    LocalDateTime.now()
                            .plusMinutes(10)
            );

            // 9. Create BookingSeat
            BookingSeat bookingSeat =
                    BookingSeat.builder()
                            .booking(savedBooking)
                            .showSeat(showSeat)
                            .price(show.getTicketPrice())
                            .build();

            bookingSeatRepository.save(
                    bookingSeat
            );

            // 10. Calculate total
            totalAmount += show.getTicketPrice();
        }

        // 11. Update booking total
        savedBooking.setTotalAmount(
                totalAmount
        );

        bookingRepository.save(
                savedBooking
        );

        // 12. Return safe DTO
        return BookingCreateResponse.builder()
                .bookingId(
                        savedBooking.getId()
                )
                .bookingReference(
                        savedBooking.getBookingReference()
                )
                .showId(
                        savedBooking.getShow().getId()
                )
                .totalAmount(
                        savedBooking.getTotalAmount()
                )
                .status(
                        savedBooking.getStatus()
                )
                .build();
    }

    public List<BookingResponse> getMyBookings(
            Authentication authentication) {

        // Find logged-in user
        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        ));

        return bookingRepository
                .findByUserId(user.getId())
                .stream()
                .map(this::mapToBookingResponse)
                .toList();
    }

    private BookingResponse mapToBookingResponse(
            Booking booking) {

        List<String> seatNumbers =
                booking.getBookingSeats()
                        .stream()
                        .map(bookingSeat ->
                                bookingSeat
                                        .getShowSeat()
                                        .getSeat()
                                        .getSeatNumber())
                        .toList();

        return BookingResponse.builder()
                .bookingId(
                        booking.getId()
                )
                .bookingReference(
                        booking.getBookingReference()
                )
                .movieTitle(
                        booking.getShow()
                                .getMovie()
                                .getTitle()
                )
                .theatreName(
                        booking.getShow()
                                .getScreen()
                                .getTheatre()
                                .getName()
                )
                .screenName(
                        booking.getShow()
                                .getScreen()
                                .getName()
                )
                .showStartTime(
                        booking.getShow()
                                .getStartTime()
                )
                .showEndTime(
                        booking.getShow()
                                .getEndTime()
                )
                .seatNumbers(
                        seatNumbers
                )
                .totalAmount(
                        booking.getTotalAmount()
                )
                .status(
                        booking.getStatus()
                )
                .createdAt(
                        booking.getCreatedAt()
                )
                .build();
    }
}