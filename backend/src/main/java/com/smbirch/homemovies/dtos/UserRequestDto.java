package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserRequestDto {
  private String token;
  private CredentialsDto credentials;
  private ProfileDto profile;
}
