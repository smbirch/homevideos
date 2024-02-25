package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.dtos.ProfileDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.exceptions.BadRequestException;
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

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        User user = new User();
        CredentialsDto credentials = userRequestDto.getCredentials();
        ProfileDto profile = userRequestDto.getProfile();

        if (credentials == null || profile == null || profile.getEmail() == null || credentials.getPassword() == null || credentials.getUsername() == null) {
            throw new BadRequestException("A required parameter is missing");
        }
        for (User userFromRepo : userRepository.findAll()) {
            if (userFromRepo.getCredentials().getUsername().equals(credentials.getUsername())) {
                if (userFromRepo.isDeleted()) {
                    userFromRepo.setDeleted(false);
                    userRepository.flush();
                    return userMapper.entityToDto(userFromRepo);
                } else {
                    throw new BadRequestException("This username is already in use.");
                }
            }
        }
        user.setProfile(userMapper.requestDtoToEntity(userRequestDto).getProfile());
        user.setCredentials(userMapper.requestDtoToEntity(userRequestDto).getCredentials());

        return userMapper.entityToDto(userRepository.saveAndFlush(user));
    }
}