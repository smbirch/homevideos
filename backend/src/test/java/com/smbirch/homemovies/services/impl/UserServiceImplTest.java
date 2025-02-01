//package com.smbirch.homemovies.services.impl;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//import com.smbirch.homemovies.dtos.CredentialsDto;
//import com.smbirch.homemovies.dtos.ProfileDto;
//import com.smbirch.homemovies.dtos.UserRequestDto;
//import com.smbirch.homemovies.dtos.UserResponseDto;
//import com.smbirch.homemovies.entities.Credentials;
//import com.smbirch.homemovies.entities.Profile;
//import com.smbirch.homemovies.entities.User;
//import com.smbirch.homemovies.mappers.UserMapper;
//import com.smbirch.homemovies.repositories.UserRepository;
//import com.smbirch.homemovies.services.JwtService;
//import com.smbirch.homemovies.services.PasswordEncoder;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//public class UserServiceImplTest {
//
//  @InjectMocks private UserServiceImpl userService;
//
//  @Mock private UserRepository userRepository;
//
//  @Mock private UserMapper userMapper;
//
//  @Mock private PasswordEncoder passwordEncoder;
//
//  @Mock private JwtService jwtService;
//
//  @BeforeEach
//  void setUp() {
//    MockitoAnnotations.openMocks(this);
//  }
//
//  @Test
//  void createUser_Success() {
//    // Arrange
//    UserRequestDto userRequestDto = new UserRequestDto();
//    CredentialsDto credentialsDto = new CredentialsDto();
//    credentialsDto.setUsername("testuser");
//    credentialsDto.setPassword("password123");
//    ProfileDto profileDto = new ProfileDto();
//    profileDto.setEmail("test@example.com");
//    userRequestDto.setCredentials(credentialsDto);
//    userRequestDto.setProfile(profileDto);
//
//    User user = new User();
//    user.setId(1L);
//    user.setCredentials(new Credentials());
//    user.setProfile(new Profile());
//
//    when(userRepository.existsByCredentials_Username("testuser")).thenReturn(false);
//    when(passwordEncoder.hashPassword("password123")).thenReturn("hashedPassword");
//    when(userMapper.requestDtoToEntity(any(UserRequestDto.class))).thenReturn(user);
//    when(userRepository.saveAndFlush(any(User.class))).thenReturn(user);
//    when(jwtService.generateToken("testuser", true)).thenReturn("jwtToken");
//
//    // Act
//    UserResponseDto result = userService.createUser(userRequestDto);
//
//    // Assert
//    assertNotNull(result);
//    assertEquals(1L, result.getId());
//    assertEquals("testuser", result.getUsername());
//    assertEquals("jwtToken", result.getToken());
//    assertNotNull(result.getProfile());
//
//    verify(userRepository).existsByCredentials_Username("testuser");
//    verify(passwordEncoder).hashPassword("password123");
//    verify(userMapper, atLeastOnce()).requestDtoToEntity(any(UserRequestDto.class));
//    verify(userRepository).saveAndFlush(any(User.class));
//    verify(jwtService).generateToken("testuser", true);
//  }
//}
