package com.example.backend.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entities.Cottage;
import com.example.backend.entities.User;
import com.example.backend.services.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="http://localhost:4200")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/getusers")
    public List<User> getUsers() {
        return adminService.getAllUsers();
    }

    @PostMapping("/iscritical")
    public boolean isCritical(@RequestBody Cottage c) {
        return adminService.isCritical(c);
    }

    @PostMapping("/blockcottage")
    public void blockCottage(@RequestBody Cottage c){
        adminService.blockCottage(c);
    }

    @PostMapping("/deactuser")
    public void deactivateUser(@RequestBody User u){
        adminService.deactivateUser(u.getUsername());
    }

    @PostMapping("/acceptuser")
    public void acceptUser(@RequestBody User u){
        adminService.acceptUser(u.getUsername());
    }

    @PostMapping("/declineuser")
    public void declineUser(@RequestBody User u){
        adminService.declineUser(u.getUsername());
    }

}
