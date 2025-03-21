package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.dtos.*;
import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.exceptions.BadRequestException;
import com.smbirch.homemovies.exceptions.NotAuthorizedException;
import com.smbirch.homemovies.exceptions.NotFoundException;
import com.smbirch.homemovies.mappers.UserMapper;
import com.smbirch.homemovies.repositories.UserRepository;
import com.smbirch.homemovies.services.JwtService;
import com.smbirch.homemovies.services.PasswordEncoder;
import com.smbirch.homemovies.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
            log.warn("404 - No user found with username: '{}'", username);
            throw new NotFoundException("No user found with username: '" + username + "'");
        }
        return userToCheckFor.get();
    }

    // TODO: Is this needed? can it be simplified?
    private ResponseEntity<AuthDto> invalidateTokenHelper(String username, HttpServletResponse response) {
        String token = response.getHeader("Authorization");
        try {
            boolean isValidToken = jwtService.validateTokenAndUser(token, username);
            if (isValidToken) {
                if (jwtService.blacklistToken(token)) {
                    log.info("200 - Token invalidated succesfully: '{}'", token);
                    return ResponseEntity.ok(new AuthDto(true, "Token has been invalidated"));
                }
            } else {
                log.warn("400 - Invalid token: '{}' for user: '{}'", token, username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "Invalid token"));
            }
        } catch (Exception e) {
            log.warn("500 - Error invalidating token: '{}'", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "Error invalidating token"));
        }
        // If we get here we will fail the request
        log.warn("500 - Error not caught while invalidating token: '{}' for user: '{}'", token, username);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "Error invalidating token"));
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<UserResponseDto> userList = userMapper.entitiesToDtos(userRepository.findAll());
        userList.removeIf(user -> userMapper.responseDtoToEntity(user).isDeleted());
        return userList;
    }

    @Override
    public ResponseEntity<UserResponseDto> createUser(UserRequestDto userRequestDto, HttpServletResponse response) {
        log.info("102 - Creating new user: '{}'", userRequestDto.getCredentials().getUsername());
        CredentialsDto credentials = userRequestDto.getCredentials();
        ProfileDto profile = userRequestDto.getProfile();

        if (credentials == null || profile == null || profile.getEmail() == null || credentials.getPassword() == null || credentials.getUsername() == null) {
            log.info("400 - Create User Failed: A required parameter is missing: '{}'", userRequestDto);
            throw new BadRequestException("A required parameter is missing");
        }
        if (userRepository.existsByCredentials_Username(credentials.getUsername())) {
            log.warn("400 - Failed to create user with username: '{}' - username already exists", credentials.getUsername());
            throw new BadRequestException("This username is already in use.");
        }

        String hashedPassword = passwordEncoder.hashPassword(credentials.getPassword());
        userRequestDto.getCredentials().setPassword(hashedPassword);
        User user = userMapper.requestDtoToEntity(userRequestDto);

        String newJwtToken = jwtService.generateToken(user);
        jwtService.setAuthenticationCookie(newJwtToken, response);

        user = userRepository.saveAndFlush(user);
        log.info("201 - New user created successfully with ID: '{}' and username: '{}'", user.getId(), user.getCredentials().getUsername());

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setId(user.getId());
        userResponseDto.setUsername(credentials.getUsername());
        userResponseDto.setProfile(profile);
        userResponseDto.setToken(newJwtToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(userResponseDto);
    }

    @Override
    public UserResponseDto getUserByUsername(String username) {
        return userMapper.entityToDto(getUserHelper(username));
    }

    @Override
    public ResponseEntity<UserResponseDto> login(UserRequestDto userRequestDto, HttpServletResponse response) {
        String username = userRequestDto.getCredentials().getUsername().toLowerCase();
        String password = userRequestDto.getCredentials().getPassword();
        log.info("102 - Login attempt for user: '{}'", username);
        User user = getUserHelper(username);

        boolean doesPasswordMatch = passwordEncoder.verifyPassword(password, user.getCredentials().getPassword());

        if (!doesPasswordMatch) {
            log.warn("401 - '{}' submitted an incorrect password at login", username);
            throw new NotAuthorizedException("Username or password is incorrect");
        }

        String newJwtToken = jwtService.generateToken(user);
        jwtService.setAuthenticationCookie(newJwtToken, response);

        UserResponseDto userResponseDto = new UserResponseDto();
        ProfileDto profileDto = new ProfileDto();
        userResponseDto.setProfile(profileDto);
        userResponseDto.setId(user.getId());
        userResponseDto.setUsername(user.getCredentials().getUsername());
        userResponseDto.getProfile().setEmail(user.getProfile().getEmail());
        userResponseDto.getProfile().setFirstName(user.getProfile().getFirstName());
        userResponseDto.getProfile().setLastName(user.getProfile().getLastName());
        userResponseDto.getProfile().setAdmin(user.getProfile().isAdmin());
        userResponseDto.setToken(newJwtToken);

        log.info("200 - Successful login for user: '{}'", username);
        return ResponseEntity.ok(userResponseDto);
    }

    @Override
    public ResponseEntity<AuthDto> validateUser(UserRequestDto userRequestDto, HttpServletRequest request) {
        String username = userRequestDto.getCredentials().getUsername();
        log.info("102 - Token validation request for user: '{}'", username);
        String token = jwtService.getTokenFromRequest(request);
        try {
            boolean isValid = jwtService.validateTokenAndUser(token, username);
            if (isValid) {
                return ResponseEntity.ok(new AuthDto(true, "Token is valid"));
            } else {
                log.warn("401 - Token is invalid for user '{}'", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "Invalid token"));
            }
        } catch (Exception e) {
            log.error("500 - Cannot validate token for user '{}'", username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "Error validating token"));
        }
    }

    @Override
    public ResponseEntity<AuthDto> logoutUser(UserRequestDto userRequestDto, HttpServletRequest request, HttpServletResponse response) {
        log.info("102 - Logging out user: '{}'", userRequestDto.getCredentials().getUsername());
        String token = jwtService.getTokenFromRequest(request);

        if (token == null) {
            log.warn("401 - No token found in request for user: {}", userRequestDto.getCredentials().getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthDto(false, "No token found"));
        }

        jwtService.blacklistToken(token);

        Cookie authCookie = new Cookie("homevideosCookie", "");
        authCookie.setMaxAge(0);
        authCookie.setPath("/");
        authCookie.setHttpOnly(true);
        authCookie.setSecure(false);  // TODO: Set to true for production
        authCookie.setAttribute("SameSite", "Lax");
        response.addCookie(authCookie);

        log.info("200 - Successfully logged out user: '{}'", userRequestDto.getCredentials().getUsername());
        return ResponseEntity.ok(new AuthDto(true, "Token has been invalidated"));

    }

    @Override
    public ResponseEntity<AuthDto> releaseToken(String username, HttpServletResponse response) {
        String token = response.getHeader("Authorization");
        log.info("102 - Releasing token: '{}' for user: '{}'", token, username);
        return invalidateTokenHelper(username, response);
    }
}