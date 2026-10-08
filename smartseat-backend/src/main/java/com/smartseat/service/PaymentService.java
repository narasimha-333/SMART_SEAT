package com.smartseat.service;

import com.smartseat.dto.PaymentRequest;
import com.smartseat.dto.PaymentResponse;
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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponse processPayment(
            PaymentRequest request) {

        // 1. Find booking
        Booking booking =
                bookingRepository
                        .findById(request.getBookingId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found"
                                ));

        // 2. Booking must be pending
        if (booking.getStatus()
                != BookingStatus.PENDING) {

            throw new ConflictException(
                    "Booking is not pending"
            );
        }

        // 3. Check whether payment already exists
        if (paymentRepository
                .findByBookingId(booking.getId())
                .isPresent()) {

            throw new ConflictException(
                    "Payment already processed"
            );
        }

        LocalDateTime now =
                LocalDateTime.now();

        List<BookingSeat> bookingSeats =
                booking.getBookingSeats();

        // 4. Check all seats
        for (BookingSeat bookingSeat :
                bookingSeats) {

            if (bookingSeat.getShowSeat()
                    .getStatus()
                    != SeatStatus.HELD) {

                throw new ConflictException(
                        "Seat is no longer held"
                );
            }

            if (bookingSeat.getShowSeat()
                    .getHeldUntil()
                    .isBefore(now)) {

                throw new ConflictException(
                        "Seat hold has expired"
                );
            }
        }

        // 5. Create payment
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalAmount())
                .status(PaymentStatus.SUCCESS)
                .transactionReference(
                        "TXN-" +
                                UUID.randomUUID()
                                        .toString()
                                        .substring(0, 8)
                                        .toUpperCase()
                )
                .paidAt(now)
                .build();

        Payment savedPayment =
                paymentRepository.save(payment);

        // 6. Convert HELD seats → BOOKED
        for (BookingSeat bookingSeat :
                bookingSeats) {

            bookingSeat
                    .getShowSeat()
                    .setStatus(
                            SeatStatus.BOOKED
                    );

            bookingSeat
                    .getShowSeat()
                    .setHeldUntil(null);
        }

        // 7. Confirm booking
        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        bookingRepository.save(booking);

        // 8. Return safe DTO
        return PaymentResponse.builder()
                .paymentId(
                        savedPayment.getId()
                )
                .bookingId(
                        booking.getId()
                )
                .amount(
                        savedPayment.getAmount()
                )
                .status(
                        savedPayment.getStatus()
                )
                .transactionReference(
                        savedPayment.getTransactionReference()
                )
                .paidAt(
                        savedPayment.getPaidAt()
                )
                .build();
    }
}