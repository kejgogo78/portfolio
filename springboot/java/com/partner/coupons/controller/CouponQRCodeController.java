package com.partner.coupons.controller;

import com.partner.coupons.dto.CouponQRCodeRequest;
import com.partner.coupons.dto.LoginRequest;
import com.partner.coupons.dto.SearchCouponRequest;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.service.AuthService;
import com.partner.coupons.service.CouponQRCodeService;
import com.partner.coupons.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/qrcode")
@RequiredArgsConstructor
public class CouponQRCodeController {

    private final CouponQRCodeService service;

    //쿠폰 QR코드 생성 - 프론트단에서 요청 (QR코드 정보)
    @PostMapping("")
    public Mono<ResponseEntity<Object>> signup(@RequestBody CouponQRCodeRequest request) {

        System.out.println("request = " + request);

        return service.couponQRCodeCreate(request)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> {
                    //System.err.println("에러 발생: " + e.getMessage());
                    return Mono.just(
                            ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                    );
                });
    }
}