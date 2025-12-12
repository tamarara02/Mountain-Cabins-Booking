package com.example.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entities.Comment;
import com.example.backend.entities.CommentDTO;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.CottageDTO;
import com.example.backend.entities.ReservationDTO;
import com.example.backend.entities.ReservationReqDTO;
import com.example.backend.services.TouristService;


@RestController
@RequestMapping("/tourist")
@CrossOrigin(origins="http://localhost:4200")
public class TouristController {

    @Autowired
    private TouristService touristService;


    @PostMapping("/getavgrating")
    public ResponseEntity<Double> getAvgRating(@RequestBody Cottage cottage) {
        try {
            Double avg = touristService.getAvgRating(cottage);
            return ResponseEntity.ok(avg);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(0.0);
        }
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
        dto.setPictures(
            cottage.getPictures()
                .stream()
                .map(p -> p.getPicture())
                .toList()
        );
        return dto;
    }
    
    @PostMapping("/getcottage")
    public ResponseEntity<CottageDTO> getCottage(@RequestBody Cottage cottage) {
        return touristService.getCottageById(cottage.getId())
            .map(this::toDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    public List<CommentDTO> mapToDTO(List<Comment> comments) {
        return comments.stream().map(c -> {
            CommentDTO dto = new CommentDTO();
            dto.setCotid(c.getReservation() != null && c.getReservation().getBooking() != null
                        ? c.getReservation().getBooking().getCottage().getId()
                        : null);
            dto.setUser(c.getReservation() != null && c.getReservation().getBooking() != null
                        ? c.getReservation().getBooking().getUser().getUsername()
                        : "Nepoznato");
            dto.setRating(c.getRating());
            dto.setComment(c.getComment());
            return dto;
        }).toList();
    }


    @PostMapping("/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@RequestBody Integer cottageId) {
        List<Comment> comments = touristService.getCommentsByCottageId(cottageId);
        List<CommentDTO> dtos = mapToDTO(comments);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/bookcottage")
        public ResponseEntity<String> bookCottage(@RequestBody ReservationReqDTO dto){
        String result = touristService.bookCottage(dto);
        if ("OK".equals(result)) {
            return ResponseEntity.ok("Datumi su uspešno rezervisani!");
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/getarchiveres")
    public List<ReservationDTO> getArchiveRes(@RequestBody ReservationReqDTO dto){
        String username = dto.getTourist();
        return touristService.getArchivedReservations(username);
    }

    @PostMapping("/getactiveres")
    public List<ReservationDTO> getActiveRes(@RequestBody ReservationReqDTO dto){
        String username = dto.getTourist();
        return touristService.getActiveReservations(username);
    }

    @PostMapping("/addcomment")
    public void addComment(@RequestBody CommentDTO dto){
        touristService.addComment(dto);
    }

    @PostMapping("/deleteres")
    public void deleteRes(@RequestBody Integer rid){
        touristService.deleteReservation(rid);
    }
}
