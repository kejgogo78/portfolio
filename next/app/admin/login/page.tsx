'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { adminLogin } from '@/lib/apis/common';
import { setCookieName } from '@/lib/cookies';
import { saveAdminTokens } from '@/lib/adminAuth';


export default function LoginAdmin() {

    let router = useRouter()
    //console.log('관리자 > API BASE URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    var [userId, setUserId] = useState("");
    var [userPw, setUserPw] = useState("");
    var [autoLogin, setAutoLogin] = useState(false);
    var [errerTxt, setErrerTxt] = useState(false);
    const [loading, setLoading] = useState(false);

    //로그인 아이디 기억하기 이미 체크 되어 있는경우
    useEffect(() => {
        const savedId = localStorage.getItem('savedAdminId');
        if (savedId) {
            setUserId(savedId);
            setAutoLogin(true);
        }
    }, []);

    //로그인 버튼 클릭 핸들러 (handleLogin)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)

            //아이디,비밀번호 입력 요구
            if (!userId.trim()) {
                alert('ID를 입력해주세요');
                setLoading(false)
                return;
            }
            if (!userPw.trim()) {
                alert('Password를 입력해주세요');
                setLoading(false)
                return;
            }


            //로그인 API 호출
            const result = await adminLogin(userId, userPw);
            if (result.success) {
                //alert(`로그인 완료`);
                //console.log("* 사업자정보 : ", result.value.partner)  //userId, email,
                //console.log("* 토큰 : ",  result.value.token)
                //console.log("* 리플래쉬토큰큰 : ",  result.value.refreshToken)
                saveAdminTokens(result.value.token, result.value.refreshToken); //받아온 토큰 저장
                setCookieName("cookieAdminId", result.value.adminId, 60 * 60 * 24 * 30); //30일
                setCookieName("cookieAdminName", "관리자", 60 * 60 * 24 * 30); //30일
            } else {
                //alert(result.message);
                setLoading(false)
                setErrerTxt(true)
                return;
            }

            if (autoLogin) {
                localStorage.setItem('savedAdminId', userId); //로그인 아이디 기억하기
            } else {
                localStorage.removeItem('savedAdminId');
            }

            router.push("/admin/manage");
        } catch (err) {
            alert('로그인 실패');
            setLoading(false)
        }
    };

    useEffect(() => {
        //if (document.documentElement) {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        //}
    }, []);


    return (
        <body id="kt_body" className="app-blank app-blank">


            <div className="d-flex flex-column flex-root" id="kt_app_root">
                <div className="d-flex flex-column flex-lg-row flex-column-fluid">
                    <div className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center"
                        style={{ backgroundImage: 'url("/images/login/auth-bg.png")' }}>
                        <div className="d-flex flex-column flex-center p-6 p-lg-10 w-100">
                            <a href="/admin/manage" className="mb-0 mb-lg-20">
                                <img alt="Logo" src="/images/logo/default-dark.svg" className="h-40px h-lg-50px" />
                            </a>
                            <h1 className="d-none d-lg-block text-white fs-2qx fw-bold text-center mb-7"><span className="fs-3qx text-coupon">L</span>ocal <span className="fs-3qx text-coupon">C</span>oupon <span className="fs-3qx text-coupon">S</span>ystem</h1>
                            <img className="d-none d-lg-block mx-auto w-300px w-lg-75 w-xl-400px mb-10 mb-lg-20" src="/images/login/auth-screens.png" alt="" />
                            <h2 className="d-none d-lg-block text-white fs-2qx fw-bold text-center mb-7">HYPER GLOCAL SNS</h2>
                            <div className="d-none d-lg-block text-white fs-base text-center">On The Real World 1:1 Mapping Virtual Land With Local Contents.</div>
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10">
                        <div className="d-flex flex-center flex-column flex-lg-row-fluid">
                            <div className="w-lg-500px p-10">
                                <form onSubmit={handleLogin} className="form w-100" noValidate id="kt_sign_in_form">
                                    <div className="text-center mb-11">
                                        <h1 className="text-dark fw-bolder mb-3">관리자 로그인</h1>
                                        <div className="text-gray-500 fw-semibold fs-6">Administrator Mode</div>
                                    </div>
                                    <div className="fv-row mb-8">
                                        <input type="text" placeholder="ID" name="userId" title="아이디" autoComplete="off" className="form-control bg-transparent"
                                            value={userId}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserId(e.target.value) }} />
                                    </div>
                                    <div className="fv-row mb-8">
                                        <input type="password" placeholder="Password" name="userPw" autoComplete="off" className="form-control bg-transparent"
                                            title="비밀번호" value={userPw}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserPw(e.target.value) }} />
                                    </div>
                                    <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                                        <div>
                                            <input id="rememberId" type="checkbox" checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)}/> 아이디 저장
                                        </div>
                                    </div>

                                    <div className="d-grid mb-10" >
                                        <button type="submit" id="kt_sign_in_submit" className="btn btn-primary"
                                            data-kt-indicator={loading ? "on" : "off"}>
                                            <span className="indicator-label">로그인</span>
                                            <span className="indicator-progress">Please wait...
                                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                            </span>
                                        </button>


                                    </div>
                                    {!errerTxt ? "" :
                                        <div>
                                            <span className="text-danger">아이디(사업자번호) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.</span>
                                        </div>
                                    }


                                </form>
                            </div>
                        </div>
                        <div className="d-flex flex-center flex-wrap px-5">
                            <span className="text-muted fw-semibold me-1">Copyright 2025 © <a href="https://xxx.com" target="_blank" className="text-gray-800 text-hover-primary">KEJ Inc.</a> All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
}


/*
            <p>관리자 로그인 페이지 입니다.</p>
            <Link href="/admin/">관리자 메인 페이지 이동</Link>
            <form onSubmit={handleLogin}>
                <input name="userId" title="아이디" type="text" placeholder="아이디"
                    value={userId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserId(e.target.value) }} />
                <input name="userPw" title="비밀번호" type="password" placeholder="비밀번호"
                    value={userPw} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUserPw(e.target.value) }} />
                {errerTxt ?
                    <div>
                        아이디 또는 비밀번호가 잘못 되었습니다.
                        아이디와 비밀번호를 정확히 입력해 주세요
                    </div> : ''
                }
                {errerTxt2 ?
                    <div>
                        내부 서버 오류입니다. 관리자에게 문의해주세요.
                    </div> : ''
                }
                <button type="submit" id="login" >관리자 로그인</button>

                <input
                    id="rememberId"
                    type="checkbox"
                    checked={autoLogin}
                    onChange={() => setAutoLogin(!autoLogin)}
                /> 아이디 저장
            </form>

            <p></p>
            */

