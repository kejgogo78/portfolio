
//자동 토큰 갱신 10분
//토큰 자동 갱신 주기를 setInterval로 돌릴 수도 있어 (예: 10분마다)
/*
import { getRefreshToken, saveTokens, isTokenExpired } from './auth';
import { refreshAccessToken } from './api';

export const startTokenRefreshInterval = () => {
  const interval = setInterval(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        const { accessToken } = await refreshAccessToken(refreshToken);
        saveTokens(accessToken, refreshToken);
      } catch (err) {
        console.error('자동 토큰 갱신 실패');
      }
    }
  }, 10 * 60 * 1000); // 10분

  return () => clearInterval(interval); // 종료용
};
*/