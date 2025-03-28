package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CredentialsDto {
  private String username;
  private String password;
  private String token;
}
