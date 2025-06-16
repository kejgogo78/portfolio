package com.partner.coupons.util;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.expression.ParseException;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final String SECRET_KEY = "01234567890123456789012345678901"; // 32바이트 이상 필요
    
    //토큰 생성
    public String generateToken(String username, String tokenType, String roleType) {
        try {
            long timesLimit = 0;

            if ("token".equals(tokenType)) {
                timesLimit = 1000L * 60 * 60 * 24 * 10; // 10일
            } else if ("refreshToken".equals(tokenType)) {
                timesLimit = 1000L * 60 * 60 * 24 * 30; // 30일
            }

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(username)
                    .claim("roleType",roleType)
                    .issueTime(new Date())
                    .expirationTime(new Date(new Date().getTime() + timesLimit))
                    .build();

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
            SignedJWT signedJWT = new SignedJWT(header, claimsSet);
            signedJWT.sign(new MACSigner(secretKey));

            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("JWT 생성 중 오류", e);
        }
    }

    // username 추출 (유효여부도 확인)
    public String validateAndExtractUsername(String token) throws Exception {
        try {
            //System.out.println("token = " + token);
            //전달받은 토큰 문자열을 SignedJWT 객체로 파싱 (Nimbus 라이브러리 사용)
            SignedJWT signedJWT = SignedJWT.parse(token);

            //서명(Signature)이 유효한지 검증
            //secretKey로 서명 검증을 수행 → true면 위변조 아님
            boolean isValid = signedJWT.verify(new MACVerifier(secretKey));
            //System.out.println("서명(Signature)이 유효한지 검증 isValid = " + isValid);

            //토큰 만료 여부 확인
            //exp 시간이 현재보다 이전이면 만료 → isExpired = true(만료됨)
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            boolean isExpired = expirationTime.before(new Date());

            //System.out.println("expirationTime = " + expirationTime);
            //System.out.println("new Date() = " + new Date());
            //System.out.println("토큰 만료 여부 확인 isExpired = " + isExpired);

            //서명도 유효하고, 만료도 안 됐다면 → subject(=username, 사용자ID)를 반환
            if (isValid && !isExpired) {
                return signedJWT.getJWTClaimsSet().getSubject(); // username 반환
            }else if (isExpired){
                throw new TokenExpiredException("토큰이 만료되었습니다.");
            }else{
                throw new RuntimeException("유효하지 않는 토큰입니다.");
            }

        } catch (ParseException | JOSEException e) {
            throw new RuntimeException("토큰 파싱 실패: " + e.getMessage(), e);
        }
    }

    // roleType 추출
    public String getRoleType(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();
            Object roleTypeClaim = claimsSet.getClaim("roleType");
            if (roleTypeClaim != null) {
                return roleTypeClaim.toString(); // toString() 메서드 활용
            }
        } catch (Exception e) {
            System.err.println("JWT 파싱 실패: " + e.getMessage());
        }
        return null;
    }
}