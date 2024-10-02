package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtServiceImpl implements JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private Long jwtExpiration;

  SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

  @Override
  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return generateToken(claims, username);
  }

  @Override
  public String generateToken(Map<String, Object> claims, String userName) {
    long nowMillis = System.currentTimeMillis();
    Date now = new Date(nowMillis);
    return Jwts.builder()
            .claims(claims)
            .subject(userName)
            .issuedAt(now)
            .expiration(new Date(nowMillis + jwtExpiration))
            .signWith(signInKeyHelper(), signatureAlgorithm)
            .compact();
  }

  @Override
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  @Override
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  @Override
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  @Override
  public Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  @Override
  public Boolean validateToken(String token) {
    try {
      Jwts.parser()
              .verifyWith(signInKeyHelper())
              .build()
              .parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      System.out.println("Invalid token: " + e.getMessage()); // TODO: implement logging for these
      return false;
    }
  }

  @Override
  public Boolean validateTokenAndUser(String token, String username) {
    try {
      if (!validateToken(token)) {
        return false;
      }
      String tokenUsername = extractUsername(token);
      return tokenUsername.equals(username) && !isTokenExpired(token);
    } catch (Exception e) {
      System.out.println("Error validating token and user: " + e.getMessage());
      return false;
    }
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser()
        .verifyWith(signInKeyHelper())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private SecretKey signInKeyHelper() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKey);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
