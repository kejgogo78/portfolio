package com.partner.coupons.util;

import java.security.SecureRandom;

public class PasswordUtil {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    private static final int DEFAULT_PASSWORD_LENGTH = 10;

    public static String generateTemporaryPassword() {
        return generateTemporaryPassword(DEFAULT_PASSWORD_LENGTH);
    }

    public static String generateTemporaryPassword(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(index));
        }

        return sb.toString();
    }
}