package com.example.backend.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CottageDTO {
    private Integer id;
    private String name;
    private String owner;
    private String location;
    private String services;
    @JsonProperty("price_summer")
    private Float priceSummer;
    @JsonProperty("price_winter")
    private Float priceWinter;
    @JsonProperty("price_weekday")
    private Float priceWeekday;
    @JsonProperty("price_weekend")
    private Float priceWeekend;
    private String phone;
    @JsonProperty("coord_x")
    private Float coordX;
    @JsonProperty("coord_y")
    private Float coordY;
    private List<String> pictures; // samo stringovi
    private Float rating;
    private String status;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getServices() {
        return services;
    }

    public void setServices(String services) {
        this.services = services;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Float getCoordX() {
        return coordX;
    }

    public void setCoordX(Float coordX) {
        this.coordX = coordX;
    }

    public Float getCoordY() {
        return coordY;
    }

    public void setCoordY(Float coordY) {
        this.coordY = coordY;
    }

    public List<String> getPictures() {
        return pictures;
    }

    public void setPictures(List<String> pictures) {
        this.pictures = pictures;
    }

    public Float getRating() {
        return rating;
    }

    public void setRating(Float rating) {
        this.rating = rating;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Float getPriceSummer() {
        return priceSummer;
    }

    public void setPriceSummer(Float priceSummer) {
        this.priceSummer = priceSummer;
    }

    public Float getPriceWinter() {
        return priceWinter;
    }

    public void setPriceWinter(Float priceWinter) {
        this.priceWinter = priceWinter;
    }

    public Float getPriceWeekday() {
        return priceWeekday;
    }

    public void setPriceWeekday(Float priceWeekday) {
        this.priceWeekday = priceWeekday;
    }

    public Float getPriceWeekend() {
        return priceWeekend;
    }

    public void setPriceWeekend(Float priceWeekend) {
        this.priceWeekend = priceWeekend;
    }
}
