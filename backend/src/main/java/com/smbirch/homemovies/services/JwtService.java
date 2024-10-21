package com.smbirch.homemovies.services;

import com.smbirch.homemovies.entities.User;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

public interface JwtService {
  String generateToken(User user);

  String generateToken(Map<String, Object> claims, String userName);

  String extractUsername(String token);

  Date extractExpiration(String token);

  <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

  boolean isUserAdmin(String token);

  boolean isTokenExpired(String token);

  boolean isTokenValid(String token);

  boolean validateTokenAndUser(HttpServletRequest request, String username);

  boolean blacklistToken(String token);

  boolean isBlacklisted(String token);

  String getTokenSubString(String token);

  void setAuthenticationCookie(String token, HttpServletResponse response);

  String getTokenFromRequest(HttpServletRequest request);
}
