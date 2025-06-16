package com.partner.coupons.util;

public class JWTVerificationException extends RuntimeException {
    public JWTVerificationException(String message) {
        super(message);
    }
}