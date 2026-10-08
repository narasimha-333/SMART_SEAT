package com.smartseat.service;

import com.smartseat.dto.CancelBookingRequest;
import com.smartseat.entity.Booking;
import com.smartseat.entity.BookingSeat;
import com.smartseat.entity.BookingStatus;
import com.smartseat.entity.Payment;
import com.smartseat.entity.PaymentStatus;
import com.smartseat.entity.SeatStatus;
import com.smartseat.exception.ConflictException;
import com.smartseat.exception.ResourceNotFoundException;
import com.smartseat.repository.BookingRepository;
import com.smartseat.repository.PaymentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CancellationService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public CancellationService(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository) {

        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Booking cancelBooking(
            CancelBookingRequest request,
            Authentication authentication) {

        // 1. Find booking
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found"
                        ));

        // 2. Check booking ownership
        if (!booking.getUser()
                .getEmail()
                .equals(authentication.getName())) {

            throw new ConflictException(
                    "You cannot cancel this booking"
            );
        }

        // 3. Booking must be confirmed
        if (booking.getStatus()
                != BookingStatus.CONFIRMED) {

            throw new ConflictException(
                    "Only confirmed bookings can be cancelled"
            );
        }

        // 4. Get booking seats
        List<BookingSeat> bookingSeats =
                booking.getBookingSeats();

        // 5. Release seats
        for (BookingSeat bookingSeat :
                bookingSeats) {

            bookingSeat
                    .getShowSeat()
                    .setStatus(
                            SeatStatus.AVAILABLE
                    );

            bookingSeat
                    .getShowSeat()
                    .setHeldUntil(null);
        }

        // 6. Find payment
        Payment payment = paymentRepository
                .findByBookingId(booking.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found"
                        ));

        // 7. Mark payment as refunded
        payment.setStatus(
                PaymentStatus.REFUNDED
        );

        // 8. Mark booking as cancelled
        booking.setStatus(
                BookingStatus.CANCELLED
        );

        paymentRepository.save(payment);

        return bookingRepository.save(booking);
    }
}