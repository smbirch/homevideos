package com.smbirch.homemovies.exceptions;

import java.io.Serial;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotAuthorizedException extends RuntimeException {
  @Serial private static final long serialVersionUID = -5552076667106114422L;

  private String message;
}
