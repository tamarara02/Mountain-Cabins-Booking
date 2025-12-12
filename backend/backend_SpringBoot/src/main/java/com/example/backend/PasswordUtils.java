package com.example.backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtils {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    
    // Hešuj lozinku pre čuvanja
    public static String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }
    
    // Proveri lozinku pri loginu
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword);
    }
}
