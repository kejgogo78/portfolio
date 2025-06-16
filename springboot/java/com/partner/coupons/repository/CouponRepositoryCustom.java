package com.partner.coupons.repository;

import com.partner.coupons.dto.CouponListResponse;
import com.partner.coupons.dto.CouponResponse;
import com.partner.coupons.dto.SearchCouponRequest;
import com.partner.coupons.entity.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.partner.coupons.entity.QCoupon.coupon;
import static com.partner.coupons.entity.QPartner.partner;
import static com.partner.coupons.entity.QCouponProduct.couponProduct;
import static com.partner.coupons.entity.QCouponQRCode.couponQRCode;

//Querydsl로 복잡한 조건 검색 처리
@Repository
@RequiredArgsConstructor
public class CouponRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager em; // EntityManager 주입 받아서 직접 persist

    //조건 빌더
    private BooleanBuilder buildSearchCondition(SearchCouponRequest searchRequest) {
        String today = LocalDate.now().toString(); // 오늘 날짜
        BooleanBuilder builder = new BooleanBuilder();

        if (searchRequest.getSearchText() != null && !searchRequest.getSearchText().isEmpty()
                && searchRequest.getSearchType() != null && !searchRequest.getSearchType().isEmpty()) {
            String text = searchRequest.getSearchText();

            switch (searchRequest.getSearchType()) {
                //전체
                case "all":
                    builder.and(
                            coupon.couponName.containsIgnoreCase(text) //쿠폰명
                            .or(coupon.partner.partnerName.containsIgnoreCase(text)) //상호명
                    );
                    break;
                case "name":
                    builder.and(coupon.partner.partnerName.containsIgnoreCase(text)); //상호명
                    break;
                case "coupon":
                    builder.or(coupon.couponName.containsIgnoreCase(text)); //쿠폰명
                    break;
            }
        }
        //날짜 검색
        if (searchRequest.getStartDate() != null && !searchRequest.getStartDate().isEmpty()) {
            builder.and(coupon.usageEndDate.goe(searchRequest.getStartDate())); //>=
        }
        //날짜 검색
        if (searchRequest.getEndDate() != null && !searchRequest.getEndDate().isEmpty()) {
            builder.and(coupon.usageStartDate.loe(searchRequest.getEndDate())); //<=
        }
        //사업자관리에서 조회할때(해당 사업자만 검색)
        if (searchRequest.getPartnerId() != null && !searchRequest.getPartnerId().isEmpty()) {
            builder.and(coupon.partner.partnerId.eq(searchRequest.getPartnerId()));
        }
        //이벤트 진행상태검색
        //진행중
        if (searchRequest.getIsState().equals("ING")) {
            builder.and(
                coupon.usageStartDate.loe(today)
                    .and(coupon.usageEndDate.goe(today))
            );
        //기간만료
        }else if (searchRequest.getIsState().equals("END")) {
            builder.and(coupon.usageEndDate.lt(today)); //coupon.usage_end_date < 오늘날짜
        //대기중
        }else if (searchRequest.getIsState().equals("WAITING")) {
            builder.and( coupon.usageStartDate.gt(today)); //coupon.usage_start_date > 오늘날짜
        }

        return builder;
    }

    //공통 Select 쿼리 생성 함수
    private JPAQuery<CouponListResponse> buildCouponQuery(BooleanBuilder builder) {
        String today = LocalDate.now().toString(); // 오늘 날짜
        return queryFactory
                .select(Projections.constructor(CouponListResponse.class,
                        coupon.id,
                        coupon.couponName,
                        coupon.partner.partnerId,
                        coupon.partner.partnerName, //partnerName
                        coupon.discountRate,
                        coupon.templateType,
                        coupon.usageStartDate,
                        coupon.usageEndDate,
                        coupon.issueStartDate,
                        coupon.issueEndDate,
                        coupon.isUsable.stringValue(), // Enum -> String 변환
                        coupon.isIssue.stringValue(),  // Enum -> String 변환
                        coupon.issueDate,
                        coupon.createdAt,
                        coupon.updatedAt,
                        JPAExpressions
                                .select(couponQRCode.id.count())
                                .from(couponQRCode)
                                .where(couponQRCode.couponId.eq(coupon.id)), //다운로드수
                        JPAExpressions
                                .select(couponQRCode.id.count())
                                .from(couponQRCode)
                                .where(couponQRCode.couponId.eq(coupon.id).and(couponQRCode.isUsed.eq(StateYN.Y))),// 사용수

                        // 상태 (진행중/기간만료) - 조건부 로직
                        Expressions.cases()
                                .when(coupon.usageStartDate.loe(today) // 사용 시작일이 오늘보다 같거나 이전이고
                                        .and(coupon.usageEndDate.goe(today)) // 사용 종료일이 오늘보다 같거나 이후이면 (기간 내에 있으면)
                                )
                                .then("ING") // 참이면 "진행중"
                                .when(coupon.usageEndDate.lt(today))
                                .then("END") // 참이면 "기간만료"
                                .when(coupon.usageStartDate.gt(today))
                                .then("WAITING") // 참이면 "대기중"
                                .otherwise("END") // 거짓이면 "기간만료"
                                .as("isState") // DTO 필드명과 매칭되도록 alias 설정 (optional, but good practice)
                ))
                .from(coupon)
                .leftJoin(coupon.partner, partner)
                .where(builder);
    }
    //페이징 목록
    public Page<CouponListResponse> searchCoupons(SearchCouponRequest searchRequest, Pageable pageable) {
        BooleanBuilder builder = buildSearchCondition(searchRequest);
        List<CouponListResponse> content = buildCouponQuery(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(coupon.createdAt.desc()) // 필요 시 pageable 정렬 적용
                .fetch();
        long total = queryFactory
                .select(coupon.count())
                .from(coupon)
                .where(builder)
                .fetchOne();
        return new PageImpl<>(content, pageable, total);
    }

    //엑셀용 목록
    public List<CouponListResponse> searchCouponsForExcel(SearchCouponRequest searchRequest) {
        BooleanBuilder builder = buildSearchCondition(searchRequest);

        return buildCouponQuery(builder)
                .orderBy(coupon.createdAt.desc())
                .fetch();
    }

    // 쿠폰 상세조회
    public CouponResponse CouponDetail(Long id) {

        CouponResponse couponDetail = queryFactory
                .select(Projections.fields(CouponResponse.class, //필요한 필드만 선택해서 매핑시캄 (as 이름명)
                //.select(Projections.constructor(CouponResponse.class, => 필드가 완전히 일치해야함
                        coupon.id.as("couponId"), //couponId
                        coupon.couponName,              //couponName 이름 일치됨 as 안써도됨
                        coupon.partner.partnerId,
                        coupon.partner.partnerName,
                        coupon.discountRate,
                        coupon.templateType,
                        coupon.usageStartDate,
                        coupon.usageEndDate,
                        coupon.issueStartDate,
                        coupon.issueEndDate,
                        coupon.benefitDescription,
                        coupon.isUsable.stringValue().as("isUsable"),
                        coupon.isIssue.stringValue().as("isIssue"),
                        coupon.issueDate,
                        coupon.createdAt,
                        coupon.updatedAt
                ))
                .from(coupon)
                .leftJoin(coupon.partner, partner)
                .where(coupon.id.eq(id))
                .fetchOne();

        // 상품 리스트 조회
        List<String> productNames = queryFactory
                .select(couponProduct.productName)
                .from(couponProduct)
                .where(couponProduct.coupon.id.eq(id))
                .fetch();

        if (couponDetail != null) {
            couponDetail.setProductNames(productNames);
        }

        return couponDetail;
    }



    // 쿠폰 삭제 (쿠폰 및 관련 상품 삭제)
    @Transactional
    public void deleteCoupon(Long couponId) {
        // 1. 먼저 CouponProduct 삭제
        queryFactory.delete(QCouponProduct.couponProduct)
                .where(QCouponProduct.couponProduct.coupon.id.eq(couponId))
                .execute();

        // 2. 그 다음 Coupon 삭제
        queryFactory.delete(coupon)
                .where(coupon.id.eq(couponId))
                .execute();
    }

    // 쿠폰 삭제 (쿠폰 및 관련 상품 삭제)
    @Transactional
    public void deleteCoupons(String couponIds) {

        // 쉼표로 구분된 문자열을 Long 리스트로 변환
        List<Long> couponIdList = Arrays.stream(couponIds.split(","))
                .map(String::trim)
                .map(Long::parseLong)
                .collect(Collectors.toList());

        // 1. CouponProduct 먼저 삭제
        queryFactory.delete(QCouponProduct.couponProduct)
                .where(QCouponProduct.couponProduct.coupon.id.in(couponIdList))
                .execute();

        // 2. 그 다음 Coupon 삭제
        queryFactory.delete(coupon)
                .where(coupon.id.in(couponIdList))
                .execute();
    }

    
    // 쿠폰 + 상품 다건 등록
    @Transactional
    public Coupon insertCouponWithProducts(Coupon couponEntity, List<String> productNames) {
        // 쿠폰 저장 insert
        em.persist(couponEntity);

        // 상품 목록 저장
        List<CouponProduct> products = new ArrayList<>();
        for (String productName : productNames) {
            CouponProduct product = new CouponProduct();
            product.setCoupon(couponEntity);
            product.setProductName(productName);
            em.persist(product); //insert

            products.add(product); //상품배열에 추가
        }

        // 쿠폰 엔터티에 새로운 상품 리스트 반영
        couponEntity.setCouponProducts(products);

        return couponEntity; //Coupon을 반환함
    }

    // 쿠폰 + 상품 전체 수정 (상품은 모두 삭제 후 다시 등록)
    @Transactional
    public long updateCouponWithProducts(Coupon couponEntity, List<String> productNames) {

        System.out.println("couponEntity = " + couponEntity + ", productNames = " + productNames);

        // 1. 기존 쿠폰 상품 모두 삭제
        Query deleteQuery = em.createQuery("DELETE FROM CouponProduct cp WHERE cp.coupon.id = :couponId");
        deleteQuery.setParameter("couponId", couponEntity.getId());
        int deletedCount = deleteQuery.executeUpdate();

        // 2. 쿠폰 정보 수정
        em.merge(couponEntity);

        // 3. 새로운 상품 목록 등록
        List<CouponProduct> newProducts = new ArrayList<>();
        for (String productName : productNames) {
            CouponProduct product = new CouponProduct();
            product.setCoupon(couponEntity);
            product.setProductName(productName);
            em.persist(product);
            newProducts.add(product);
        }

        // 4. 쿠폰 엔터티에 새로운 상품 리스트 반영
        couponEntity.setCouponProducts(newProducts);

        // 5. 최종 쿠폰 ID 반환
        return couponEntity.getId();
    }

    // 쿠폰아이디가 발급기간중인지,쿠폰사용가능한지 확인후 쿠폰정보 반환하기
    public Optional<Coupon> findByIssueDateIsUsableCouponId(Long couponId) {

        String today = LocalDate.now().toString(); // 오늘 날짜

        Coupon result = queryFactory
                .selectFrom(coupon)
                .where(
                        coupon.id.eq(couponId),
                        coupon.issueStartDate.loe(today),   // 쿠폰발급 시작일 <= 오늘
                        coupon.issueEndDate.goe(today),     // 쿠폰발급 종료일 >= 오늘
                        coupon.isUsable.eq(CouponIsUsable.USABLE) //쿠폰사용가능여부(가능일때)
                )
                .fetchOne();

        if (result == null) return Optional.empty();

        return Optional.ofNullable(result);




    }
}



//em.persist(product); //insert
//삭제
//Query deleteQuery = em.createQuery("DELETE FROM CouponProduct cp WHERE cp.coupon.id = :couponId"); //쿼리생성
//deleteQuery.setParameter("couponId", couponEntity.getId()); //파라메터
//int deletedCount = deleteQuery.executeUpdate(); //실행
//em.merge(couponEntity);// update