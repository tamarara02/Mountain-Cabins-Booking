package com.example.backend.db.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.Reservation;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Integer> {
    @Query("""
        SELECT r FROM Reservation r
        JOIN r.booking b
        JOIN b.cottage c
        WHERE c.owner.username = :ownerUsername
    """)
    List<Reservation> findAllByOwnerUsername(@Param("ownerUsername") String ownerUsername);

    
}
