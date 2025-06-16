package com.partner.coupons.dto;

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
public class CouponResponse{
    private Long couponId; //쿠폰아이디
    private String couponName;
    private String partnerId; // partner_id만
    private String partnerName; // 쿠폰발급된 상호명
    private Integer discountRate;
    private Integer templateType;
    private String usageStartDate;
    private String usageEndDate;
    private String issueStartDate;
    private String issueEndDate;
    private String benefitDescription;
    private String isUsable;
    private String isIssue;
    private String issueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> productNames;    // 상품명 리스트
    private Integer downloadCount; //다운로드수
    private Integer usedCount; //사용수
}