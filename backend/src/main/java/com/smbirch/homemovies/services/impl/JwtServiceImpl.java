package com.smbirch.homemovies.services.impl;

import com.smbirch.homemovies.entities.User;
import com.smbirch.homemovies.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

  private final RedisTemplate<String, String> redisTemplate;

  @Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
  private Long jwtExpiration;

  public JwtServiceImpl(RedisTemplate<String, String> redisTemplate) {
    this.redisTemplate = redisTemplate;
  }

  @Override
  public String generateToken(User user) {
    log.info("102 - Generating JWT token for user '{}'", user.getCredentials().getUsername());
    Map<String, Object> claims = new HashMap<>();
    claims.put("isAdmin", user.getProfile().isAdmin());
    return generateToken(claims, user.getCredentials().getUsername());
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
  public boolean isUserAdmin(String token) {
    Claims claims = extractAllClaims(token);
    return claims.get("isAdmin", Boolean.class);
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
  public boolean isTokenValid(String token) {
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
  public boolean validateTokenAndUser(HttpServletRequest request, String username) {
    String token = getTokenFromRequest(request);
    if (token == null) {
      return false;
    }

    if (!isTokenValid(token)) {
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

  @Override
  public void setAuthenticationCookie(String token, HttpServletResponse response) {
    response.setHeader("Access-Control-Allow-Credentials", "true");
    String cookieValue = String.format(
            "%s=%s; Path=/; Max-Age=%d; HttpOnly; SameSite=Lax",
            "homevideosCookie",
            token,
            (int) (jwtExpiration / 1000)
    );

    response.addHeader("Set-Cookie", cookieValue);

    log.info("200 - Set authentication cookie");
  }

  @Override
  public String getTokenFromRequest(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {

        if (cookie.getName().equals("homevideosCookie")) {
          return cookie.getValue();
        }
      }
    }

    // Try getting from Cookie header
    String cookieHeader = request.getHeader("Cookie");
    if (cookieHeader != null) {
      String[] cookiesArray = cookieHeader.split(";");
      for (String cookie : cookiesArray) {
        String[] parts = cookie.trim().split("=");
        if (parts.length == 2 && parts[0].equals("homevideosCookie")) {
          return parts[1];
        }
      }
    }

    // Try getting from Authorization header as fallback
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    log.warn("401 - No token found in any location");
    return null;
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
