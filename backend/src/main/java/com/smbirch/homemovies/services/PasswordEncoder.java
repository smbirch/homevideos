package com.smbirch.homemovies.services;


public interface PasswordEncoder {
    String hashPassword(String password);

    boolean verifyPassword(String rawPassword, String encodedPassword);
}