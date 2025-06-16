package com.partner.coupons.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCouponQRCode is a Querydsl query type for CouponQRCode
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCouponQRCode extends EntityPathBase<CouponQRCode> {

    private static final long serialVersionUID = 1380265771L;

    public static final QCouponQRCode couponQRCode = new QCouponQRCode("couponQRCode");

    public final NumberPath<Long> couponId = createNumber("couponId", Long.class);

    public final StringPath couponName = createString("couponName");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> discountRate = createNumber("discountRate", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final EnumPath<StateYN> isUsed = createEnum("isUsed", StateYN.class);

    public final StringPath partnerId = createString("partnerId");

    public final StringPath partnerName = createString("partnerName");

    public final StringPath productName = createString("productName");

    public final StringPath qrcodeId = createString("qrcodeId");

    public final StringPath usageEndDate = createString("usageEndDate");

    public final StringPath usageStartDate = createString("usageStartDate");

    public final DateTimePath<java.time.LocalDateTime> usedAt = createDateTime("usedAt", java.time.LocalDateTime.class);

    public final StringPath userId = createString("userId");

    public QCouponQRCode(String variable) {
        super(CouponQRCode.class, forVariable(variable));
    }

    public QCouponQRCode(Path<? extends CouponQRCode> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCouponQRCode(PathMetadata metadata) {
        super(CouponQRCode.class, metadata);
    }

}

