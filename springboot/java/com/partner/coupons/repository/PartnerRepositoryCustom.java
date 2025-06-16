package com.partner.coupons.repository;

import com.partner.coupons.dto.*;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.QCouponProduct;
import com.partner.coupons.entity.StateYN;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.partner.coupons.entity.QCoupon.coupon;
import static com.partner.coupons.entity.QCouponProduct.couponProduct;
import static com.partner.coupons.entity.QPartner.partner;

//Querydsl로 복잡한 조건 검색 처리
@Repository
@RequiredArgsConstructor
public class PartnerRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager em; // EntityManager 주입 받아서 직접 persist

    // 사업자 로그인시 아이디 조회, 상태가 Y인것만 찾기(탈퇴요청한 아이디 제외)
    public Optional<Partner> findByPartnerId(String partnerId) {
        Partner result = queryFactory
                .selectFrom(partner)
                .where(
                        partner.partnerId.eq(partnerId),
                        partner.isState.eq(StateYN.Y)
                )
                .fetchOne();
        return Optional.ofNullable(result);
    }

    // 사업자 비밀번호 분실시 이메일 조회, 상태가 Y인것만 찾기(탈퇴요청한 아이디 제외)
    public Optional<Partner> findByPartnerEmail(String email) {
        Partner result = queryFactory
                .selectFrom(partner)
                .where(
                        partner.email.eq(email),
                        partner.isState.eq(StateYN.Y)
                )
                .fetchOne();
        return Optional.ofNullable(result);
    }


    //조건 빌더
    private BooleanBuilder buildSearch2Condition(SearchListRequest request) {
        BooleanBuilder builder = new BooleanBuilder();

        if (request.getSearchText() != null && !request.getSearchText().isEmpty()
                && request.getSearchType() != null && !request.getSearchType().isEmpty()) {
            String text = request.getSearchText();

            switch (request.getSearchType()) {
                case "all": //전체
                    builder.or(partner.partnerName.containsIgnoreCase(request.getSearchText()));
                    builder.or(partner.businessRegistrationNo.containsIgnoreCase(request.getSearchText()));
                    builder.or(partner.region.containsIgnoreCase(request.getSearchText()));
                    break;
                case "name": //상호명
                    builder.and(partner.partnerName.containsIgnoreCase(request.getSearchText()));
                    break;
                case "number": //사업자번호
                    builder.and(partner.businessRegistrationNo.containsIgnoreCase(request.getSearchText()));
                    break;
                case "area": //지역
                    builder.and(partner.region.containsIgnoreCase(request.getSearchText()));
                    break;
            }
        }
        //전체 검색일때는 제외(Y일때, N일때 검색)
        if(StateYN.valueOf(request.getIsState()).equals(StateYN.Y)
                || StateYN.valueOf(request.getIsState()).equals(StateYN.N))
        {
            builder.and(partner.isState.eq(StateYN.valueOf(request.getIsState()))); //문자열을 Enum으로 변환
        }
        return builder;
    }
    //공통 Select 쿼리 생성 함수
    private JPAQuery<PartnerResponse> buildPartnerQuery(BooleanBuilder builder) {
        return queryFactory
                .select(Projections.constructor(PartnerResponse.class,
                        partner.partnerName,
                        partner.partnerId,
                        partner.partnerType,
                        partner.businessRegistrationNo,
                        partner.phone,
                        partner.email,
                        partner.businessType,
                        partner.region,
                        partner.address,
                        partner.addressDetail,
                        partner.postalCode,
                        partner.createdAt,
                        partner.updatedAt,
                        partner.deletedAt
                ))
                .from(partner)
                .where(builder);
    }

    //사업파트너 페이지 목록
    public Page<PartnerResponse> searchPartners(SearchListRequest request, Pageable pageable) {

        BooleanBuilder builder = buildSearch2Condition(request);
        List<PartnerResponse> content = buildPartnerQuery(builder)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(pageable.getSort().stream()
                        .map(order -> order.isAscending() ? partner.createdAt.asc() : partner.createdAt.desc())
                        .findFirst()
                        .orElse(partner.createdAt.desc())
                )
                .fetch();

        long total = queryFactory
                .selectFrom(partner)
                .where(builder)
                .fetchCount();

        System.out.println("-------------------content : " + content);
        System.out.println("-------------------pageable : " + pageable);
        System.out.println("-------------------total : " + total);

        return new PageImpl<>(content, pageable, total);
    }

    //엑셀용 목록
    public List<PartnerResponse> searchPartnersForExcel(SearchListRequest request) {
        BooleanBuilder builder = buildSearch2Condition(request);

        return buildPartnerQuery(builder)
                .orderBy(partner.createdAt.desc())
                .fetch();
    }

    // 사업자 상세조회
    public PartnerResponse PartnerDetail(String partnerId) {

        PartnerResponse partnerDetail = queryFactory
                .select(Projections.fields(PartnerResponse.class, //필요한 필드만 선택해서 매핑시캄 (as 이름명)
                        //.select(Projections.constructor(PartnerResponse.class, => 필드가 완전히 일치해야함
                        partner.partnerName,
                        partner.partnerId,
                        partner.partnerType,
                        partner.businessRegistrationNo,
                        partner.phone,
                        partner.email,
                        partner.businessType,
                        partner.region,
                        partner.address,
                        partner.addressDetail,
                        partner.postalCode,
                        partner.createdAt,
                        partner.updatedAt,
                        partner.deletedAt
                ))
                .from(partner)
                .where(partner.partnerId.eq(partnerId))
                .fetchOne();
        return partnerDetail;
    }

    // 사업자 로그인시 아이디 조회, 상태가 Y인것만 찾기(탈퇴요청한 아이디 제외)
    public Optional<Partner> findByPartnerIdIsStateY(String partnerId) {
        Partner result = queryFactory
                .select(Projections.fields(Partner.class,
                        partner.partnerId,
                        partner.partnerPassword,
                        partner.partnerName
                ))
                .from(partner)
                .where(
                        partner.partnerId.eq(partnerId),
                        partner.isState.eq(StateYN.Y)
                )
                .fetchOne();
        if (result == null) {
            throw new IllegalArgumentException("파트너가 존재하지 않거나 상태가 'Y'가 아닙니다: " + partnerId);
        }
        return Optional.ofNullable(result);
    }



    // 사업자 탈퇴요청 (상태값(is_state값을 'N' 으로 수정)
    @Transactional
    public Boolean deleteRequestPartner(String partnerId) {
        var updateClause = queryFactory
                .update(partner)
                .set(partner.isState, StateYN.N) //상태수정
                .set(partner.deletedAt, LocalDateTime.now()); //탈퇴요청일 수정
        long updatedCount = updateClause
                .where(partner.partnerId.eq(partnerId))
                .execute();
        if (updatedCount == 0) {
            throw new IllegalArgumentException("(상태값 수정)수정할 파트너가 존재하지 않습니다: " + partnerId);
        }
        return true;
    }

    // 사업자들 탈퇴요청 (상태값(is_state값을 'N' 으로 수정)
    @Transactional
    public Boolean deleteRequestPartners(String partnerIds) {
        //System.out.println("Repository partnerIds = " + partnerIds);

        // 쉼표로 구분된 문자열을 리스트로 분리
        List<String> partnerIdList = Arrays.asList(partnerIds.split(","));

        var updateClause = queryFactory
                .update(partner)
                .set(partner.isState, StateYN.N) //상태수정
                .set(partner.deletedAt, LocalDateTime.now()); //탈퇴요청일 수정
        long updatedCount = updateClause
                .where(partner.partnerId.in(partnerIdList))
                .execute();
        if (updatedCount == 0) {
            throw new IllegalArgumentException("(상태값 수정)수정할 파트너가 존재하지 않습니다: " + partnerIdList);
        }
        return true;
    }

    // 사업자 삭제 (쿠폰 및 관련 상품 삭제)
    @Transactional
    public Boolean deletePartner(String partnerId) {
        // 1. Partner 객체 조회
        Partner selectPartner = queryFactory
                .selectFrom(partner)
                .where(partner.partnerId.eq(partnerId))
                .fetchOne();

        if (selectPartner == null) {
            throw new IllegalArgumentException("존재하지 않는 파트너입니다: " + partnerId);
        }

        // 2. 해당 파트너의 모든 쿠폰 조회
        List<Long> couponIds = queryFactory
                .select(coupon.id)
                .from(coupon)
                .where(coupon.partner.eq(selectPartner))
                .fetch();

        if (!couponIds.isEmpty()) {
            // 3. CouponProduct 먼저 삭제
            queryFactory.delete(couponProduct)
                    .where(couponProduct.coupon.id.in(couponIds))
                    .execute();

            // 4. Coupon 삭제
            queryFactory.delete(coupon)
                    .where(coupon.id.in(couponIds))
                    .execute();
        }

        // 5. 마지막으로 Partner 삭제
        queryFactory.delete(partner)
                .where(partner.id.eq(selectPartner.getId()))
                .execute();

        return true;
    }

    // 파트너 등록
    @Transactional
    public Partner insertPartner(Partner partnerEntity) {
        // 파트너 저장 insert
        em.persist(partnerEntity);
        return partnerEntity; //partner을 반환함
    }

    // 파트너 수정
    @Transactional
    public String updatePartner(Partner partnerEntity) {
        System.err.println("사업자 수정 repository partnerEntity = " + partnerEntity);
        // 업데이트 빌더 시작
        var updateClause = queryFactory
                .update(partner)
                .set(partner.partnerName, partnerEntity.getPartnerName())
                .set(partner.partnerType, partnerEntity.getPartnerType())
                .set(partner.businessRegistrationNo, partnerEntity.getBusinessRegistrationNo())
                .set(partner.phone, partnerEntity.getPhone())
                .set(partner.email, partnerEntity.getEmail())
                .set(partner.businessType, partnerEntity.getBusinessType())
                .set(partner.region, partnerEntity.getRegion())
                .set(partner.address, partnerEntity.getAddress())
                .set(partner.addressDetail, partnerEntity.getAddressDetail())
                .set(partner.postalCode, partnerEntity.getPostalCode());

        // partnerPassword가 null 또는 빈 문자열이 아닌 경우에만 set
        if (partnerEntity.getPartnerPassword() != null && !partnerEntity.getPartnerPassword().isEmpty()) {
            updateClause.set(partner.partnerPassword, partnerEntity.getPartnerPassword());
        }

        long updatedCount = updateClause
                .where(partner.partnerId.eq(partnerEntity.getPartnerId()))
                .execute();

        if (updatedCount == 0) {
            throw new IllegalArgumentException("수정할 파트너가 존재하지 않습니다: " + partnerEntity.getPartnerId());
        }else{
            System.out.println("partnerEntity = " + partnerEntity);


        }

        return partnerEntity.getPartnerId();
    }
}