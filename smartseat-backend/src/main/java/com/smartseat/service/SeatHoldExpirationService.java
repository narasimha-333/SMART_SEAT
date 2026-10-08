package com.smartseat.service;

import com.smartseat.entity.Booking;
import com.smartseat.entity.BookingSeat;
import com.smartseat.entity.BookingStatus;
import com.smartseat.entity.SeatStatus;
import com.smartseat.entity.ShowSeat;
import com.smartseat.repository.BookingRepository;
import com.smartseat.repository.ShowSeatRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SeatHoldExpirationService {

    private final ShowSeatRepository showSeatRepository;
    private final BookingRepository bookingRepository;

    public SeatHoldExpirationService(
            ShowSeatRepository showSeatRepository,
            BookingRepository bookingRepository) {

        this.showSeatRepository = showSeatRepository;
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireSeatHolds() {

        LocalDateTime now = LocalDateTime.now();

        List<ShowSeat> expiredSeats =
                showSeatRepository
                        .findByStatusAndHeldUntilBefore(
                                SeatStatus.HELD,
                                now
                        );


        for (ShowSeat showSeat : expiredSeats) {

            Booking booking =
                    bookingRepository
                            .findPendingBookingByShowSeatId(
                                    showSeat.getId(),
                                    BookingStatus.PENDING
                            )
                            .orElse(null);

            showSeat.setStatus(
                    SeatStatus.AVAILABLE
            );

            showSeat.setHeldUntil(null);

            if (booking != null) {

                booking.setStatus(
                        BookingStatus.EXPIRED
                );
            }
        }
    }
}