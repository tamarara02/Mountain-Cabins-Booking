package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.db.repositories.BookingRepo;
import com.example.backend.db.repositories.CottageRepo;
import com.example.backend.db.repositories.UserRepo;
import com.example.backend.entities.Cottage;

@Service
public class HomeService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CottageRepo cottageRepo;

    @Autowired
    private BookingRepo bookingRepo;

    public Integer getAllHosts() {
        return userRepo.countByType("vlasnik");
    }

    public Integer getAllTourists() {
        return userRepo.countByType("turista");
    }

    public Integer getAllCottagesNumber() {
        return (int) cottageRepo.count();
    }

    public List<Cottage> getAllCottages() {
        return cottageRepo.findAll();
    }

    public Integer getRes24h() {
        return bookingRepo.countByResDateAfter(java.time.LocalDateTime.now().minusDays(1));
    }

    public Integer getRes7d() {
        return bookingRepo.countByResDateAfter(java.time.LocalDateTime.now().minusDays(7));
    }

    public Integer getRes30d() {
        return bookingRepo.countByResDateAfter(java.time.LocalDateTime.now().minusDays(30));
    }
}
