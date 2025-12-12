package com.example.backend.db.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.entities.Comment;
import com.example.backend.entities.Reservation;

public interface CommentRepo extends JpaRepository<Comment, Integer> {

    @Query("""
        SELECT c
        FROM Comment c
        JOIN c.reservation r
        JOIN r.booking b
        WHERE b.cottage.id = :cottageId
    """)
    List<Comment> findAllByCottageId(@Param("cottageId") Integer cottageId);

    Comment findFirstByReservation(Reservation reservation);

}
