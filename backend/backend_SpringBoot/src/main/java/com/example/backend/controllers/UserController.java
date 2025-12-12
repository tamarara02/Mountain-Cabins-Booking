package com.example.backend.controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entities.User;
import com.example.backend.services.UserService;


@RestController
@RequestMapping("/users")
@CrossOrigin(origins="http://localhost:4200")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/check")
    public ResponseEntity<String> check(@RequestBody User u){
        String result = userService.checkStatus(u.getUsername());
        System.out.println("Nalog korisnika " + u.getUsername() + " je " + result);

        return switch (result) {
            case "aktivan" -> ResponseEntity.ok("Korisnik uspešno logovan!");
            case "neobradjen" -> ResponseEntity.badRequest().body("Zahtev za registraciju nije obradjen!");
            case "odbijen" -> ResponseEntity.badRequest().body("Odbijen zahtev za registraciju!");
            case "deaktiviran" -> ResponseEntity.badRequest().body("Vaš nalog je deaktiviran!");
            default -> ResponseEntity.badRequest().body("Problem sa logovanjem!");
        };
    }

    @PostMapping("/login")
    public ResponseEntity<User> logIn(@RequestBody User u) {
        User loggedUser = userService.logIn(u.getUsername(), u.getPassword());
        if (loggedUser != null) {
            return ResponseEntity.ok(loggedUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
        @RequestParam("username") String username,
        @RequestParam("password") String password,
        @RequestParam("name") String name,
        @RequestParam("lastname") String lastname,
        @RequestParam("gender") String gender,
        @RequestParam("address") String address,
        @RequestParam("phone") String phone,
        @RequestParam("mail") String mail,
        @RequestParam("card") String card,
        @RequestParam("type") String type,
        @RequestParam(value = "picture", required = false) MultipartFile picture
    ) {
        try {
            String pictureFilename;

            if (picture != null && !picture.isEmpty()) {
                // sačuvaj fajl na serveru
                pictureFilename = picture.getOriginalFilename();
            } else {
                // default slika
                pictureFilename = "unknownuser.jpg";
            }

            // Napravi User entitet
            User user = new User();
            user.setUsername(username);
            user.setPassword(password); // PasswordUtils će se koristiti u servisu
            user.setName(name);
            user.setLastname(lastname);
            user.setGender(gender);
            user.setAddress(address);
            user.setPhone(phone);
            user.setMail(mail);
            user.setPicture(pictureFilename);
            user.setCard(card);
            user.setType(type);

            // Pozovi servis za registraciju
            String result = userService.register(user);

            if ("OK".equals(result)) {
                if (picture != null && !picture.isEmpty()) {
                    String basePath = System.getProperty("user.dir"); 
                    Path path = Paths.get(basePath, "backend", "uploads", "img", pictureFilename);
                    Files.createDirectories(path.getParent());
                    Files.copy(picture.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                }
                return ResponseEntity.ok("Korisnik uspešno registrovan!");
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Greška prilikom čuvanja slike!");
        }
    }


    @PostMapping("/update")
    public ResponseEntity<String> update(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam("lastname") String lastname,
            @RequestParam("gender") String gender,
            @RequestParam("address") String address,
            @RequestParam("phone") String phone,
            @RequestParam("mail") String mail,
            @RequestParam("card") String card,
            @RequestParam("type") String type,
            @RequestParam(value = "picture", required = false) MultipartFile picture
    ) {
        try {
            // Pronađi postojećeg korisnika
            User existingUser = userService.findByUsername(username);
            if (existingUser == null) {
                return ResponseEntity.badRequest().body("Korisnik ne postoji!");
            }

            // Odredi naziv fajla za sliku
            String pictureFilename;
            if (picture != null && !picture.isEmpty()) {
                pictureFilename = picture.getOriginalFilename();
            } else {
                pictureFilename = existingUser.getPicture();
            }

            // Ažuriraj polja korisnika
            existingUser.setName(name);
            existingUser.setLastname(lastname);
            existingUser.setAddress(address);
            existingUser.setPhone(phone);
            existingUser.setMail(mail);
            existingUser.setCard(card);
            existingUser.setPicture(pictureFilename);

            // Sačuvaj promene kroz servis
            userService.save(existingUser);

            // Sačuvaj fajl slike, ako postoji
            if (picture != null && !picture.isEmpty()) {
                String basePath = System.getProperty("user.dir");
                Path path = Paths.get(basePath, "backend", "uploads", "img", pictureFilename);
                Files.createDirectories(path.getParent());
                Files.copy(picture.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            }

            return ResponseEntity.ok("Korisnik uspešno ažuriran!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Greška prilikom čuvanja slike!");
        }
    }

    @PostMapping("/getuser")
    public ResponseEntity<User> getUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        User user = userService.getUser(username);
        if(user != null){
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/changepass")
    public ResponseEntity<String> changeUserPass(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        String res = userService.changeUserPass(username, oldPassword, newPassword);
        if ("OK".equals(res)) {
            return ResponseEntity.ok("Lozinka uspešno promenjena!");
        } else {
            return ResponseEntity.badRequest().body(res);
        }
    }
}
