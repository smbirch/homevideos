package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.mappers.UserMapper;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<UserResponseDto> userList = userMapper.entitiesToDtos(userRepository.findAll());

        for (UserResponseDto user : userList) {
            if (userMapper.responseDtoToEntity(user).isDeleted()) {
                userList.remove(user);
            }
        }
        return userList;
    }
}