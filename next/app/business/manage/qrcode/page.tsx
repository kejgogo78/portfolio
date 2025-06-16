'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { qrcodeUsed } from '@/lib/apis/partner';

export default function qrCodeUsed() {

    const params = useSearchParams();
    const queryId = params?.get('id') || '';

    const [isLoading, setIsLoading] = useState(false);
    const [resultMsg, setResultMsg] = useState(`"${queryId}" 쿠폰을 사용 하시겠습니까?`);
    const [resultFocus, setResultFocus] = useState(false);
    const [popHtml, setPopHtml] = useState(true);

    const handleSubmit = async () => {
        try {
            const result = await qrcodeUsed(queryId);
            if (result.success) {
                setResultMsg(`"${queryId}" 쿠폰을 사용 하였습니다.`);
            } else {
                setResultMsg(`"쿠폰사용 실패 : ${result.message}"`);
            }
        } catch (err) {
            console.log("실패 : ", err)
        }
        setResultFocus(true);
    };

    return (
        <div className={popHtml ? "swal2-container swal2-center swal2-backdrop-show" : ""} style={{ overflowY: "auto" }}>
            <div aria-labelledby="swal2-title" aria-describedby="swal2-html-container"
                className="swal2-popup swal2-modal swal2-success swal2-show" tabIndex={-1} role="dialog"
                aria-live="assertive" aria-modal="true" style={{ display: popHtml ? "grid" : "none" }}> {/*grid*/}

                <button type="button" className="swal2-close" aria-label="Close this dialog" style={{ display: "none" }}> × </button>
                <ul className="swal2-progress-steps" style={{ display: "none" }}></ul>
                <div className="swal2-icon swal2-warning swal2-icon-show" style={{ display: "flex" }}>
                    <span className="swal2-icon-content">
                        <span className="swal2-success-circular-line-left"></span>
                        <span className="swal2-success-circular-line-right"></span>
                    </span>
                </div>
                <img className="swal2-image" style={{ display: "block" }} />
                <h2 className="swal2-title" id="swal2-title" style={{ display: "block" }} >쿠폰사용</h2>
                <div className="swal2-html-container" id="swal2-html-container" style={{ display: "block" }}>
                    {resultMsg}
                </div>
                {
                    !resultFocus ?
                        <div className="swal2-actions" style={{ display: "flex" }}><div className="swal2-loader"></div>
                            <button type="button" onClick={handleSubmit}
                                className="swal2-confirm btn btn-primary" aria-label="" style={{ display: "inline-block" }}>쿠폰사용</button>
                            <button type="button" onClick={() => { setPopHtml(false) }}
                                className="swal2-deny btn  btn-light" aria-label="" style={{ display: "inline-block" }}>취소</button>
                        </div> 
                    :     
                        <div className="swal2-actions" style={{ display: "flex" }}><div className="swal2-loader"></div>
                            <button type="button" onClick={() => { setPopHtml(false) }}
                                className="swal2-deny btn  btn-light" aria-label="" style={{ display: "inline-block" }}>확인</button>
                        </div> 
                }
                <input id="swal2-input" className="swal2-input" style={{ display: "none" }} />
                <input type="file" className="swal2-file" style={{ display: "none" }} />

                <div className="swal2-range" style={{ display: "none" }}>
                    <input type="range" />
                    <output></output>
                </div>

                <select id="swal2-select" className="swal2-select" style={{ display: "none" }}></select>

                <div className="swal2-radio" style={{ display: "none" }}></div>

                <label className="swal2-checkbox" style={{ display: "none" }}>
                    <input type="checkbox" id="swal2-checkbox" />
                    <span className="swal2-label"></span>
                </label>

                <textarea id="swal2-textarea" className="swal2-textarea" style={{ display: "none" }}></textarea>
                <div className="swal2-validation-message" id="swal2-validation-message" style={{ display: "none" }}></div>
                <div className="swal2-footer" style={{ display: "none" }}></div>
                <div className="swal2-timer-progress-bar-container">
                    <div className="swal2-timer-progress-bar" style={{ display: "none" }}></div>
                </div>
            </div>
        </div>
        

    );
}
