package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.AuthDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface UserService {
  List<UserResponseDto> getAllUsers();

  UserResponseDto createUser(UserRequestDto userRequestDto);

  UserResponseDto getUserByUsername(String username);

  ResponseEntity<UserResponseDto> login(UserRequestDto userRequestDto, HttpServletResponse response);

  ResponseEntity<AuthDto> validateUser(UserRequestDto userRequestDto, HttpServletRequest request);

  ResponseEntity<AuthDto> logoutUser(UserRequestDto userRequestDto, HttpServletRequest request, HttpServletResponse response);

  ResponseEntity<AuthDto> releaseToken(String username, HttpServletResponse response);
}
