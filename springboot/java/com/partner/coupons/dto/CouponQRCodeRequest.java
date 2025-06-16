package com.partner.coupons.dto;

import com.partner.coupons.entity.Coupon;
import com.partner.coupons.entity.StateYN;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/*
QR코드 생성시 사용함
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponQRCodeRequest {
    private Long couponId; //쿠폰아이디
    private String qrcodeId; //qrcode 고유번호
    private String userId; //사용자아이디
    private String productName; //상품명
}


