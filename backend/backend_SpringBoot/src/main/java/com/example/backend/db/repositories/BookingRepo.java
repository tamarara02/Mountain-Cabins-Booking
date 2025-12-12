package com.example.backend.db.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entities.Booking;

public interface BookingRepo extends JpaRepository<Booking, Long> {
    Integer countByResDateAfter(LocalDateTime date);

    @Query("""
        SELECT b
        FROM Booking b
        JOIN b.reservations r
        WHERE b.startDate < :endDate
          AND b.endDate > :startDate
          AND r.status = 'prihvacena'
          AND b.cottage.id = :cottageId
    """)
    List<Booking> findOverlappingBookings(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("cottageId") Integer cottageId
    );
}