package com.partner.coupons.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPartner is a Querydsl query type for Partner
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPartner extends EntityPathBase<Partner> {

    private static final long serialVersionUID = 398572177L;

    public static final QPartner partner = new QPartner("partner");

    public final StringPath address = createString("address");

    public final StringPath addressDetail = createString("addressDetail");

    public final StringPath businessRegistrationNo = createString("businessRegistrationNo");

    public final StringPath businessType = createString("businessType");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> deletedAt = createDateTime("deletedAt", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final EnumPath<StateYN> isState = createEnum("isState", StateYN.class);

    public final StringPath partnerId = createString("partnerId");

    public final StringPath partnerName = createString("partnerName");

    public final StringPath partnerPassword = createString("partnerPassword");

    public final NumberPath<Integer> partnerType = createNumber("partnerType", Integer.class);

    public final StringPath phone = createString("phone");

    public final StringPath postalCode = createString("postalCode");

    public final StringPath region = createString("region");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QPartner(String variable) {
        super(Partner.class, forVariable(variable));
    }

    public QPartner(Path<? extends Partner> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPartner(PathMetadata metadata) {
        super(Partner.class, metadata);
    }

}

