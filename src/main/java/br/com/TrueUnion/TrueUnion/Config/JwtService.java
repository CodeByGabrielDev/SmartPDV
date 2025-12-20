package br.com.TrueUnion.TrueUnion.Config;


import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    private static final SecretKey SECRET_KEY =
        Keys.hmacShaKeyFor(
            "MINHA_CHAVE_SUPER_SECRETA_DE_32_CARACTERES!".getBytes()
        );

    // 1️⃣ GERAR TOKEN
    public String generateToken(String email,String role) {
        return Jwts.builder()
            .setSubject(email)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(SECRET_KEY)
            .compact();
    }

    // 2️⃣ LER CLAIMS
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(SECRET_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    // 3️⃣ VALIDAR TOKEN
    public boolean isTokenValid(String token) {
        return extractClaims(token)
            .getExpiration()
            .after(new Date());
    }
}

