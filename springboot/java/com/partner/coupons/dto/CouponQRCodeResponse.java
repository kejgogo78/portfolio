package com.partner.coupons.dto;

import com.partner.coupons.entity.StateYN;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponQRCodeResponse {
    private Long id;
    private String qrcodeId; //qrcode 고유번호
    private Long couponId; //쿠폰아이디
    private String couponName; //쿠폰명
    private String partnerId; // partner id
    private String partnerName; // 쿠폰발급된 상호명
    private String userId; //사용자아이디
    private String productName; //상품명
    private Integer discountRate; //할인율
    private String usageStartDate; //쿠폰 사용 가능 시작일
    private String usageEndDate; //쿠폰 사용 가능 마지막일
    private LocalDateTime createdAt; //qr코드 발급일
    private StateYN isUsed; //qr코드 사용여부(qr코드 발급시 사용여부는 N)
    private LocalDateTime usedAt; //qr코드 사용일

    private String isState; //qr코드 상태(N:사용안함,Y:사용함,E:기간만료)
}