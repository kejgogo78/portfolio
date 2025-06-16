package com.partner.coupons.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//쿠폰 QRcode 
@Entity
@Table(name = "coupon_qrcodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponQRCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //qrcode 고유값

    @Column(name = "qrcode_id", nullable = false)
    private String qrcodeId; //qrcode 고유번호

    @Column(name = "coupon_id", nullable = false)
    private Long couponId; //쿠폰아이디

    @Column(name = "coupon_name", nullable = false)
    private String couponName; //쿠폰명

    @Column(name = "partner_id", nullable = false)
    private String partnerId; //사업자아이디

    @Column(name = "partner_name", nullable = false)
    private String partnerName; //사업자명

    @Column(name = "user_id", nullable = false)
    private String userId; //사용자아이디

    @Column(name = "product_name")
    private String productName; //상품명

    @Column(name = "discount_rate")
    private Integer discountRate; //할인율

    private String usageStartDate; //쿠폰사용 시작일
    private String usageEndDate;   //쿠폰사용 마지막일

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; //qr코드 발급일(생성날짜)

    @Column(name = "is_used", nullable = false)
    @Enumerated(EnumType.STRING)
    private StateYN isUsed; //qr코드 사용여부

    @Column(name = "used_at")
    private LocalDateTime usedAt; //qr코드 사용일

    @PrePersist // insert시 동작
    public void onCreate() {
        this.createdAt = LocalDateTime.now(); //발급일
        this.isUsed = StateYN.N; //큐알코드 사용전
    }

}