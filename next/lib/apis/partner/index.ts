import axios from 'axios';
import qs from 'qs';
import { Coupon } from '@/types/coupon';
import { Partner } from '@/types/partner';
import { Search } from '@/types/search';
import axiosInstance from '@/lib/apis/axiosInstance';


//쿠폰 생성
export const createCoupon = async (newCoupon: Coupon) => {
    try {
        const res = await axiosInstance.post('/api/partner/coupon', newCoupon);
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
        const res = await axiosInstance.patch('/api/partner/coupon', newCoupon);
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
        const res = await axiosInstance.delete(`/api/partner/coupon/${couponId}`);
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
        const res = await axiosInstance.delete(`/api/partner/coupons/${couponIds}`);
        return { success: true, value: "쿠폰들 삭제 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 쿠폰리스트 
export const fetchPartnerCoupons = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/partner/coupons?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
// 사업자 쿠폰 리스트 (엑셀용)
export const fetchPartnerCouponsExcel = async (newSearch: Search) => {
    try {
        const query = qs.stringify(newSearch);
        const res = await axiosInstance.get(`/api/partner/couponsExcel?${query}`);
        return { success: true, value: res.data };

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 쿠폰 상세보기
export const fetchPartnerCouponDetail = async (id: string) => {
    try {
        const res = await axiosInstance.get(`/api/partner/coupon/${id}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//---------------------------------------------------------------------------------------
//사업자 상세보기
export const fetchPartnerDetail = async (partnerId: string) => {
    try {
        const res = await axiosInstance.get(`/api/partner/${partnerId}`);
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
//사업자 수정
export const updatePartner = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.patch('/api/partner', newPartner);
        return { success: true, value: "사업자 정보 수정 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//사업자 탈퇴
export const deletePartner = async () => {
    try {
        const res = await axiosInstance.delete(`/api/partner`);
        return { success: true, value: "사업자 정보 탈퇴처리 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};

//QR코드 사용처리
export const qrcodeUsed = async (queryId: string) => {
    try {
        const res = await axiosInstance.get(`/api/partner/qrcodeUsed?id=${queryId}`);
        return { success: true, value: "할인쿠폰사용 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        console.log("에러메세지 : ", message);
        return { success: false, message };
    }
};
