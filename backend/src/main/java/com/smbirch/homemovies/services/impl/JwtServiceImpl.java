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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
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
    log.info("102 - Generating JWT token for {}", username);
    return generateToken(new HashMap<>(), username);
  }

  @Override
  public String generateToken(Map<String, Object> claims, String userName) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .claims(claims)
        .subject(userName)
        .issuedAt(new Date(now))
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
    try {
      Date expiration = extractExpiration(token);
      return expiration != null && expiration.before(new Date());
    } catch (Exception e) {
      log.warn("500 - Error checking token expiration: {}", e.getMessage());
      return true;
    }
  }

  @Override
  public boolean validateToken(String token) {
    if (isBlacklisted(token)) {
      return false;
    }
    try {
      Jwts.parser().verifyWith(signInKeyHelper()).build().parseSignedClaims(token);
      return !isTokenExpired(token);
    } catch (Exception e) {
      log.warn("500 - Failure to validate Token: {}", e.getMessage());
      return false;
    }
  }

  @Override
  public boolean validateTokenAndUser(String token, String username) {
    if (!validateToken(token)) {
      return false;
    }
    String extractedUsername = extractUsername(token);
    if (!extractedUsername.equals(username)) {
      log.warn("406 - Username does not match token claims");
      return false;
    }
    log.info("200 - Token validated for user '{}'", username);
    return true;
  }

  @Override
  public boolean blacklistToken(String token) {
    String key = "blacklist:" + token;
    try {
      Date expiration = extractExpiration(token);
      if (expiration != null) {
        long expiresIn = expiration.getTime() - System.currentTimeMillis();
        redisTemplate.opsForValue().set(key, "blacklisted", expiresIn, TimeUnit.MILLISECONDS);
        log.info("200 - Token blacklisted successfully: '{}'", token);
        return true;
      }
    } catch (Exception e) {
      log.warn("500 - Error while blacklisting token: {}", e.getMessage());
    }
    return false;
  }

  @Override
  public boolean isBlacklisted(String token) {
    String key = "blacklist:" + token;
    boolean isBlacklisted = redisTemplate.opsForValue().get(key) != null;
    log.info("102 - Checking token blacklist status");
    log.info("200 - Token is {}blacklisted: '{}'", isBlacklisted ? "" : "not ", token);
    return isBlacklisted;
  }

  @Override
  public String getTokenSubString(String token) {
    return token.startsWith("Bearer ") ? token.substring(7) : token;
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
