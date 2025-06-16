package com.partner.coupons.dto;

import org.springframework.data.domain.Pageable;

public record SearchRequest(String searchText, String searchType, Integer page, Integer pageSize) {}

