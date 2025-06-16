package com.partner.coupons.service;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.*;
import com.partner.coupons.repository.*;
import com.partner.coupons.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponQRCodeService {

    private final PartnerRepository partnerRepository;
    private final CouponRepository couponRepository;
    private final CouponRepositoryCustom couponRepositoryCustom;
    private final CouponQRCodeRepositoryCustom couponQRCodeRepositoryCustom;
    private final PartnerRepositoryCustom partnerRepositoryCustom;

    private final ModelMapper modelMapper;

    //qr코드 생성
    public Mono<CouponQRCode> couponQRCodeCreate(CouponQRCodeRequest request) {

        return Mono.fromCallable(() -> {
            //1. request.getUserId(); : 아이디가 공백인지 확인
            //2. request.getCouponId(); : 쿠폰아이디가 발급기간 시작일을 지났는지 확인후 쿠폰정보 반환하기(질문: 발급기간내에 큐알코드를 받는지 로직 확인)
            //3. request.getQrcodeId(); : 위에 조건이 합당하면 qrcode 생성
            //4. request.getProductName(); //상품명

            //1. 사용자아이디가 있느지 확인 (아이디가 공백인지 확인)
            if (request.getUserId().isEmpty()) {
                throw new IllegalArgumentException("아이디가 없습니다.");
            }

            //2. request.getCouponId() //쿠폰아이디가 발급기간중이고 쿠폰사용가능(USABLE)한지 확인후 쿠폰정보 반환하기
            Coupon existsCoupon = couponRepositoryCustom
                    .findByIssueDateIsUsableCouponId(request.getCouponId())
                    .orElseThrow(() -> new IllegalArgumentException("사용할 수 없는 쿠폰입니다."));

            //3. 큐알코드 아이디 생성
            request.setQrcodeId(UUID.randomUUID().toString());

            //4. qr코드 생성 DB 처리
            return couponQRCodeRepositoryCustom.insertCouponQRCode(request, existsCoupon);

        });
    }
    
    //qr코드 사용처리
    public Mono<String> couponQRCodeUsed(String qrcode) {
        return SecurityUtil.getCurrentPartnerId()
            .flatMap(partnerId -> {
                // 1. 사업자가 가지고 있는 쿠폰인지 확인
                Long result1 = couponQRCodeRepositoryCustom.checkPartnerCoupon(qrcode, partnerId);
                if (result1 == 0) throw new IllegalArgumentException("자사의 쿠폰이 아닙니다.");
                // 2. qrcode 사용가능 여부 체크 하기
                Long result2 = couponQRCodeRepositoryCustom.checkCouponIsAvailable(qrcode);
                if (result2 == 0) throw new IllegalArgumentException("쿠폰 사용기간이 아닙니다.");
                // 3. qrcode 이미 사용했는지 확인하기
                Long result3 = couponQRCodeRepositoryCustom.checkCouponCanUse(qrcode);
                if (result3 > 0) throw new IllegalArgumentException("이미 사용한 쿠폰입니다.");
                // 4. qrcode 사용처리
                couponQRCodeRepositoryCustom.updateCouponQRCode(qrcode);
                return Mono.just("OK");
            });
    }



    //searchRequest : String name, String startDate, String endDate, String sort, int page, int pageSize
    //발급된 쿠폰 검색 목록
    public Mono<Page<CouponQRCodeResponse>> list(SearchCouponQRCodeRequest request) {

        System.err.println("큐알코드 목록 서비스 시작");

        return Mono.fromCallable(() -> {
            System.out.println("request = " + request);
            Sort sorting = Sort.by(Sort.Direction.DESC, "createdAt");
            Pageable pageable = PageRequest.of(request.getPage()-1, request.getPageSize(), sorting);

            return couponQRCodeRepositoryCustom.searchCouponQRCodes(request, pageable);
        });
    }

    //발급된 쿠폰 엑셀용 목록
    public Mono<List<CouponQRCodeResponse>> listExcel(SearchCouponQRCodeRequest request) {
        return Mono.fromCallable(() -> {
            return couponQRCodeRepositoryCustom.searchCouponQRCodesForExcel(request);
        });
    }
}