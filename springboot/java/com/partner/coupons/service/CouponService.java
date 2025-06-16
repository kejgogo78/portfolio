package com.partner.coupons.service;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Coupon;
import com.partner.coupons.entity.CouponIsUsable;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.StateYN;
import com.partner.coupons.repository.CouponRepository;
import com.partner.coupons.repository.CouponRepositoryCustom;
import com.partner.coupons.repository.PartnerRepository;
import com.partner.coupons.repository.PartnerRepositoryCustom;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final PartnerRepository partnerRepository;
    private final CouponRepository couponRepository;
    private final CouponRepositoryCustom couponRepositoryCustom;
    private final PartnerRepositoryCustom partnerRepositoryCustom;

    private final ModelMapper modelMapper;

    //쿠폰 생성
    public Mono<String> couponCreate(CouponRequest request) {

        //insertCouponWithProducts 호출 (쿠폰+상품 같이 저장)
        return Mono.fromCallable(() -> {

            Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(request.getPartnerId());
            if (existsPartner.isEmpty()) {
                throw new IllegalArgumentException("파트너가 존재하지 않습니다.");
            }else{
                // Coupon Entity 생성
                Coupon coupon = new Coupon();
                coupon.setPartner(existsPartner.get()); //Partner 형식으로 넣음
                coupon.setCouponName(request.getCouponName());
                coupon.setDiscountRate(request.getDiscountRate());
                coupon.setTemplateType(request.getTemplateType());
                coupon.setUsageStartDate(request.getUsageStartDate());
                coupon.setUsageEndDate(request.getUsageEndDate());
                coupon.setIssueStartDate(request.getIssueStartDate());
                coupon.setIssueEndDate(request.getIssueEndDate());
                coupon.setBenefitDescription(request.getBenefitDescription());
                coupon.setIsUsable(request.getIsUsable().equals("USABLE")? CouponIsUsable.USABLE : CouponIsUsable.NOT_USABLE); //request.getIsUsable()에러남
                coupon.setIsIssue(request.getIsIssue().equals("Y")? StateYN.Y : StateYN.N);

                couponRepositoryCustom.insertCouponWithProducts(coupon, request.getProductNames());
                return "ok";
            }
        });
    }

    //쿠폰 수정
    public Mono<String> couponModify(CouponRequest request) {

        return Mono.fromCallable(() -> {
            // 1. 쿠폰 존재 여부 확인
            Coupon existingCoupon = couponRepository.findById(request.getCouponId())
                    .orElseThrow(() -> new IllegalArgumentException("쿠폰이 존재하지 않습니다."));

            // 2. 파트너 존재 여부 확인
            Optional<Partner> existsPartner = partnerRepositoryCustom.findByPartnerId(request.getPartnerId());
            if (existsPartner.isEmpty()) {
                throw new IllegalArgumentException("파트너가 존재하지 않습니다.");
            }

            // 3. Coupon Entity 생성
            Coupon coupon = new Coupon();
            coupon.setId(request.getCouponId());
            coupon.setPartner(existsPartner.get());
            coupon.setCouponName(request.getCouponName());
            coupon.setDiscountRate(request.getDiscountRate());
            coupon.setTemplateType(request.getTemplateType());
            coupon.setUsageStartDate(request.getUsageStartDate());
            coupon.setUsageEndDate(request.getUsageEndDate());
            coupon.setIssueStartDate(request.getIssueStartDate());
            coupon.setIssueEndDate(request.getIssueEndDate());
            coupon.setBenefitDescription(request.getBenefitDescription());
            coupon.setIsUsable(request.getIsUsable().equals("USABLE")? CouponIsUsable.USABLE : CouponIsUsable.NOT_USABLE); //request.getIsUsable()에러남
            coupon.setIsIssue(request.getIsIssue().equals("Y")? StateYN.Y : StateYN.N);

            // 4. 수정 실행
            couponRepositoryCustom.updateCouponWithProducts(coupon, request.getProductNames());

            return "ok";
        });
    }

    //searchRequest : String name, String startDate, String endDate, String sort, int page, int pageSize
    //쿠폰 검색 목록
    public Mono<Page<CouponListResponse>> list(SearchCouponRequest searchCouponRequest) {
        return Mono.fromCallable(() -> {
            /*
            Sort sorting = switch (searchCouponRequest.getSort()) {
                case "latest" -> Sort.by(Sort.Direction.DESC, "createdAt");
                case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
                case "name" -> Sort.by(Sort.Direction.ASC, "couponName");
                default -> Sort.by(Sort.Direction.DESC, "createdAt");
            };*/
            Sort sorting = Sort.by(Sort.Direction.DESC, "createdAt");
            Pageable pageable = PageRequest.of(searchCouponRequest.getPage()-1, searchCouponRequest.getPageSize(), sorting);

            return couponRepositoryCustom.searchCoupons(searchCouponRequest, pageable);
        });
    }

    //쿠폰 엑셀용 목록
    public Mono<List<CouponListResponse>> listExcel(SearchCouponRequest searchCouponRequest) {
        return Mono.fromCallable(() -> {
            return couponRepositoryCustom.searchCouponsForExcel(searchCouponRequest);
        });
    }

    //쿠폰 상세정보
    public Mono<CouponResponse> view(Long couponId) {
        return Mono.fromCallable(() -> {
            return couponRepositoryCustom.CouponDetail(couponId);
        });
    }
    //쿠폰 삭제
    public Mono<String> deleteCoupon(Long couponId) {
        return Mono.fromCallable(() -> {
            couponRepositoryCustom.deleteCoupon(couponId);
            return "ok";
        });
    }
    //쿠폰들 삭제
    public Mono<String> deleteCoupons(String couponIds) {
        return Mono.fromCallable(() -> {
            couponRepositoryCustom.deleteCoupons(couponIds);
            return "ok";
        });
    }
}