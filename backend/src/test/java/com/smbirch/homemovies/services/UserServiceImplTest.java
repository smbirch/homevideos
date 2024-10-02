//package com.smbirch.homemovies.services;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//import com.smbirch.homemovies.dtos.UserResponseDto;
//import com.smbirch.homemovies.mappers.UserMapper;
//import com.smbirch.homemovies.services.impl.UserServiceImpl;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//@ExtendWith(MockitoExtension.class)
//public class UserServiceImplTest {
//
//  @Mock private UserMapper userMapper;
//
//  @InjectMocks private UserServiceImpl userService;
//
//  @Test
//  public void testGetUserByUsername() {
//    String username = "testuser";
//    User user = new User(username, "Test User", "test@example.com");
//    UserResponseDto userResponseDto =
//        new UserResponseDto(username, "Test User", "test@example.com");
//
//    when(userService.getUserHelper(username)).thenReturn(user);
//    when(userMapper.entityToDto(user)).thenReturn(userResponseDto);
//
//    UserResponseDto result = userService.getUserByUsername(username);
//
//    assertNotNull(result);
//    assertEquals(username, result.getUsername());
//    assertEquals("Test User", result.getName());
//    assertEquals("test@example.com", result.getEmail());
//
//    verify(userService).getUserHelper(username);
//    verify(userMapper).entityToDto(user);
//  }
//}
