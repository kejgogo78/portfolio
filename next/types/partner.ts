export interface Partner {
    partnerName: string;        // 상호명
    partnerId: string;          // 로그인 아이디
    partnerPassword: string;    // 로그인 비밀번호
    businessRegistrationNo: string;   // 사업자번호
    phone: string;              // 연락처
    email: string;              // 이메일
    businessType: string;       // 사업분야
    region: string;             // 지역
    address: string;            // 주소1
    addressDetail: string;      // 주소2
    postalCode: string;         // 우편번호
    partnerType: number;        // 종류
    
}  



export interface PartnerRequest extends Partner {
    
}

export interface PartnerResponse extends Partner {
    createdAt: string;          // 가입일
    updatedAt: string;          // 수정일
    deletedAt: string;          // 삭제일
}
