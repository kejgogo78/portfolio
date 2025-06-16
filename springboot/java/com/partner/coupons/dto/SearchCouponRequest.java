package com.partner.coupons.dto;

import lombok.Data;

@Data
public class SearchCouponRequest extends Search{
    private String partnerId;
    private String startDate;
    private String endDate;
    private String isState;
}
