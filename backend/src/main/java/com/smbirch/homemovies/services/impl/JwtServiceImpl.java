package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class JwtServiceImpl implements JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private Long jwtExpiration;

  private final RedisTemplate<String, String> redisTemplate;

  public JwtServiceImpl(RedisTemplate<String, String> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  @Override
  public String generateToken(String username) {
    Map<String, Object> claims = new HashMap<>();
    return generateToken(claims, username);
  }

  @Override
  public String generateToken(Map<String, Object> claims, String userName) {
    long now = System.currentTimeMillis();
    Date nowDate = new Date(now);
    return Jwts.builder()
        .claims(claims)
        .subject(userName)
        .issuedAt(nowDate)
        .expiration(new Date(now + jwtExpiration))
        .signWith(signInKeyHelper())
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
  public boolean isTokenExpired(String token) {
    Date expiration = extractExpiration(token);
    if (expiration.after(new Date())) {
      return false;
    } else {
      blacklistToken(token);
      return true;
    }
  }

  @Override
  public boolean validateToken(String token) {
    if (isTokenExpired(token) || isBlacklisted(token)) {
      return false;
    }
    try {
      Jwts.parser().verifyWith(signInKeyHelper()).build().parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      System.out.println("Invalid token: " + e.getMessage()); // TODO: implement logging for these
      return false;
    }
  }

  @Override
  public boolean validateTokenAndUser(String token, String username) {
    if (!validateToken(token)) {
      return false;
    }
    return extractUsername(token).equals(username);
  }

  @Override
  public boolean blacklistToken(String token) {
    String key = "blacklist:" + token;
    Date expiration = extractExpiration(token);
    long expiresIn = expiration.getTime();
    try {
      redisTemplate.opsForValue().set(key, "blacklisted", expiresIn, TimeUnit.MILLISECONDS);
    } catch (Exception e) {
      System.out.println("Error blacklisting token: " + e.getMessage()); // TODO: implement logging for these
    }
    return true;
  }

  @Override
  public boolean isBlacklisted(String token) {
    String key = "blacklist:" + token;
    return Boolean.TRUE.equals(redisTemplate.hasKey(key));
  }

  @Override
  public String getTokenSubString(String token) {
    return token.substring(7);
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
