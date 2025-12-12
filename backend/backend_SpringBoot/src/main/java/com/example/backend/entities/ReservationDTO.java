package com.example.backend.entities;

import java.time.LocalDateTime;

public class ReservationDTO {
    private int id;
    private String tourist;
    private int cottageid;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int adults;
    private int children;
    private String cardNumber;
    private String notes;

    private String status;
    private CommentDTO comment;
    private String rejection_reason;

    public ReservationDTO() {}

    // getteri i setteri...

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTourist() {
        return tourist;
    }

    public void setTourist(String tourist) {
        this.tourist = tourist;
    }

    public int getCottageid() {
        return cottageid;
    }

    public void setCottageid(int cottageid) {
        this.cottageid = cottageid;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public int getAdults() {
        return adults;
    }

    public void setAdults(int adults) {
        this.adults = adults;
    }

    public int getChildren() {
        return children;
    }

    public void setChildren(int children) {
        this.children = children;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public CommentDTO getComment() {
        return comment;
    }

    public void setComment(CommentDTO comment) {
        this.comment = comment;
    }

    public String getRejection_reason() {
        return rejection_reason;
    }

    public void setRejection_reason(String rejection_reason) {
        this.rejection_reason = rejection_reason;
    }
}
