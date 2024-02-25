package com.smbirch.homemovies.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;

@AllArgsConstructor
@Getter
@Setter
public class NotFoundException extends RuntimeException {
    @Serial private static final long serialVersionUID = -6496940574625196392L;

    private String message;
}