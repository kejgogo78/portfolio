import { jwtDecode } from 'jwt-decode';
import { JwtPayloadData } from '@/types/jwtPayloadData';
import { removeCookieName, setCookieName, getCookieName } from '@/lib/cookies';

//모든 토큰을 쿠키에 넣는다.
export const saveBusinessTokens = (accessToken: string, refreshToken: string) => {
    //setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 1}); // 1시간
    setCookieName('businessAccessToken', accessToken, 60 * 60 * 24 * 10) //10일
    setCookieName('businessRefreshToken', refreshToken, 60 * 60 * 24 * 30) //30일
};

//모든 토큰과 모든 쿠키를 지운다.
export const removeBusinessTokensCookies = () => {
    removeCookieName('businessAccessToken');
    removeCookieName('businessRefreshToken');
    removeCookieName("cookieBusinessId");
    removeCookieName("cookieBusinessName");
};

//partnerId
export const getCookieBusinessId = () => {
    return getCookieName('cookieBusinessId');
};
//partnerName
export const getCookieBusinessName = () => {
    return getCookieName('cookieBusinessName');
};

//AccessToken
export const getBusinessAccessToken = () => {
    return getCookieName('businessAccessToken');
};

//RefreshToken
export const getBusinessRefreshToken = () => {
    return getCookieName('businessRefreshToken');
};

//BusinessToken decode
export const decodeBusinessToken = (token: string): JwtPayloadData => {
    return jwtDecode<JwtPayloadData>(token);
};

//토큰 만료 체크를 위한(실패: 만료됨, 성공: 사용가능)
export const isBusinessTokenExpired = (token: string): boolean => {
    const decoded: any = decodeBusinessToken(token); 
    const now = Date.now() / 1000; //현재 시간 (초 단위, UNIX time)
    return decoded.exp < now;       //decoded.exp	JWT의 만료 시간 (UNIX time)
                                    //exp < now	지금이 만료 시간보다 이후 → 만료됨
    
    //즉, true를 리턴하면 "토큰이 만료되었음(실패)",
    //false를 리턴하면 **"사용 가능한 토큰(성공)"**입니다.
};



