package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
  List<UserResponseDto> getAllUsers();

  UserResponseDto createUser(UserRequestDto userRequestDto);

  UserResponseDto getUserByUsername(String username);

  UserResponseDto login(UserRequestDto userRequestDto);

  ResponseEntity<?> validateUser(String authHeader, String username);
}
