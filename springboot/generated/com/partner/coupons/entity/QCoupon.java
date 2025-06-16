package com.partner.coupons.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCoupon is a Querydsl query type for Coupon
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCoupon extends EntityPathBase<Coupon> {

    private static final long serialVersionUID = 1454808381L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCoupon coupon = new QCoupon("coupon");

    public final StringPath benefitDescription = createString("benefitDescription");

    public final StringPath couponName = createString("couponName");

    public final ListPath<CouponProduct, QCouponProduct> couponProducts = this.<CouponProduct, QCouponProduct>createList("couponProducts", CouponProduct.class, QCouponProduct.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> discountRate = createNumber("discountRate", Integer.class);

    public final NumberPath<Long> downloadCnt = createNumber("downloadCnt", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final EnumPath<StateYN> isIssue = createEnum("isIssue", StateYN.class);

    public final StringPath issueDate = createString("issueDate");

    public final StringPath issueEndDate = createString("issueEndDate");

    public final StringPath issueStartDate = createString("issueStartDate");

    public final EnumPath<CouponIsUsable> isUsable = createEnum("isUsable", CouponIsUsable.class);

    public final QPartner partner;

    public final NumberPath<Integer> templateType = createNumber("templateType", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final StringPath usageEndDate = createString("usageEndDate");

    public final StringPath usageStartDate = createString("usageStartDate");

    public QCoupon(String variable) {
        this(Coupon.class, forVariable(variable), INITS);
    }

    public QCoupon(Path<? extends Coupon> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCoupon(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCoupon(PathMetadata metadata, PathInits inits) {
        this(Coupon.class, metadata, inits);
    }

    public QCoupon(Class<? extends Coupon> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.partner = inits.isInitialized("partner") ? new QPartner(forProperty("partner")) : null;
    }

}

