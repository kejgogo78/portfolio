package com.partner.coupons.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRequest {
    //private Long id;
    private String partnerName;
    private String partnerId;
    private String partnerPassword;
    private Integer partnerType;
    private String businessRegistrationNo;
    private String phone;
    private String email;
    private String businessType;
    private String region;
    private String address;
    private String addressDetail;
    private String postalCode;
    //private LocalDateTime createdAt;
    //private LocalDateTime updatedAt;
    //private LocalDateTime deletedAt;

/*
    private Long id;
    private String partnerName;
    private String partnerId;
    private String partnerPassword;
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
*/

}


