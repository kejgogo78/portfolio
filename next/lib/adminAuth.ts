//lib/auth.ts             ← 인증 관련 헬퍼

import { jwtDecode } from 'jwt-decode';
import { JwtPayloadData } from '@/types/jwtPayloadData';
import { removeCookieName, setCookieName, getCookieName } from '@/lib/cookies';

//모든 토큰을 쿠키에 넣는다.
export const saveAdminTokens = (accessToken: string, refreshToken: string) => {
    setCookieName('adminAccessToken', accessToken, 60 * 60 * 24 * 10) //10일
    setCookieName('adminRefreshToken', refreshToken, 60 * 60 * 24 * 30) //30일
};
//모든 토큰과 모든 쿠키를 지운다.
export const removeAdminTokensCookies = () => {
    removeCookieName('adminAccessToken');
    removeCookieName('adminRefreshToken');
    removeCookieName("cookieAdminId");
    removeCookieName("cookieAdminName");
};

//AccessToken
export const getAdminAccessToken = () => {
    return getCookieName('adminAccessToken');
};

//RefreshToken
export const getAdminRefreshToken = () => {
    return getCookieName('adminRefreshToken');
};


//BusinessToken decode
export const decodeAdminToken = (token: string): JwtPayloadData => {
    return jwtDecode<JwtPayloadData>(token);
};

//토큰 만료 체크를 위한
export const isAdminTokenExpired = (token: string): boolean => {
    const decoded = decodeAdminToken(token);
    const now = Date.now() / 1000; // 현재 시간 (초 단위)

    //console.log("토큰 만료 체크 : exp , now => " + exp +" , " + now)
    return decoded.expirationTime < now;
};


