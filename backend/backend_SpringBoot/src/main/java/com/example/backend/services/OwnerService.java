package com.example.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.db.repositories.CottageRepo;
import com.example.backend.db.repositories.OwnerRepo;
import com.example.backend.db.repositories.ReservationRepo;
import com.example.backend.db.repositories.UserRepo;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.CottagePicture;
import com.example.backend.entities.Reservation;
import com.example.backend.entities.User;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepo ownerRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CottageRepo cottageRepo;

    @Autowired
    private ReservationRepo reservationRepo;

    public List<Cottage> getMyCottages(User user) {
        return ownerRepo.findByOwner(user);
    }

    public List<Cottage> getMyCottagesByUsername(String username) {
        return ownerRepo.findByOwnerUsername(username);
    }

    private final Path uploadPath = Paths.get(System.getProperty("user.dir"), "backend", "uploads", "img");

    public void createCottage(String name, String location, String services,
                              float priceSummer, float priceWinter, float priceWeekday, float priceWeekend,
                              String phone, float coordX, float coordY, String ownerUsername,
                              List<String> pictureNames, List<MultipartFile> pictures) throws IOException {

        // Kreiraj direktorijum za slike
        if (pictures != null && !pictures.isEmpty()) {
            Files.createDirectories(uploadPath);
            for (MultipartFile picture : pictures) {
                if (!picture.isEmpty()) {
                    Path filePath = uploadPath.resolve(picture.getOriginalFilename());
                    Files.copy(picture.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }

        User owner = userRepo.findByUsername(ownerUsername)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerUsername));

        Cottage cottage = new Cottage();
        cottage.setName(name);
        cottage.setLocation(location);
        cottage.setServices(services);
        cottage.setPrice_summer(priceSummer);
        cottage.setPrice_winter(priceWinter);
        cottage.setPrice_weekday(priceWeekday);
        cottage.setPrice_weekend(priceWeekend);
        cottage.setPhone(phone);
        cottage.setCoordX(coordX);
        cottage.setCoordY(coordY);
        cottage.setOwner(owner);
        cottage.setStatus("aktivna");

        // Poveži CottagePicture entitete
        if (pictureNames != null) {
            for (String picName : pictureNames) {
                CottagePicture pic = new CottagePicture(picName, cottage);
                cottage.addPicture(pic);

            }
        }

        cottageRepo.save(cottage);
    }

    public Cottage updateCottage(
            int id,
            String name,
            String location,
            String services,
            float priceSummer,
            float priceWinter,
            float priceWeekday,
            float priceWeekend,
            String phone,
            float coordX,
            float coordY,
            String ownerUsername,
            List<String> pictureNames,
            List<MultipartFile> pictures
    ) throws IOException {

        Cottage cottage = cottageRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Cottage not found"));

        cottage.setName(name);
        cottage.setLocation(location);
        cottage.setServices(services);
        cottage.setPrice_summer(priceSummer);
        cottage.setPrice_winter(priceWinter);
        cottage.setPrice_weekday(priceWeekday);
        cottage.setPrice_weekend(priceWeekend);
        cottage.setPhone(phone);
        cottage.setCoordX(coordX);
        cottage.setCoordY(coordY);

        // Ako uploaduješ slike
        if (pictures != null) {
            for (MultipartFile picture : pictures) {
                if (!picture.isEmpty()) {
                    String filename = picture.getOriginalFilename();
                    String basePath = System.getProperty("user.dir");
                    Path path = Paths.get(basePath, "backend", "uploads", "img", filename);
                    Files.createDirectories(path.getParent());
                    Files.copy(picture.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        }

        // Obrisi stare slike i postavi nove
        List<CottagePicture> newPictures = new ArrayList<>();
        for (String namePic : pictureNames) {
            CottagePicture cp = new CottagePicture();
            cp.setPicture(namePic);
            cp.setCottage(cottage);
            newPictures.add(cp);
        }
        cottage.getPictures().clear();
        cottage.getPictures().addAll(newPictures);

        return cottageRepo.save(cottage);
    }


    public void deleteCottage(Integer id) {
        System.out.println("Za brisanje cot id: " + id);

        // ako vikendica ne postoji → baci grešku
        if (!cottageRepo.existsById(id)) {
            throw new RuntimeException("Cottage with ID " + id + " not found");
        }

        // JPA automatski briše i slike zbog cascade = ALL + orphanRemoval = true
        cottageRepo.deleteById(id);
    }


    public void acceptReservation(Reservation reservation) {
        Reservation existing = reservationRepo.findById(reservation.getId())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        existing.setStatus("prihvacena");
        reservationRepo.save(existing);
    }

    public void declineReservation(Reservation reservation) {
        Reservation existing = reservationRepo.findById(reservation.getId())
            .orElseThrow(() -> new RuntimeException("Reservation not found"));

        existing.setStatus("odbijena");
        existing.setRejectionReason(reservation.getRejectionReason());
        reservationRepo.save(existing);
    }

    public List<Reservation> getMyReservations(String ownerUsername) {
        return reservationRepo.findAllByOwnerUsername(ownerUsername);
    }
}
