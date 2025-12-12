package com.example.backend.entities;

public class CommentDTO {
    private Integer cotid;
    private String user;
    private Integer rating;
    private String comment;

    // Getteri i setteri
    public Integer getCotid() {
        return cotid;
    }

    public void setCotid(Integer cotid) {
        this.cotid = cotid;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
