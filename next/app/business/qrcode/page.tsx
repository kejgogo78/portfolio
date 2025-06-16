'use client'
import React from 'react';
import { qrcodeCreate } from '@/lib/apis/common';


/* 
큐알코드 생성 페이지 - qrcodeCreate 함수 호출  

테스트용
*/


export default function qrCode() {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await qrcodeCreate();
            if (result.success) {
                console.log("성공 : ", result.value)
            } else {
                console.log("실패 : ", result.message)
            }
        } catch (err) {
            console.log("실패 : ", err)
        }
    };


    return (
        <body>
            <button onClick={handleSubmit} type="button" id="kt_sign_in_submit" className="btn btn-primary"  data-kt-indicator="off">
                <span className="indicator-label">qr코드 생성</span>
            </button>
        </body>
    );
}
