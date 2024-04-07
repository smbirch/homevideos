package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.CredentialsDto;
import com.smbirch.homemovies.dtos.ProfileDto;
import com.smbirch.homemovies.dtos.UserRequestDto;
import com.smbirch.homemovies.dtos.UserResponseDto;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.exceptions.BadRequestException;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.UserMapper;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.services.PasswordEncoder;
import com.smbirch.homemovies.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    private User getUserHelper(String username) {
        Optional<User> userToCheckFor = userRepository.findByCredentials_Username(username);

        if (userToCheckFor.isEmpty() || userToCheckFor.get().isDeleted()) {
            throw new NotFoundException("No user found with username: '" + username + "'");
        }
        return userToCheckFor.get();
    }

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
        CredentialsDto credentials = userRequestDto.getCredentials();
        ProfileDto profile = userRequestDto.getProfile();

        if (credentials == null || profile == null || profile.getEmail() == null || credentials.getPassword() == null || credentials.getUsername() == null) {
            throw new BadRequestException("A required parameter is missing");
        }
        if (userRepository.existsByCredentials_Username(credentials.getUsername())) {
            throw new BadRequestException("This username is already in use.");
        }

        String hashedPassword = passwordEncoder.hashPassword(credentials.getPassword());
        userRequestDto.getCredentials().setPassword(hashedPassword);
        User user = new User();
        user.setProfile(userMapper.requestDtoToEntity(userRequestDto).getProfile());
        user.setCredentials(userMapper.requestDtoToEntity(userRequestDto).getCredentials());

        return userMapper.entityToDto(userRepository.saveAndFlush(user));
    }

    @Override
    public UserResponseDto getUserByUsername(String username) {
        return userMapper.entityToDto(getUserHelper(username));
    }

    @Override
    public UserResponseDto validateUser(CredentialsDto credentialsDto) {
        User userByUsername = getUserHelper(credentialsDto.getUsername());

        boolean doesPasswordMatch = passwordEncoder.verifyPassword(credentialsDto.getPassword(), userByUsername.getCredentials().getPassword());

        if (!doesPasswordMatch) {
            throw new BadRequestException("Username or password is incorrect");
        } else {
            return userMapper.entityToDto(userByUsername);
        }
    }
}