package com.smbirch.homemovies.services;

import io.jsonwebtoken.Claims;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

public interface JwtService {
  String generateToken(String username, boolean isAdmin);

  String generateToken(Map<String, Object> claims, String userName);

  String extractUsername(String token);

  Date extractExpiration(String token);

  <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

  boolean isUserAdmin(String token);

  boolean isTokenExpired(String token);

  boolean validateToken(String token);

  boolean validateTokenAndUser(String token, String username);

  boolean blacklistToken(String token);

  boolean isBlacklisted(String token);

  String getTokenSubString(String token);
}
