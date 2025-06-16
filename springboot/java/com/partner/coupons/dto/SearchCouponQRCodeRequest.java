package com.partner.coupons.dto;

import lombok.Data;

@Data
public class SearchCouponQRCodeRequest extends Search{
    private String isState; //사용,미사용,기간만료
}


