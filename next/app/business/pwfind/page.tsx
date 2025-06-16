'use client'

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { businessEmailFindPwdUpdate } from '@/lib/apis/common';

export default function PwFindBusiness() {

    let router = useRouter()

    var [email, setEmail] = useState("");
    var [errerTxt, setErrerTxt] = useState(false);
    const [loading, setLoading] = useState(false);
    
    
    //비밀번호 찾기 버튼 클릭 핸들러 (handleLogin)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true)
            if (!email.trim()) {
                alert('Email을 입력해주세요');
                setLoading(false)
                return;
            }
           

            //이메일 검색후 임시비밀번호 설정 API
            const result = await businessEmailFindPwdUpdate(email);
            if (result.success) {
                const name = result.value?.name
                const pw = result.value?.pw
                
                console.log("result" , result.value)
                
                //메일세팅
                const emailData = {
                    name: `${name} 고객님`,
                    email: email,
                    message: `<p>안녕하세요 <strong>${name}</strong>님,</p>
                            <p>요청하신 <span style="color:blue;">임시 비밀번호</span>는 다음과 같습니다:</p>
                            <h2 style="color:red;">${pw}</h2>
                            <p>로그인 후 반드시 비밀번호를 변경해주세요.</p>`
                };

                //임시비밀번호 메일 발송
                const res = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData),
                });
                if (res.ok) {
                    setLoading(false)
                    alert(`입력하신 메일로 임시 비밀번호를 보내드렸습니다.`);
                    router.push("/business/login");
                } else {
                    setLoading(false)
                    alert('메일 전송에 실패했습니다.');
                }  
            } else {
                //alert(result.message);
                setLoading(false)
                setErrerTxt(true)
                return;
            }
        } catch (err) {
            alert('비밀번호 재설정 실패');
            setLoading(false)
        }
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }, []);


    return (
        <body id="kt_body" className="app-blank app-blank">
            <div className="d-flex flex-column flex-root" id="kt_app_root">
                <div className="d-flex flex-column flex-lg-row flex-column-fluid">
                    <div className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center"
                        style={{ backgroundImage: "url('/images/login/auth-bg.png')" }}>

                        <div className="d-flex flex-column flex-center p-6 p-lg-10 w-100">
                            <a href="/business/manage" className="mb-0 mb-lg-20">
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
                                <form className="form w-100" onSubmit={handleLogin} id="kt_password_reset_form" data-kt-redirect-url="html/login/new-password.html" action="#">
                                    <div className="text-center mb-10">
                                        <h1 className="text-dark fw-bolder mb-3">비밀번호를 잊으셨나요 ?</h1>
                                        <div className="text-gray-500 fw-semibold fs-6">비밀번호를 재설정하려면 가입시 등록한 이메일을 입력하세요.</div>
                                    </div>
                                    <div className="fv-row mb-8">
                                        <input type="text" placeholder="Email" name="email" className="form-control bg-transparent"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value) }} />
                                    </div>
                                    <div className="d-flex flex-wrap justify-content-center pb-lg-0">
                                        <button type="submit" id="kt_password_reset_submit" className="btn btn-primary me-4"
                                        data-kt-indicator={loading?"on" : "off"}>
                                            <span className="indicator-label">확인</span>
                                            <span className="indicator-progress">Please wait...
                                                <span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                                        </button>
                                        <a href="html/login/sign-in.html" className="btn btn-light">취소</a>
                                    </div>
                                </form>
                            </div>
                        </div>




                        <div className="d-flex flex-center flex-wrap px-5">
                            <span className="text-muted fw-semibold me-1">Copyright 2025 © <a href="https://keenthemes.com" target="_blank" className="text-gray-800 text-hover-primary">UNDERPIN Inc.</a> All Rights Reserved.</span>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    );
}    
