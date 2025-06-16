package com.partner.coupons.controller;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Coupon;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.repository.PartnerRepository;
import com.partner.coupons.service.CouponQRCodeService;
import com.partner.coupons.service.CouponService;
import com.partner.coupons.service.PartnerService;
import com.partner.coupons.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
public class PartnerController {

    private final ModelMapper modelMapper;
    private final PartnerService partnerService;
    private final CouponService couponService;
    private final CouponQRCodeService couponQRCodeService;
    private final PartnerRepository partnerRepository;

    //쿠폰목록
    @GetMapping("/coupons")
    public Mono<ResponseEntity<Object>> partnerCouponlist(SearchCouponRequest searchRequest) {

        return SecurityUtil.getCurrentPartnerId().flatMap(  partnerId -> {
            searchRequest.setPartnerId(partnerId); // 토큰에서 인증된 사용자 ID 정보를 가지고 간다.
                                                   // (파트너일경우:아이디,관리자일경우 공백)
            return couponService.list(searchRequest)
                    .doOnNext(page -> System.out.println("select 데이타 = " + page.getContent()))
                    .map(page -> ResponseEntity.ok((Object) Map.of(
                            "total", page.getTotalElements(),
                            "coupons", page.getContent()
                    )));
        })
        .onErrorResume(e -> Mono.just(
            ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
        ));
    }

    //쿠폰리스트(엑셀용)
    @GetMapping("/couponsExcel")
    public Mono<ResponseEntity<Object>> partnerCouponlistExel(SearchCouponRequest searchCouponRequest) {
        return SecurityUtil.getCurrentPartnerId().flatMap(  partnerId -> {
            searchCouponRequest.setPartnerId(partnerId); // 토큰에서 인증된 사용자 ID 정보를 가지고 간다.
            // (파트너일경우:아이디,관리자일경우 공백)
            return couponService.listExcel(searchCouponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                    ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
            })
            .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
            ));
    }

    //쿠폰 생성
    @PostMapping("/coupon")
    public Mono<ResponseEntity<Object>> partnerCouponCreate(@RequestBody CouponRequest couponRequest) {

        return SecurityUtil.getCurrentPartnerId().flatMap(  partnerId -> {
            couponRequest.setPartnerId(partnerId); // 토큰에서 인증된 사용자 ID 정보를 가지고 간다.
                                                   // (파트너일경우:아이디,관리자일경우 공백)
            return couponService.couponCreate(couponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
        })
        .onErrorResume(e -> Mono.just(
            ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
        ));
    }

    //쿠폰 수정
    @PatchMapping("/coupon")
    public Mono<ResponseEntity<Object>> partnerCouponModify(@RequestBody CouponRequest couponRequest) {
        System.out.println("couponRequest = " + couponRequest);
        return couponService.couponModify(couponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰 삭제
    @DeleteMapping("/coupon/{couponId}")
    public Mono<ResponseEntity<Object>> partnerCouponDelete(@PathVariable Long couponId) {
        System.out.println("couponId = " + couponId);
        return couponService.deleteCoupon(couponId)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰들 삭제
    @DeleteMapping("/coupons/{couponIds}")
    public Mono<ResponseEntity<Object>> partnerCouponsDelete(@PathVariable String couponIds) {
        //System.out.println("couponIds = " + couponIds);
        return couponService.deleteCoupons(couponIds)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰 상세정보
    @GetMapping("/coupon/{couponId}")
    public Mono<ResponseEntity<Object>> partnerCouponDetail(@PathVariable Long couponId) {
        return couponService.view(couponId)
                .doOnNext(result -> System.out.println("select 데이타 = " + result))
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }


    //사업자 상세정보
    @GetMapping("/{partnerId}")
    public Mono<ResponseEntity<Object>> partnerDetail(@PathVariable String partnerId) {
        return partnerService.view(partnerId)
                .doOnNext(result -> System.out.println("select 데이타 = " + result))
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }
    //사업자 수정
    @PatchMapping("")
    public Mono<ResponseEntity<Object>> partnerModify(@RequestBody PartnerRequest partnerRequest) {

        System.err.println("사업자 수정 페이지 partnerRequest = " + partnerRequest);

        return partnerService.partnerModify(partnerRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 탈퇴(deleteDate 설정하고 is_state 값 N으로 변경 ****** 1달후 탈퇴처리하는 프로세스 (스케줄러에 있음)
    @DeleteMapping("")
    public Mono<ResponseEntity<Object>> partnerDelete() {

        return SecurityUtil.getCurrentPartnerId().flatMap(  partnerId -> {
                    return partnerService.deleteRequestPartner(partnerId)
                          .map(result -> ResponseEntity.ok().body((Object) result));
                })
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //QR코드 사용처리
    @GetMapping("/qrcodeUsed")
    public Mono<ResponseEntity<Object>> qrcodeUsed(@RequestParam("id") String qrcode) {

        System.err.println("QR코드 사용처리 시작 -- QR Code = " + qrcode);

        return couponQRCodeService.couponQRCodeUsed(qrcode)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> {
                    System.err.println("error = " + e.getMessage());
                    return Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                    );
                });
    }


}

