package com.smarthire.auth;

import com.smarthire.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final AppProperties properties;

    public String generate(UserDetails userDetails) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(properties.jwt().expirationMinutes() * 60);
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey())
                .compact();
    }

    public String username(String token) {
        return claims(token).getSubject();
    }

    public boolean valid(String token, UserDetails userDetails) {
        return userDetails.getUsername().equals(username(token)) && claims(token).getExpiration().after(new Date());
    }

    private Claims claims(String token) {
        return Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey signingKey() {
        String secret = properties.jwt().secret();
        byte[] key = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(key);
    }
}
