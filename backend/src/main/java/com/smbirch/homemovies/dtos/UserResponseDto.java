package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@NoArgsConstructor
@Data
public class UserResponseDto {
    private String username;
    private Timestamp joined;
    private ProfileDto profile;
}