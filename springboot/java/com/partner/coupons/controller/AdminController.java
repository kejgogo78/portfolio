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

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ModelMapper modelMapper;
    private final PartnerService partnerService;
    private final CouponService couponService;
    private final PartnerRepository partnerRepository;
    private final CouponQRCodeService couponQRCodeService;


    //쿠폰리스트 /api/admin/coupon/list
    @GetMapping("/coupons")
    public Mono<ResponseEntity<Object>> adminCouponlist(SearchCouponRequest searchCouponRequest) {

        return couponService.list(searchCouponRequest)
                .doOnNext(page -> System.out.println("select 데이타 = " + page.getContent()))
                .map(page -> ResponseEntity.ok((Object)Map.of(
                        "total", page.getTotalElements(),
                        "coupons", page.getContent()
                )))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }
    //쿠폰리스트(엑셀용) /api/admin/coupon/list
    @GetMapping("/couponsExcel")
    public Mono<ResponseEntity<Object>> adminCouponlistExel(SearchCouponRequest searchCouponRequest) {
        return couponService.listExcel(searchCouponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰 생성
    @PostMapping("/coupon")
    public Mono<ResponseEntity<Object>> adminCouponCreate(@RequestBody CouponRequest couponRequest) {
        System.out.println("couponRequest = " + couponRequest);
        return couponService.couponCreate(couponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }
    //쿠폰 수정
    @PatchMapping("/coupon")
    public Mono<ResponseEntity<Object>> adminCouponModify(@RequestBody CouponRequest couponRequest) {
        System.out.println("couponRequest = " + couponRequest);
        return couponService.couponModify(couponRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰 삭제
    @DeleteMapping("/coupon/{couponId}")
    public Mono<ResponseEntity<Object>> adminCouponDelete(@PathVariable Long couponId) {
        System.out.println("couponId = " + couponId);
        return couponService.deleteCoupon(couponId)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰들 삭제
    @DeleteMapping("/coupons/{couponIds}")
    public Mono<ResponseEntity<Object>> adminCouponsDelete(@PathVariable String couponIds) {
        //System.out.println("couponIds = " + couponIds);
        return couponService.deleteCoupons(couponIds)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //쿠폰 상세정보
    @GetMapping("/coupon/{couponId}")
    public Mono<ResponseEntity<Object>> adminCouponDetail(@PathVariable Long couponId) {
        return couponService.view(couponId)
                .doOnNext(result -> System.out.println("select 데이타 = " + result))
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }


    //사업자 목록
    @GetMapping("/partnerIds")
    public Mono<ResponseEntity<Object>> adminPartnerIds() {
        return partnerService.partnerIds()
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 검색 목록
    @GetMapping("/partners")
    public Mono<ResponseEntity<Object>> adminPartnerlist(SearchListRequest request) {
        return partnerService.list(request)
                .doOnNext(page -> System.out.println("select 데이타 = " + page.getContent()))
                .map(page -> ResponseEntity.ok((Object)Map.of(
                        "total", page.getTotalElements(),
                        "partners", page.getContent()
                )))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 검색 목록(엑셀용)
    @GetMapping("/partnersExcel")
    public Mono<ResponseEntity<Object>> adminPartnerlistExel(SearchListRequest request) {
        return partnerService.listExcel(request)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 생성
    @PostMapping("/partner")
    public Mono<ResponseEntity<Object>> adminPartnerCreate(@RequestBody PartnerRequest partnerRequest) {
        System.out.println("couponRequest = " + partnerRequest);
        return partnerService.partnerCreate(partnerRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 수정
    @PatchMapping("/partner")
    public Mono<ResponseEntity<Object>> adminPartnerModify(@RequestBody PartnerRequest partnerRequest) {

        System.err.println("사업자 수정 페이지 partnerRequest = " + partnerRequest);

        return partnerService.partnerModify(partnerRequest)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 탈퇴(deleteDate 설정하고 is_state 값 N으로 변경 ****** 1달후 탈퇴처리하는 프로세스 (스케줄러에 있음)
    @DeleteMapping("/partner/{partnerId}")
    public Mono<ResponseEntity<Object>> adminPartnerDelete(@PathVariable String partnerId) {
        System.out.println("partnerId = " + partnerId);
        return partnerService.deleteRequestPartner(partnerId)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자들 탈퇴
    @DeleteMapping("/partners/{partnerIds}")
    public Mono<ResponseEntity<Object>> adminPartnersDelete(@PathVariable String partnerIds) {
        System.out.println("partnerIds = " + partnerIds);
        return partnerService.deleteRequestPartners(partnerIds)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //사업자 상세정보
    @GetMapping("/partner/{partnerId}")
    public Mono<ResponseEntity<Object>> adminPartnerDetail(@PathVariable String partnerId) {
        return partnerService.view(partnerId)
                .doOnNext(result -> System.out.println("select 데이타 = " + result))
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //발급된 (큐알코드)쿠폰목록
    @GetMapping("/qrcodes")
    public Mono<ResponseEntity<Object>> adminCouponQRCodelist(SearchCouponQRCodeRequest request) {

        System.err.println("큐알코드 목록 시작");
        return couponQRCodeService.list(request)
                .doOnNext(page -> System.out.println("CouponQRCode select 데이타 = " + page.getContent()))
                .map(page -> ResponseEntity.ok((Object)Map.of(
                        "total", page.getTotalElements(),
                        "couponQRCodes", page.getContent()
                )))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

    //발급된 (큐알코드)쿠폰목록 (엑셀용)
    @GetMapping("/qrcodesExcel")
    public Mono<ResponseEntity<Object>> adminCouponQRCodelistExel(SearchCouponQRCodeRequest request) {
        return couponQRCodeService.listExcel(request)
                .map(result -> ResponseEntity.ok().body((Object) result))
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))
                ));
    }

}

