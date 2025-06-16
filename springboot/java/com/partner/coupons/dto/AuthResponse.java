package com.partner.coupons.dto;

import com.partner.coupons.entity.Partner;

public record AuthResponse(String token, String refreshToken, Partner partner) {}