package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserResponseDto {
  private long id;
  private String username;
  private String token;
  private ProfileDto profile;
}
