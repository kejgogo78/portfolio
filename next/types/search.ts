export interface Search {
    page: number;
    pageSize: number;
    searchText: string;
    searchType: string;
}

export interface SearchCoupon extends Search {
    startDate: string;
    endDate: string;
    isState: string;
}
export interface SearchPartner extends Search {
    
}


export interface SearchRequest extends Search {
}

export interface SearchResponse extends Search {
}

export interface SearchCouponQRCodes extends Search {
    //아이디,쿠폰명,회사명 searchText/searchType
    //사용여부
    isState: string; //사용,미사용,기간만료
}
