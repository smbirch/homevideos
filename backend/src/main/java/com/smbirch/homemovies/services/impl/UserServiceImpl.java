package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.*;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.exceptions.BadRequestException;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.UserMapper;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.services.JwtService;
import com.smbirch.homemovies.services.PasswordEncoder;
import com.smbirch.homemovies.services.UserService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

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
    log.info("Creating new user: {}", userRequestDto);
    CredentialsDto credentials = userRequestDto.getCredentials();
    ProfileDto profile = userRequestDto.getProfile();

    if (credentials == null
        || profile == null
        || profile.getEmail() == null
        || credentials.getPassword() == null
        || credentials.getUsername() == null) {
      log.warn("createUser FAIL - A required parameter is missing {}", userRequestDto);
      throw new BadRequestException("A required parameter is missing");
    }
    if (userRepository.existsByCredentials_Username(credentials.getUsername())) {
      log.warn(
          "createUser FAIL - User with username: '{}' already exists", credentials.getUsername());
      throw new BadRequestException("This username is already in use.");
    }

    String hashedPassword = passwordEncoder.hashPassword(credentials.getPassword());
    userRequestDto.getCredentials().setPassword(hashedPassword);
    User user = new User();
    user.setProfile(userMapper.requestDtoToEntity(userRequestDto).getProfile());
    user.setCredentials(userMapper.requestDtoToEntity(userRequestDto).getCredentials());

    String newJwtToken = jwtService.generateToken(credentials.getUsername());
    user = userRepository.saveAndFlush(user);
    log.info(
        "New user created successfully with ID: '{}' and username: '{}'",
        user.getId(),
        user.getCredentials().getUsername());

    UserResponseDto userResponseDto = new UserResponseDto();
    userResponseDto.setId(user.getId());
    userResponseDto.setUsername(credentials.getUsername());
    userResponseDto.setProfile(profile);
    userResponseDto.setToken(newJwtToken);

    return userResponseDto;
  }

  @Override
  public UserResponseDto getUserByUsername(String username) {
    return userMapper.entityToDto(getUserHelper(username));
  }

  @Override
  public UserResponseDto login(UserRequestDto userRequestDto) {
    log.info("Logging-in user: {}", userRequestDto.getCredentials().getUsername());
    User user = getUserHelper(userRequestDto.getCredentials().getUsername());

    boolean doesPasswordMatch =
        passwordEncoder.verifyPassword(
            userRequestDto.getCredentials().getPassword(), user.getCredentials().getPassword());

    if (!doesPasswordMatch) {
      log.warn("FAIL login - '{}' submitted an incorrect password", userRequestDto.getCredentials().getUsername());
      throw new BadRequestException("Username or password is incorrect");
    }

    String newJwtToken = jwtService.generateToken(user.getCredentials().getUsername());
    UserResponseDto userResponseDto = new UserResponseDto();
    userResponseDto.setId(user.getId());
    userResponseDto.setUsername(user.getCredentials().getUsername());
    userResponseDto.setProfile(userRequestDto.getProfile());
    userResponseDto.setToken(newJwtToken);

    return userResponseDto;
  }

  @Override
  public ResponseEntity<AuthDto> validateUser(String authHeader, String username) {
    try {
      String token = jwtService.getTokenSubString(authHeader);
      boolean isValid = jwtService.validateTokenAndUser(token, username);
      if (isValid) {
        return ResponseEntity.ok(new AuthDto(true, "Token is valid"));
      } else {
        log.warn("Token is invalid for user '{}'", username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AuthDto(false, "Invalid token"));
      }
    } catch (Exception e) {
      log.warn("error validating token for user '{}'", username);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new AuthDto(false, "Error validating token"));
    }
  }

  @Override
  public ResponseEntity<AuthDto> logoutUser(String authHeader, String username) {
    log.info("Logging out user: '{}'", username);
    try {
      String token = jwtService.getTokenSubString(authHeader);
      boolean isValidToken = jwtService.validateTokenAndUser(token, username);

      if (isValidToken) {
        if (jwtService.blacklistToken(token)) {
          return ResponseEntity.ok(new AuthDto(true, "Token has been invalidated"));
        } else
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(new AuthDto(false, "Server error: Token cannot be invalidated"));
      } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AuthDto(false, "Invalid token"));
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new AuthDto(false, "Error validating token"));
    }
  }
}
