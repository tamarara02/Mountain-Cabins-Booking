package com.example.backend.db.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.Cottage;
import com.example.backend.entities.Reservation;

@Repository
public interface TouristRepo extends JpaRepository<Cottage, Integer> {

    @Query("SELECT AVG(c.rating) FROM Comment c " +
           "JOIN c.reservation r " +
           "JOIN r.booking b " +
           "WHERE b.cottage = :cottage")
    Double getAvgRatingByCottage(Cottage cottage);

    @Query("""
        SELECT r
        FROM Reservation r
        JOIN r.booking b
        JOIN b.user u
        LEFT JOIN Comment c ON c.reservation = r
        WHERE u.username = :username
        AND (r.status = 'zavrsena' OR r.status = 'odbijena')
    """)
    List<Reservation> findArchiveReservationsByTourist(@Param("username") String username);

    @Query("""
        SELECT r
        FROM Reservation r
        JOIN r.booking b
        JOIN b.user u
        LEFT JOIN Comment c ON c.reservation = r
        WHERE u.username = :username
        AND (r.status = 'neobradjena' OR r.status = 'prihvacena')
    """)
    List<Reservation> findActiveReservationsByTourist(@Param("username") String username);
}
