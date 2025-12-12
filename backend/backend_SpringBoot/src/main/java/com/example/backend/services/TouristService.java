package com.example.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.db.repositories.BookingRepo;
import com.example.backend.db.repositories.CommentRepo;
import com.example.backend.db.repositories.CottageRepo;
import com.example.backend.db.repositories.ReservationRepo;
import com.example.backend.db.repositories.TouristRepo;
import com.example.backend.db.repositories.UserRepo;
import com.example.backend.entities.Booking;
import com.example.backend.entities.Comment;
import com.example.backend.entities.CommentDTO;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.Reservation;
import com.example.backend.entities.ReservationDTO;
import com.example.backend.entities.ReservationReqDTO;
import com.example.backend.entities.User;

@Service
public class TouristService {
    @Autowired
    private TouristRepo touristRepo;
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CottageRepo cottageRepo;
    @Autowired
    private BookingRepo bookingRepo;
    @Autowired
    private ReservationRepo reservationRepo;

    public Double getAvgRating(Cottage cottage) {
        Double avg = touristRepo.getAvgRatingByCottage(cottage);
        return avg != null ? avg : 0.0;
    }

    public Optional<Cottage> getCottageById(Integer id) {
        Optional<Cottage> c = touristRepo.findById(id);
        return c;
    }

    public List<Comment> getCommentsByCottageId(Integer cottageId) {
        return commentRepo.findAllByCottageId(cottageId);
    }

    private boolean isAvailable(ReservationReqDTO dto) {
        List<Booking> overlapping = bookingRepo.findOverlappingBookings(
            dto.getStartDate(),
            dto.getEndDate(),
            dto.getCottageid()
        );
        return overlapping.isEmpty();
    }

    @SuppressWarnings("CallToPrintStackTrace")
    public String bookCottage(ReservationReqDTO dto) {
        try {
            Optional<User> optUser = userRepo.findByUsername(dto.getTourist());
            Cottage cottage = cottageRepo.findById(dto.getCottageid()).orElse(null);
            if(optUser == null || cottage == null) return "Nepostojeći korisnik ili vikendica!";

            // Provera dostupnosti vikendice (isto kao kod tebe)
            if(!isAvailable(dto)) return "Vikendica nije dostupna za ove datume!";
            User user = optUser.get();
            
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setCottage(cottage);
            booking.setStartDate(dto.getStartDate());
            booking.setEndDate(dto.getEndDate());
            booking.setAdults(dto.getAdults());
            booking.setChildren(dto.getChildren());
            booking.setCardUsed(dto.getCardNumber());
            booking.setNotes(dto.getNotes());
            booking.setResDate(LocalDateTime.now());

            Reservation reservation = new Reservation();
            reservation.setBooking(booking);
            reservation.setStatus("neobradjena");

            booking.setReservations(List.of(reservation));

            bookingRepo.save(booking);

            return "OK";
        } catch(Exception e) {
            e.printStackTrace();
            return "Došlo je do greške prilikom rezervacije.";
        }
    }

    public CommentDTO mapToDTO(Comment c) {
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
    }

    private ReservationDTO toArchiveDTO(Reservation res) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(res.getId());
        dto.setTourist(res.getBooking().getUser().getUsername());
        dto.setCottageid(res.getBooking().getCottage().getId());
        dto.setStartDate(res.getBooking().getStartDate());
        dto.setEndDate(res.getBooking().getEndDate());
        dto.setAdults(res.getBooking().getAdults());
        dto.setChildren(res.getBooking().getChildren());
        dto.setCardNumber(res.getBooking().getCardUsed());
        dto.setNotes(res.getBooking().getNotes());
        dto.setStatus(res.getStatus());

        if ("odbijena".equals(res.getStatus())) {
            dto.setRejection_reason(res.getRejectionReason());
        } else if ("zavrsena".equals(res.getStatus())) {
            Comment c = commentRepo.findFirstByReservation(res);
            if (c != null) {
                dto.setComment(mapToDTO(c));
            }
        }

        return dto;
    }

    public List<ReservationDTO> getArchivedReservations(String username) {
        List<Reservation> reservations = touristRepo.findArchiveReservationsByTourist(username);
        return reservations.stream()
            .map(this::toArchiveDTO)
            .toList();
    }

    public List<ReservationDTO> getActiveReservations(String username) {
        List<Reservation> reservations = touristRepo.findActiveReservationsByTourist(username);
        return reservations.stream()
            .map(this::toArchiveDTO)
            .toList();
    }

    public void addComment(CommentDTO dto){
        Reservation res = reservationRepo.findById(dto.getCotid())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Comment comment = new Comment();
        comment.setReservation(res);
        comment.setComment(dto.getComment());
        comment.setRating(dto.getRating());

        commentRepo.save(comment);
    }

    public void deleteReservation(Integer rid) {
        Reservation res = reservationRepo.findById(rid)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Booking booking = res.getBooking();
        if (booking != null) {
            bookingRepo.delete(booking);
        }
    }
}
