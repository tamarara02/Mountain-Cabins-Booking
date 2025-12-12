package com.example.backend.entities;

import java.time.LocalDateTime;

public class ReservationReqDTO {
     private int cottageid;
    private String tourist;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int adults;
    private int children;
    private String cardNumber;
    private String notes;

    // Getteri i setteri
    public int getCottageid() { return cottageid; }
    public void setCottageid(int cottageid) { this.cottageid = cottageid; }

    public String getTourist() { return tourist; }
    public void setTourist(String tourist) { this.tourist = tourist; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public int getAdults() { return adults; }
    public void setAdults(int adults) { this.adults = adults; }

    public int getChildren() { return children; }
    public void setChildren(int children) { this.children = children; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
