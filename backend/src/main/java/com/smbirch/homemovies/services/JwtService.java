package com.smbirch.homemovies.services;

import io.jsonwebtoken.Claims;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

public interface JwtService {
  String generateToken(String username);

  String generateToken(Map<String, Object> claims, String userName);

  String extractUsername(String token);

  Date extractExpiration(String token);

  <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

  Boolean isTokenExpired(String token);

  Boolean validateToken(String token);

  Boolean validateTokenAndUser(String token, String username);
}
