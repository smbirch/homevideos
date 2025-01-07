package com.smbirch.homemovies.exceptions;

import java.io.Serial;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class NotFoundException extends RuntimeException {
  @Serial
  private static final long serialVersionUID = -6496940574625196392L;

  public NotFoundException(String message) {
    super(message);
  }
}
