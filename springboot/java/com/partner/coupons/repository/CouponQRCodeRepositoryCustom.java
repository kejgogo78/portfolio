package com.partner.coupons.repository;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.partner.coupons.entity.QCouponQRCode.couponQRCode;
import static com.partner.coupons.entity.QPartner.partner;

//Querydsl로 복잡한 조건 검색 처리
@Repository
@RequiredArgsConstructor
public class CouponQRCodeRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager em; // EntityManager 주입 받아서 직접 persist
    private final String today = LocalDate.now().toString(); // 오늘 날짜

    //조건 빌더
    private BooleanBuilder buildSearchCondition(SearchCouponQRCodeRequest request) {
        BooleanBuilder builder = new BooleanBuilder();
        //String today = LocalDate.now().toString(); // 오늘 날짜

        if (request.getSearchText() != null && !request.getSearchText().isEmpty()
                && request.getSearchType() != null && !request.getSearchType().isEmpty()) {
            String text = request.getSearchText();

            switch (request.getSearchType()) {
                case "all": //아이디,쿠폰명,회사명
                    builder.or(couponQRCode.couponName.containsIgnoreCase(text)); //쿠폰명
                    builder.or(couponQRCode.partnerName.containsIgnoreCase(text)); //상호명
                    builder.or(couponQRCode.userId.containsIgnoreCase(text)); //사용자아이디
                    break;
                case "name": //회사명
                    builder.and(couponQRCode.partnerName.containsIgnoreCase(text)); //상호명
                    break;
                case "coupon": //쿠폰명
                    builder.and(couponQRCode.couponName.containsIgnoreCase(text)); //쿠폰명
                    break;
                case "id": //아이디
                    builder.and(couponQRCode.userId.containsIgnoreCase(text)); //사용자아이디
                    break;
            }
        }
        //사용여부(select:미사용,사용,기간만료<미사용일경우 기간이 지났을때>
        //loe(today) 오늘 이전 또는 오늘까지 유효
        //lt(today)	완전히 기간이 지남
        //goe(today) 오늘 또는 미래에 사용 가능
        //eq(today)	딱 오늘이 사용 종료일
        if (request.getIsState() != null && !request.getIsState().isEmpty()) {
            switch (request.getIsState()) {
                case "N": //미사용
                    builder.and(couponQRCode.isUsed.eq(StateYN.N)); //아직 사용안함
                    builder.and(couponQRCode.usageEndDate.goe(today)); //오늘 또는 미래에 사용 가능
                    break;
                case "Y": //사용
                    builder.and(couponQRCode.isUsed.eq(StateYN.Y)); //사용함
                    break;
                case "E": //기간만료
                    builder.and(couponQRCode.isUsed.eq(StateYN.N));  //사용하지 않음
                    builder.and(couponQRCode.usageEndDate.lt(today)); //기간이 지남
                    break;
            }
        }
        return builder;
    }

    //공통 Select 쿼리 생성 함수
    private JPAQuery<CouponQRCodeResponse> buildCouponQRCodeQuery(BooleanBuilder builder) {
        //String today = LocalDate.now().toString(); // 오늘 날짜

        return queryFactory
                .select(Projections.constructor(CouponQRCodeResponse.class,
                        couponQRCode.id,        //고유값
                        couponQRCode.qrcodeId,  //큐알코드
                        couponQRCode.couponId,  //쿠폰아이디
                        couponQRCode.couponName, //쿠폰이름
                        couponQRCode.partnerId, //파트너아이디
                        couponQRCode.partnerName, //상호명
                        couponQRCode.userId, //사용자아이디
                        couponQRCode.productName, //상품명(연동안해도됨)
                        couponQRCode.discountRate, //할인율
                        couponQRCode.usageStartDate, //쿠폰 사용 가능 시작일
                        couponQRCode.usageEndDate, //쿠폰 사용 가능 마지막일
                        couponQRCode.createdAt,
                        couponQRCode.isUsed,   //couponQRCode.isUsable.stringValue(), // Enum -> String 변환
                        couponQRCode.usedAt,

                        // ★ 조건부 isState 계산
                        new CaseBuilder()
                                .when(couponQRCode.isUsed.eq(StateYN.Y))
                                .then("Y") //사용함
                                .when(couponQRCode.usageEndDate.lt(today)
                                        .and(couponQRCode.isUsed.eq(StateYN.N))) //사용기간이 지나고 사용안했을때
                                .then("E")
                                .otherwise("N")//그외(사용안함-기간이 남아 있는경우

                ))
                .from(couponQRCode)
                .where(builder);
    }
    //페이징 목록
    public Page<CouponQRCodeResponse> searchCouponQRCodes(SearchCouponQRCodeRequest request, Pageable pageable) {
       BooleanBuilder builder = buildSearchCondition(request);
        List<CouponQRCodeResponse> content = buildCouponQRCodeQuery(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(couponQRCode.createdAt.desc()) // 발급일자(생성일)
                .fetch();

        //System.err.println("content : "+ content);
        long total = queryFactory
                .select(couponQRCode.count())
                .from(couponQRCode)
                .where(builder)
                .fetchOne();
        return new PageImpl<>(content, pageable, total);
    }

    //엑셀용 목록
    public List<CouponQRCodeResponse> searchCouponQRCodesForExcel(SearchCouponQRCodeRequest request) {
        BooleanBuilder builder = buildSearchCondition(request);

        return buildCouponQRCodeQuery(builder)
                .orderBy(couponQRCode.createdAt.desc())
                .fetch();
    }


    // 쿠폰 QRCode 생성
    @Transactional
    public CouponQRCode insertCouponQRCode(CouponQRCodeRequest request, Coupon coupon) {

        //큐알코드 entity
        CouponQRCode couponQRCodeEntity = new CouponQRCode();
        couponQRCodeEntity.setQrcodeId(request.getQrcodeId());
        couponQRCodeEntity.setCouponId(request.getCouponId());
        couponQRCodeEntity.setCouponName(coupon.getCouponName());
        couponQRCodeEntity.setPartnerId(coupon.getPartner().getPartnerId());
        couponQRCodeEntity.setPartnerName(coupon.getPartner().getPartnerName());
        couponQRCodeEntity.setUserId(request.getUserId());
        couponQRCodeEntity.setProductName(request.getProductName());
        couponQRCodeEntity.setDiscountRate(coupon.getDiscountRate());
        couponQRCodeEntity.setUsageStartDate(coupon.getUsageStartDate());
        couponQRCodeEntity.setUsageEndDate(coupon.getUsageEndDate());

        // 쿠폰 QRCode 저장 insert
        em.persist(couponQRCodeEntity);

        return couponQRCodeEntity; //CouponQRCode을 반환함
    }



    // qr코드 사용처리 - 1. 사업자가 가지고 있는 쿠폰인지 확인
    public Long checkPartnerCoupon(String qrcode, String partnerId) {
        Long result = queryFactory
                .select(couponQRCode.count())
                .from(couponQRCode)
                .where(
                    couponQRCode.partnerId.eq(partnerId),
                    couponQRCode.qrcodeId.eq(qrcode)
                ).fetchOne();
        return result;
    }


    // qr코드 사용처리 - 2. qrcode 사용가능 여부 체크 하기
    public Long checkCouponIsAvailable(String qrcode) {
        //String today = LocalDate.now().toString(); // 오늘 날짜

        Long result = queryFactory
                .select(couponQRCode.count())
                .from(couponQRCode)
                .where(
                        couponQRCode.usageStartDate.loe(today), //오늘 이전 또는 오늘까지 유효
                        couponQRCode.usageEndDate.goe(today), //오늘 또는 미래에 사용 가능
                        couponQRCode.qrcodeId.eq(qrcode)
                ).fetchOne();
        return result;
    }

    // qr코드 사용처리 - 3. qrcode 이미 사용했는지 확인하기
    public Long checkCouponCanUse(String qrcode) {
        Long result = queryFactory
                .select(couponQRCode.count())
                .from(couponQRCode)
                .where(
                        couponQRCode.qrcodeId.eq(qrcode),
                        couponQRCode.isUsed.eq(StateYN.Y)
                ).fetchOne();
        return result;
    }

    // qr코드 사용처리 - 4. qrcode 사용처리
    @Transactional
    public long updateCouponQRCode(String qrcode) {

        return queryFactory
                .update(couponQRCode)
                .set(couponQRCode.isUsed, StateYN.Y) //사용여부
                .set(couponQRCode.usedAt, LocalDateTime.now()) //사용일
                .where(couponQRCode.qrcodeId.eq(qrcode))
                .execute();
    }

}
