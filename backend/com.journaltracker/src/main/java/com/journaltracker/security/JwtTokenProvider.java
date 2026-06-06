package com.journaltracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    private static final long REFRESH_GRACE_PERIOD_MS = 60 * 60 * 1000;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                secret.getBytes()
        );
    }
    public String generateToken(UserDetails userDetails) {
        Map<String,Object> claims = getClaimsUser(userDetails);
        Date now = new Date();
        Date expiryDate =
                new Date(
                        now.getTime() + jwtExpiration
                );
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), Jwts.SIG.HS512)
                .compact();
    }
    private Map<String, Object> getClaimsUser(UserDetails userDetails) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("role", userDetails.getAuthorities().stream()
                .map(Object::toString)
                .collect(Collectors.joining(",")));
        return claims;
    }
    public boolean validateToken(String token) {
        try{
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        }catch (Exception e){
            log.error("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public Optional<String> getUsernameFromRefreshableToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return Optional.ofNullable(claims.getSubject());
        } catch (ExpiredJwtException ex) {
            Date expiration = ex.getClaims().getExpiration();
            if (expiration != null && isWithinRefreshGracePeriod(expiration)) {
                return Optional.ofNullable(ex.getClaims().getSubject());
            }
            log.warn("JWT expired outside refresh grace period");
            return Optional.empty();
        } catch (Exception ex) {
            log.warn("JWT cannot be refreshed: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private boolean isWithinRefreshGracePeriod(Date expiration) {
        long expiredForMs = new Date().getTime() - expiration.getTime();
        return expiredForMs <= REFRESH_GRACE_PERIOD_MS;
    }
}
