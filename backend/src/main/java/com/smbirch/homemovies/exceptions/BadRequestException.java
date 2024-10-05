package com.smbirch.homemovies.exceptions;

import java.io.Serial;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class BadRequestException extends RuntimeException {

  @Serial private static final long serialVersionUID = -4473099953347002333L;

  private String message;
}
