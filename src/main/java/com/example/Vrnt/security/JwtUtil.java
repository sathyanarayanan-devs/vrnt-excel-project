package com.example.Vrnt.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Minimum 32 characters required for HMAC-SHA256
    // ✅ Using StandardCharsets.UTF_8 fixes Windows issue
    private static final String SECRET =
            "vrnt_secret_key_2025_abcdefghijklmnopqrstuvwxyz";

    private static final long EXPIRY_MS =
            24L * 60 * 60 * 1000;

    // ── SIGNING KEY ───────────────────────────────────────
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)); // ✅ fixed
    }

    // ── GENERATE TOKEN ────────────────────────────────────
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(
                        System.currentTimeMillis() + EXPIRY_MS))
                .signWith(getSigningKey())
                .compact();
    }

    // ── EXTRACT USERNAME ──────────────────────────────────
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ── EXTRACT ROLE ──────────────────────────────────────
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // ── VALIDATE TOKEN ────────────────────────────────────
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ── HELPER ────────────────────────────────────────────
    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
