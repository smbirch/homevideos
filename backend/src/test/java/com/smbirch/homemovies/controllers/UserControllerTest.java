//package com.smbirch.homemovies.controllers;
//
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//
//import com.smbirch.homemovies.dtos.UserResponseDto;
//import com.smbirch.homemovies.services.UserService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.test.web.servlet.MockMvc;
//
//@WebMvcTest(UserController.class)
//public class UserControllerTest {
//
//  @Autowired
//  private MockMvc mockMvc;
//
//  @MockBean
//  private UserService userService;
//
//  @Test
//  public void testGetUserByUsername() throws Exception {
//    String username = "testuser";
//    UserResponseDto userResponseDto = new UserResponseDto();
//
//    userResponseDto.setUsername(username);
//    when(userService.getUserByUsername(username)).thenReturn(userResponseDto);
//
//    mockMvc
//        .perform(get("/users/{username}", username))
//        .andExpect(status().isOk())
//        .andExpect(jsonPath("$.username").value(username))
//        .andExpect(jsonPath("$.name").value("Test User"))
//        .andExpect(jsonPath("$.email").value("test@example.com"));
//  }
//}
