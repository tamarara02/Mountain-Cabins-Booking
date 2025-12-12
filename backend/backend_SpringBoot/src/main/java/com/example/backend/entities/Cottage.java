package com.example.backend.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
@Table(name = "cottages")
public class Cottage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "owner", nullable = false)
    private User owner;

    private String name;
    private String location;
    private String services;

    @Column(name = "price_summer")
    private Float price_summer;
    @Column(name = "price_winter")
    private Float price_winter;
    @Column(name = "price_weekday")
    private Float price_weekday;
    @Column(name = "price_weekend")
    private Float price_weekend;

    private String phone;

    @Column(name = "coord_x")
    private Float coordX;
    @Column(name = "coord_y")
    private Float coordY;

    @OneToMany(mappedBy = "cottage", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CottagePicture> pictures = new ArrayList<>();

    private String status;

    public Cottage() {}

    // Getteri i setteri
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getServices() { return services; }
    public void setServices(String services) { this.services = services; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Float getCoordX() { return coordX; }
    public void setCoordX(Float coordX) { this.coordX = coordX; }

    public Float getCoordY() { return coordY; }
    public void setCoordY(Float coordY) { this.coordY = coordY; }

    public List<CottagePicture> getPictures() { return pictures; }
    public void setPictures(List<CottagePicture> pictures) { this.pictures = pictures; }

    public void addPicture(CottagePicture picture) {
        pictures.add(picture);
        picture.setCottage(this);
    }

    public void removePicture(CottagePicture picture) {
        pictures.remove(picture);
        picture.setCottage(null);
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Float getPrice_summer() {
        return price_summer;
    }

    public void setPrice_summer(Float price_summer) {
        this.price_summer = price_summer;
    }

    public Float getPrice_winter() {
        return price_winter;
    }

    public void setPrice_winter(Float price_winter) {
        this.price_winter = price_winter;
    }

    public Float getPrice_weekday() {
        return price_weekday;
    }

    public void setPrice_weekday(Float price_weekday) {
        this.price_weekday = price_weekday;
    }

    public Float getPrice_weekend() {
        return price_weekend;
    }

    public void setPrice_weekend(Float price_weekend) {
        this.price_weekend = price_weekend;
    }
}
