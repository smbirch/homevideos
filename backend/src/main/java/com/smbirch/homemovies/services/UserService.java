package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.AuthDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface UserService {
  List<UserResponseDto> getAllUsers();

  UserResponseDto createUser(UserRequestDto userRequestDto);

  UserResponseDto getUserByUsername(String username);

  UserResponseDto login(UserRequestDto userRequestDto);

  ResponseEntity<AuthDto> validateUser(String authHeader, String username);

  ResponseEntity<AuthDto> logoutUser(String authHeader, String username);
}
