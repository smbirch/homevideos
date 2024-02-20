package com.smbirch.homemovies.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProfileDto {
    private String firstName;

    private String lastName;

    private String email;
}