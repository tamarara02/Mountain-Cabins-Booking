package com.example.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.db.repositories.AdminRepo;
import com.example.backend.db.repositories.CottageRepo;
import com.example.backend.entities.Cottage;
import com.example.backend.entities.User;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private CottageRepo cottageRepo;

    public List<User> getAllUsers() {
        return adminRepo.findAll();
    }

    public boolean isCritical(Cottage cottage) {
        List<Integer> ratings = adminRepo.findRatingsForCottage(cottage);
        
        int count = 0;
        for (Integer rating : ratings) {
            if (count == 3) break; // proveravamo samo poslednje 3 ocene
            if (rating >= 2) {
                System.out.println("Za kucu id:" + cottage.getId() + " nije kriticna");
                return false;
            }
            count++;
        }

        if (count < 3) {
            System.out.println("Za kucu id:" + cottage.getId() + " nema dovoljno ocena");
            return false;
        }

        System.out.println("Za kucu id:" + cottage.getId() + " je kriticna");
        return true;
    }

    public void blockCottage(Cottage cottage) {
        Cottage c = cottageRepo.findById(cottage.getId())
                             .orElseThrow(() -> new RuntimeException("Cottage not found"));
        c.setStatus("blokirana");
        cottageRepo.save(c);
    }

    public void deactivateUser(String username) {
        User u = adminRepo.findByUsername(username)
                          .orElseThrow(() -> new RuntimeException("User not found"));
        u.setStatus("deaktiviran");
        adminRepo.save(u);
    }

    public void acceptUser(String username) {
        User u = adminRepo.findByUsername(username)
                          .orElseThrow(() -> new RuntimeException("User not found"));
        u.setStatus("aktivan");
        adminRepo.save(u);
    }

    public void declineUser(String username) {
        User u = adminRepo.findByUsername(username)
                          .orElseThrow(() -> new RuntimeException("User not found"));
        u.setStatus("odbijen");
        adminRepo.save(u);
    }
}
