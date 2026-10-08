
        package com.smartseat.repository;

import com.smartseat.entity.Booking;
import com.smartseat.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    Optional<Booking> findByBookingReference(String bookingReference);
    @Query("""
        SELECT bs.booking
        FROM BookingSeat bs
        WHERE bs.showSeat.id = :showSeatId
        AND bs.booking.status = :status
        """)
    Optional<Booking> findPendingBookingByShowSeatId(
            @Param("showSeatId") Long showSeatId,
            @Param("status") BookingStatus status
    );
}

