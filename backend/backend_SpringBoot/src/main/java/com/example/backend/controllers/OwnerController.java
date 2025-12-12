package com.example.backend.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.Booking;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.CottageDTO;
import com.example.backend.entities.Reservation;
import com.example.backend.entities.ReservationDTO;
import com.example.backend.entities.User;
import com.example.backend.services.OwnerService;

@RestController
@RequestMapping("/owner")
@CrossOrigin(origins="http://localhost:4200")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

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

    @PostMapping("/mycottages")
    public List<CottageDTO> getMyCottages(@RequestBody User user) {
        return ownerService.getMyCottagesByUsername(user.getUsername()).stream()
            .map(this::toDTO)
            .toList();
    }

    @PostMapping("/newcottage")
    @SuppressWarnings("CallToPrintStackTrace")
    public ResponseEntity<String> newCottage(
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("services") String services,
            @RequestParam("price_summer") float priceSummer,
            @RequestParam("price_winter") float priceWinter,
            @RequestParam("price_weekday") float priceWeekday,
            @RequestParam("price_weekend") float priceWeekend,
            @RequestParam("phone") String phone,
            @RequestParam("coord_x") float coordX,
            @RequestParam("coord_y") float coordY,
            @RequestParam("owner") String ownerUsername,
            @RequestParam("picture_names") List<String> pictureNames,
            @RequestParam(value = "pictures", required = false) List<MultipartFile> pictures
    ) {
        try {
            ownerService.createCottage(name, location, services,
                    priceSummer, priceWinter, priceWeekday, priceWeekend,
                    phone, coordX, coordY, ownerUsername, pictureNames, pictures);
            return ResponseEntity.ok("Cottage successfully created");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create cottage: " + e.getMessage());
        }
    }
    

    @PostMapping("/updatecottage")
    public ResponseEntity<?> updateCottage(
        @RequestParam("id") int id,
        @RequestParam("name") String name,
        @RequestParam("location") String location,
        @RequestParam("services") String services,
        @RequestParam("price_summer") float priceSummer,
        @RequestParam("price_winter") float priceWinter,
        @RequestParam("price_weekday") float priceWeekday,
        @RequestParam("price_weekend") float priceWeekend,
        @RequestParam("phone") String phone,
        @RequestParam("coord_x") float coordX,
        @RequestParam("coord_y") float coordY,
        @RequestParam("owner") String owner,
        @RequestParam("picture_names") List<String> pictureNames,
        @RequestParam(value = "pictures", required = false) List<MultipartFile> pictures
    ) {
        try {
            Cottage updated = ownerService.updateCottage(
                id, name, location, services,
                priceSummer, priceWinter, priceWeekday, priceWeekend,
                phone, coordX, coordY, owner, pictureNames, pictures
            );
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error while saving images.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/deletecottage")
    public ResponseEntity<?> deleteCottage(@RequestBody Integer cid) {
        try {
            ownerService.deleteCottage(cid);
            return ResponseEntity.ok("Cottage deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting cottage: " + e.getMessage());
        }
    }

    

    @PostMapping("/acceptres")
    public ResponseEntity<String> acceptReservation(@RequestBody Reservation r) {
        try {
            ownerService.acceptReservation(r);
            return ResponseEntity.ok("Reservation accepted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error accepting reservation: " + e.getMessage());
        }
    }

    @PostMapping("/declineres")
    public ResponseEntity<String> declineReservation(@RequestBody Reservation r) {
        try {

            ownerService.declineReservation(r);
            return ResponseEntity.ok("Reservation declined successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error declining reservation: " + e.getMessage());
        }
    }

    @PostMapping("/getmyres")
    public List<ReservationDTO> getMyReservations(@RequestBody String ownerUsername) {

        List<Reservation> reservations = ownerService.getMyReservations(ownerUsername);
        List<ReservationDTO> dtos = new ArrayList<>();
        for (Reservation r : reservations) {
            Booking b = r.getBooking(); // Booking entitet

            ReservationDTO dto = new ReservationDTO();
            dto.setId(r.getId());
            dto.setTourist(b.getUser().getUsername()); 
            dto.setCottageid(b.getCottage().getId());
            dto.setStartDate(b.getStartDate());
            dto.setEndDate(b.getEndDate());
            dto.setAdults(b.getAdults());
            dto.setChildren(b.getChildren());
            dto.setCardNumber(b.getCardUsed());
            dto.setNotes(b.getNotes());

            dto.setStatus(r.getStatus());
            dto.setComment(null); 
            dto.setRejection_reason(r.getRejectionReason());

            dtos.add(dto);
        }

        return dtos;
    }

}
