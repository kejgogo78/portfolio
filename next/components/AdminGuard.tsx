'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { refreshAccessToken } from '@/lib/apis/common';
import {
    getAdminAccessToken, getAdminRefreshToken, saveAdminTokens
    , isAdminTokenExpired, decodeAdminToken, removeAdminTokensCookies
} from '@/lib/adminAuth';


type Props = {
    children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null); // null: 로딩 중

    useEffect(() => {
            const checkAuth = async () => {
                //쿠키에서 토큰 꺼내오기
                const accessToken = getAdminAccessToken();
                const refreshToken = getAdminRefreshToken();
                console.log("accessToken : ", accessToken)
                console.log("refreshToken : ", refreshToken)
    
                //토큰여부, 토큰 유효기간 체크 - 로그인페이지 이동
                //토큰이 없거나 토큰이 만료 되면
                if (!accessToken || isAdminTokenExpired(accessToken)) { 
                   
                    //refresh토큰으로 재발급(refresh토큰이 있고 refresh토큰이 만료되지 않았을때) 
                    if (refreshToken && !isAdminTokenExpired(refreshToken)) {
                        try {
                            console.log("- 토큰 재발급 ----------------------------")
                            const result = await refreshAccessToken(refreshToken);
                            if (result.success) {
                                console.log("data : ", result.value) //새토큰
                                saveAdminTokens(result.value, refreshToken); //새토큰,refreshToken 저장
                                setAuthorized(true);
                                return;
                            } else throw new Error(result.message || "토큰 재발급 실패");
    
                        } catch (err) {
                            console.error("토큰 재발급 에러:", err);
                        }
                    } else {
                        console.error("모든 토큰이 만료되었습니다.")
                    }
                    router.replace('/admin/login');
                    removeAdminTokensCookies();
                    setAuthorized(false);
                
                } else {
                    setAuthorized(true);
                }
            };
            checkAuth();
        }, [router]);

    // 로딩 중일 땐 아무것도 렌더링하지 않음
    if (authorized === null) {
        return <>인증 확인 중...</>;
    }

    // 인증 완료 시 children 렌더링
    if (authorized) {
        return <>{children}</>;
    }

    // 인증 실패한 경우는 라우팅으로 넘어가므로 여기선 null
    return null;
}