package com.example.backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.PasswordUtils;
import com.example.backend.db.repositories.UserRepo;
import com.example.backend.entities.User;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    public String checkStatus(String username){
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(User::getStatus).orElse(null);
    }

    public User logIn(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User userFromDb = optionalUser.get();
            if (PasswordUtils.verifyPassword(password, userFromDb.getPassword())) {
                userFromDb.setPassword("");
                return userFromDb;
            } else {
                System.out.println("Lozinka je netačna");
            }
        } else {
            System.out.println("Korisnik ne postoji");
        }
        return null;
    }

    public String register(User u){
        if(userRepository.findByUsername(u.getUsername()).isPresent()){
            return "Korisničko ime je zauzeto!";
        }
        if(userRepository.findByMail(u.getMail()).isPresent()){
            return "Već postoji nalog sa tom mejl adresom!";
        }
        // hash lozinke
        u.setPassword(PasswordUtils.hashPassword(u.getPassword()));
        u.setStatus("neobradjen"); // default status
        userRepository.save(u);
        return "OK";
    }

    public String update(User user) {
        Optional<User> existing = userRepository.findByUsername(user.getUsername());
        if (existing.isPresent()) {
            User u = existing.get();
            u.setName(user.getName());
            u.setLastname(user.getLastname());
            u.setAddress(user.getAddress());
            u.setPhone(user.getPhone());
            u.setMail(user.getMail());
            u.setPicture(user.getPicture());
            u.setCard(user.getCard());
            userRepository.save(u);
            return "OK";
        } else {
            return "Korisničko ime ne postoji!";
        }
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public User getUser(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if(optionalUser.isPresent()) {
            User u = optionalUser.get();
            u.setPassword("");
            return u;
        }
        return null;
    }

    public String changeUserPass(String username, String oldPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (PasswordUtils.verifyPassword(oldPassword, user.getPassword())) {
                user.setPassword(PasswordUtils.hashPassword(newPassword));
                userRepository.save(user);
                return "OK";
            } else {
                return "Neispravna stara lozinka!";
            }
        } else {
            return "Korisnik ne postoji!";
        }
    }

}
