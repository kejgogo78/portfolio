
export interface CouponQRCode { 
    id: number; 
    couponId: number;       //쿠폰아이디
    couponName: string;     //쿠폰명
    qrcodeId: string;       //qrcode 고유번호
    userId: string;         //사용자아이디    
    productName: string;    //상품명
    discountRate: number;   //할인율
    usedAt: string;         //qr쿠폰 사용일
    createdAt: string;      //qr코드 발급일
    isState: string;         //qr코드 사용여부(사용,미사용,기간만료)
    partnerId: string;      // partner id
    partnerName: string;    // 쿠폰발급된 상호명
    usageStartDate: string; //쿠폰 사용 가능 시작일
    usageEndDate: string;   //쿠폰 사용 가능 마지막일
}
