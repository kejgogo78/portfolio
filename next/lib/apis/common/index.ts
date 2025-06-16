import axios from 'axios';
import { Partner, PartnerResponse } from '@/types/partner';
import { parseStringPromise } from 'xml2js';
import axiosInstance from '@/lib/apis/axiosInstance';


const API_BIZNO_URL = 'https://bizno.net'; // 사업자번호 API 주소
const API_BASE_URL = 'http://localhost:8080'; // API 서버 주소 (local)
//const API_BASE_URL = 'http://111.111.111.111:8080'; // API 서버 주소 (실서버)

// 사업자 아이디 존재 여부 확인
export const fetchBusinessIdCheck = async (id: string) => {
    try {
        const res = await axiosInstance.get<{ isnt: number }>(`/api/auth/partner/isnt/${id}`);
        return { success: true, value: res.data.isnt };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 사업자 이메일 존재 여부 확인후 임의 비밀번호 변경
export const businessEmailFindPwdUpdate = async (email: string) => {
    try {
        const res = await axiosInstance.get<{ partnerName : string, partnerPassword: string }>(`/api/auth/partner/emailfindpwdupdate/${email}`);
        return { success: true, value: {name : res.data?.partnerName, pw:res.data?.partnerPassword} }; //변경된 비밀번호및 정보

    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};


// 사업자 가입
export const register = async (newPartner: Partner) => {
    try {
        const res = await axiosInstance.post('/api/auth/partner', newPartner);
        return { success: true, value: "회원가입 성공" };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 사업자 로그인
export const businessLogin = async (userId: string, userPw: string) => {
    try {
        const res = await axiosInstance.post('/api/auth/partner/login', {
            username: userId,
            password: userPw,
        });
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 관리자 로그인
export const adminLogin = async (userId: string, userPw: string) => {
    try {
        const res = await axiosInstance.post('/api/auth/admin/login', {
            username: userId,
            password: userPw,
        });
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};

// 사업자번호 조회 (외부 API - bizno.net)
export const fetchBusinessCheck = async (businessNumber: string) => {
    const url = `${API_BIZNO_URL}/api/fapi?key=a2VqZ29nb2dvQG5hdmVyLmNvbSAg&gb=1&q=${businessNumber}&type=xml`;
    const res = await axios.get(url);

    const jsonResult = await parseStringPromise(res.data, {
        explicitArray: false,
        trim: true,
    });

    return jsonResult.response.body.totalCount;
};




// 토큰 재발급 (refreshToken 사용, 사업자,관리자 같이 사용 - 분리해주고 위와같은 axiosInstance 를 사용하자.)
export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/newToken`,{}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        return { success: true, value: res.data.accessToken };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};


// qr코드 생성
export const qrcodeCreate = async () => {
    try {
        const res = await axiosInstance.post('/api/qrcode', {
            couponId: 4,
            userId: 'ha222',
            productName: '상품1',
            discountRate: 30
        });
        return { success: true, value: res.data };
    } catch (error: any) {
        const message = error.response?.data?.error || "서버 오류가 발생했습니다.";
        return { success: false, message };
    }
};