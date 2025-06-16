package com.partner.coupons.dto;

import lombok.Data;

@Data
public class SearchListRequest extends Search {
    private String isState = "Y"; // 기본값 "Y"로 설정
}


