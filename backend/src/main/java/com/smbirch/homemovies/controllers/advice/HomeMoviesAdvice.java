package com.smbirch.homemovies.controllers.advice;

import com.smbirch.homemovies.dtos.ErrorDto;
import com.smbirch.homemovies.exceptions.BadRequestException;
import com.smbirch.homemovies.exceptions.NotAuthorizedException;
import com.smbirch.homemovies.exceptions.NotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice(basePackages = "com.smbirch.homemovies.controllers")
@ResponseBody
public class HomeMoviesAdvice {

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(BadRequestException.class)
  public ErrorDto handleBadRequestException(
      HttpServletRequest request, BadRequestException badRequestException) {
    return new ErrorDto(false, badRequestException.getMessage());
  }

  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  @ExceptionHandler(NotAuthorizedException.class)
  public ErrorDto handleNotAuthorizedException(
      HttpServletRequest request, NotAuthorizedException notAuthorizedException) {
    return new ErrorDto(false, notAuthorizedException.getMessage());
  }

  @ResponseStatus(HttpStatus.NOT_FOUND)
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ErrorDto> handleNotFoundException(
      HttpServletRequest request, NotFoundException notFoundException) {
    ErrorDto errorDto = new ErrorDto(false, notFoundException.getMessage());
    return new ResponseEntity<>(errorDto, HttpStatus.NOT_FOUND);
  }
}
