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
public class PartnerResponse {
    private String partnerName;
    private String partnerId;
    private Integer partnerType;
    private String businessRegistrationNo;
    private String phone;
    private String email;
    private String businessType;
    private String region;
    private String address;
    private String addressDetail;
    private String postalCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    //private List<String> coupons;    // 쿠폰 리스트
}