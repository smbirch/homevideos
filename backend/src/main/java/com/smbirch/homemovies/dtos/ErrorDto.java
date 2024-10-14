package com.smbirch.homemovies.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ErrorDto {
  private boolean success;
  private String message;
}
