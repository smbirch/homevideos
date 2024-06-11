package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.services.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public UserResponseDto createUser(@RequestBody UserRequestDto userRequestDto) {
        return userService.createUser(userRequestDto);
    }

    @PostMapping("/validate")
    public UserResponseDto validateUser(@RequestBody CredentialsDto credentialsDto) {
        return userService.validateUser(credentialsDto);
    }

    @GetMapping("/{username}")
    public UserResponseDto getUserByUsername(@PathVariable("username") String username) {
        return userService.getUserByUsername(username);
    }

}