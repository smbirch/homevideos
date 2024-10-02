package com.smbirch.homemovies.controllers;

import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.services.UserService;
import java.util.List;
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
  public UserResponseDto createUser(@RequestBody UserRequestDto userRequestDto) {
    return userService.createUser(userRequestDto);
  }

  @PostMapping("/login")
  public UserResponseDto login(@RequestBody UserRequestDto userRequestDto) {
    return userService.login(userRequestDto);
  }

  @PostMapping("/validate/{username}")
  public ResponseEntity<?> validateUser(
      @PathVariable String username, @RequestHeader("Authorization") String authHeader) {
    return userService.validateUser(authHeader, username);
  }
}
