
export interface Coupon { 
    partnerId: string; //사업자 아이디
    couponName: string;
    discountRate: number;
    templateType: number;
    usageStartDate: string;
    usageEndDate: string;
    issueStartDate: string;
    issueEndDate: string;
    benefitDescription: string;
    isUsable: 'USABLE' | 'NOT_USABLE';
    isIssue: 'Y' | 'N';
    issueDate: string;
    productNames: string[];
}

export interface CouponRequest extends Coupon {
    couponId: number;
}

export interface CouponResponse extends Coupon {
    couponId: number;
    partnerName: string; // 상호명
    createdAt: string;
    updatedAt: string;
    downloadCnt: number; //다운로드수
    usedCnt: number;//사용수
    isState: string; //상태(진행중/기간만료)
}

//쿠폰에 연결된 상품
export interface CouponProduct {
	id: number
	name: string
}