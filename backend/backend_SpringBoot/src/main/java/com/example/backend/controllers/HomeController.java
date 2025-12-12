package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.db.repositories.CottageRepo;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.CottageDTO;
import com.example.backend.services.HomeService;

@RestController
@CrossOrigin(origins="http://localhost:4200")
public class HomeController {

    @Autowired
    private HomeService pocetnaService;
    @Autowired
    private CottageRepo cottageRepo;

    @GetMapping("/gethosts")
    public Integer getAllHosts() {
        return pocetnaService.getAllHosts();
    }

    @GetMapping("/gettourists")
    public Integer getAllTourists() {
        return pocetnaService.getAllTourists();
    }

    @GetMapping("/getcottagesnum")
    public Integer getAllCottagesNumber() {
        return pocetnaService.getAllCottagesNumber();
    }

    private CottageDTO toDTO(Cottage cottage) {
        CottageDTO dto = new CottageDTO();
        dto.setId(cottage.getId());
        dto.setName(cottage.getName());
        dto.setOwner(cottage.getOwner().getUsername());
        dto.setLocation(cottage.getLocation());
        dto.setServices(cottage.getServices());
        dto.setPriceSummer(cottage.getPrice_summer());
        dto.setPriceWinter(cottage.getPrice_winter());
        dto.setPriceWeekday(cottage.getPrice_weekday());
        dto.setPriceWeekend(cottage.getPrice_weekend());
        dto.setPhone(cottage.getPhone());
        dto.setCoordX(cottage.getCoordX());
        dto.setCoordY(cottage.getCoordY());
        dto.setStatus(cottage.getStatus());
        // mapiranje slika u listu stringova
        dto.setPictures(
            cottage.getPictures()
                .stream()
                .map(p -> p.getPicture())
                .toList()
        );
        return dto;
    }

    @GetMapping("/getcottages")
    public List<CottageDTO> getAllCottages() {
        return cottageRepo.findAll().stream()
            .map(this::toDTO)
            .toList();
    }

    @GetMapping("/getres24h")
    public Integer getRes24h() {
        return pocetnaService.getRes24h();
    }

    @GetMapping("/getres7d")
    public Integer getRes7d() {
        return pocetnaService.getRes7d();
    }

    @GetMapping("/getres30d")
    public Integer getRes30d() {
        return pocetnaService.getRes30d();
    }
}
