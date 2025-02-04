package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.AuthDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.services.UserService;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

  private final UserService userService;

  @GetMapping
  public List<UserResponseDto> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/{username}")
  public UserResponseDto getUserByUsername(@PathVariable("username") String username) {
    return userService.getUserByUsername(username);
  }

  @PostMapping("/register")
  public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto userRequestDto, HttpServletResponse response) {
    return userService.createUser(userRequestDto, response);
  }

  @PostMapping("/login")
  public ResponseEntity<UserResponseDto> login(@RequestBody UserRequestDto userRequestDto, HttpServletResponse response) {
    return userService.login(userRequestDto, response);
  }

  @PostMapping("/validate")
  public ResponseEntity<AuthDto> validateUser(@RequestBody UserRequestDto userRequestDto, HttpServletRequest request) {
    return userService.validateUser(userRequestDto, request);
  }

  @PostMapping("/logout")
  public ResponseEntity<AuthDto> logout(@RequestBody UserRequestDto userRequestDto, HttpServletRequest request, HttpServletResponse response) {
    return userService.logoutUser(userRequestDto, request, response);
  }

  @PostMapping("/releasetoken")
  public ResponseEntity<AuthDto> releasetoken(@PathVariable String username, HttpServletResponse response) {
    return userService.releaseToken(username, response);
  }
}