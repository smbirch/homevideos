package com.smbirch.homemovies.services;

import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;

import java.util.List;

public interface UserService {
    List<UserResponseDto> getAllUsers();

    UserResponseDto createUser(UserRequestDto userRequestDto);
}