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
@RequestMapping("/users")
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

  @GetMapping("/{username}")
  public UserResponseDto getUserByUsername(@PathVariable("username") String username) {
    return userService.getUserByUsername(username);
  }

  @PostMapping("/login")
  public UserResponseDto getUserByCredentials(@RequestBody CredentialsDto credentialsDto) {
    return userService.getUserByCredentials(credentialsDto);
  }
}