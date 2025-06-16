package com.partner.coupons.dto;

import com.partner.coupons.entity.Partner;

public record AuthAdminResponse(String token, String refreshToken, String adminId) {}