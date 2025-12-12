package com.example.backend.db.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.Cottage;
import com.example.backend.entities.User;

@Repository
public interface OwnerRepo extends JpaRepository<Cottage, Integer> {

    List<Cottage> findByOwner(User owner);

    @Query("SELECT c FROM Cottage c WHERE c.owner.username = :username")
    List<Cottage> findByOwnerUsername(String username);
}
