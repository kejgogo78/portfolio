package com.partner.coupons.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Search {
    private String searchText;
    private String searchType;
    private Integer page;
    private Integer pageSize;
}


//검색어,검색셀렉트,사용여부셀렉트