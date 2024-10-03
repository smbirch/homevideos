package com.smbirch.homemovies.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthDto {
    private boolean valid;
    private String message;
}
