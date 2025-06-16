package com.partner.coupons.dto;

import com.partner.coupons.entity.CouponIsUsable;
import com.partner.coupons.entity.CouponProduct;
import com.partner.coupons.entity.Partner;
import com.partner.coupons.entity.StateYN;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    private Long couponId; //쿠폰아이디
    private String partnerId; // partner_id만
    private String couponName;
    private Integer discountRate;
    private Integer templateType;
    private String usageStartDate;
    private String usageEndDate;
    private String issueStartDate;
    private String issueEndDate;
    private String benefitDescription;
    private String isUsable;
    private String isIssue;
    private List<String> productNames;    // 상품명 리스트
}


