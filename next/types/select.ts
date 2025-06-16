export type OptionType = {
        value: string;
        label: string;
}


export const SelectPartnerSearchOptions: OptionType[] = [
        { value: 'all', label: '전체' },
        { value: 'name', label: '상호명' },
        { value: 'number', label: '사업자번호' },
        { value: 'area', label: '지역' },
];

export const SelectCouponSearchOptions: OptionType[] = [
        { value: 'all', label: '전체' },
        { value: 'name', label: '상호명' },
        { value: 'coupon', label: '쿠폰명' },
];

export const SelectCouponIssueSearchOptions: OptionType[] = [
        { value: 'all', label: '전체' },
        { value: 'id', label: '아이디' },
        { value: 'coupon', label: '쿠폰명' },
        { value: 'name', label: '상호명' },
];

export const SelectBusinessTypeOptions: OptionType[] = [
        { value: '한식', label: '한식' },
        { value: '중식', label: '중식' },
        { value: '일식', label: '일식' },
        { value: '양식', label: '양식' },
        { value: '피자', label: '피자' },
        { value: '치킨', label: '치킨' },
        { value: '아시안', label: '아시안' },
        { value: '패스트푸드', label: '패스트푸드' },
        { value: '카페ㆍ디저트', label: '카페ㆍ디저트' },
        { value: '기타', label: '기타' },
];

export const SelectCouponQRCodeIsUsedOptions: OptionType[] = [
        { value: '', label: '전체' },
        { value: 'N', label: '미사용' },
        { value: 'Y', label: '사용' },
        { value: 'E', label: '기간만료' },
];

export const SelectCouponIsStateOptions: OptionType[] = [
        { value: '', label: '전체' },
        { value: 'WAITING', label: '대기중' },
        { value: 'ING', label: '진행중' },
        { value: 'END', label: '기간만료' },
];
