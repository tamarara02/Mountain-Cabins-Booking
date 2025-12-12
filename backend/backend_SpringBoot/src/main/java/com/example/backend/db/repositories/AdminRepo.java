package com.example.backend.db.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.Cottage;
import com.example.backend.entities.User;

@Repository
public interface AdminRepo extends JpaRepository<User, Integer> {
    @Query("""
        SELECT r.rating 
        FROM Comment r
        JOIN r.reservation res
        JOIN res.booking b
        WHERE b.cottage = :cottage
        ORDER BY r.id DESC
    """)
    List<Integer> findRatingsForCottage(@Param("cottage") Cottage cottage);

    Optional<User> findByUsername(String username);
}
