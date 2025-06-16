import qs from 'qs';
import { Partner } from '@/types/partner';
import { Coupon } from '@/types/coupon';
import { Search, SearchCouponQRCodes } from '@/types/search';
import axiosInstance from '@/lib/apis/axiosInstance';

//쿠폰 생성
export const createCoupon = async (newCoupon: Coupon) => {
    try {
        const res = await axiosInstance.post('/api/admin/coupon', newCoupon);
        return { success: true, value: "쿠폰생성 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//쿠폰 수정
export const updateCoupon = async (newCoupon: Coupon) => {
    try {
        const res = await axiosInstance.patch('/api/admin/coupon', newCoupon);
        return { success: true, value: "쿠폰수정 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//쿠폰 삭제
export const deleteCoupon = async (couponId: number) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/coupon/${couponId}`);
        return { success: true, value: "쿠폰삭제 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//쿠폰들 삭제
export const deleteCoupons = async (couponIds: number[]) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/coupons/${couponIds}`);
        return { success: true, value: "쿠폰들 삭제 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};


// 관리자 쿠폰 리스트 (엑셀용)
export const fetchAdminCouponsExcel = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/couponsExcel?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

// 관리자 쿠폰 리스트
export const fetchAdminCoupons = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/coupons?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//관리자 쿠폰 상세보기
export const fetchAdminCouponDetail = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/api/admin/coupon/${id}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//---------------------------------------------------------------------------------------

// 사업자리스트 전체
export const fetchPartnersAll = async () => {
    try {
        const res = await axiosInstance.get(`/api/admin/partnerIds`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

// 사업자 리스트
export const fetchPartners = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/partners?${query}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

// 사업자 리스트 (엑셀용)
export const fetchPartnersExcel = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/admin/partnersExcel?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 생성
export const createPartner = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.post('/api/admin/partner', newPartner);
        return { success: true, value: "사업자 등록록 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//사업자 수정
export const updatePartner = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.patch('/api/admin/partner', newPartner);
        return { success: true, value: "사업자 정보 수정 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 탈퇴
export const deletePartner = async (partnerId: String) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/partner/${partnerId}`);
        return { success: true, value: "사업자 정보 탈퇴처리 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//사업자들(여러업체 선택) 탈퇴
export const deletePartners = async (partnerIds: string[]) => {
    try {
        const res = await axiosInstance.delete(`/api/admin/partners/${partnerIds}`);
        return { success: true, value: "사업자들 정보 탈퇴처리 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};


//사업자 상세보기
export const fetchAdminPartnerDetail = async (partnerId: string) => {
    try {
        const res = await axiosInstance.get(`/api/admin/partner/${partnerId}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};



// 쿠폰발급 리스트
export const fetchCouponsIssue = async (newSearch: SearchCouponQRCodes) => {
    try {
        const query = qs.stringify(newSearch, { skipNulls: true });
        console.log("검색을 위한 보내는 값 : ", query)

        const res = await axiosInstance.get(`/api/admin/qrcodes?${query}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

// 쿠폰발급 리스트 (엑셀용)
export const fetchCouponsIssueExcel = async (newSearch: SearchCouponQRCodes) => {
    try {
        const query = qs.stringify(newSearch, { skipNulls: true });
        const res = await axiosInstance.get(`/api/admin/qrcodesExcel?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};  