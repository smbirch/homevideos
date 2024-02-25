package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserResponseDto {
    private String username;
    private ProfileDto profile;
}