package com.example.backend.entities;


import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer adults;
    private Integer children;
    @Column(name = "card_used") 
    private String cardUsed;
    @Column(name = "description") 
    private String notes;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Column(name = "res_date") 
    private LocalDateTime resDate;

    @ManyToOne
    @JoinColumn(name = "tourist")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cottage")
    private Cottage cottage;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations;

    // Getteri i setteri
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getAdults() { return adults; }
    public void setAdults(Integer adults) { this.adults = adults; }

    public Integer getChildren() { return children; }
    public void setChildren(Integer children) { this.children = children; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Cottage getCottage() { return cottage; }
    public void setCottage(Cottage cottage) { this.cottage = cottage; }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public LocalDateTime getResDate() {
        return resDate;
    }

    public void setResDate(LocalDateTime resDate) {
        this.resDate = resDate;
    }

    public String getCardUsed() {
        return cardUsed;
    }

    public void setCardUsed(String cardUsed) {
        this.cardUsed = cardUsed;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
