package com.example.backend.db.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entities.Cottage;

public interface CottageRepo extends JpaRepository<Cottage, Integer> {
}
