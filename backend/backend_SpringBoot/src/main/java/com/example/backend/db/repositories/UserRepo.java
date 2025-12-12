package com.example.backend.db.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer>{
    Optional<User> findByUsername(String username);
    Optional<User> findByMail(String mail);
    Integer countByType(String type);
}
