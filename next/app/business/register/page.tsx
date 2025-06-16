'use client'

import { useRouter } from 'next/navigation';
import Select, { SingleValue } from 'react-select';
import React, { useState, useEffect, useRef } from 'react';

import { Partner } from '@/types/partner';
import { useSignUpStore } from '@/stores/useSignUpStore';
import { OptionType, SelectBusinessTypeOptions } from '@/types/select';
import { register, fetchBusinessIdCheck, fetchBusinessCheck } from '@/lib/apis/common';
import { usernameRegex, emailRegex, passwordRegex, phoneRegex } from '@/utils/regex';
//import { saveTokens } from '@/lib/businessAuth';
//import { setCookieName } from '@/lib/cookies';

import "../../css/plugins.bundle.css";
import "../../css/style.bundle.css";
import { RFC_2822 } from 'moment';
//import "../../css/datatables.bundle.css";


//사업자 회원 동의->가입->확인완료
export default function BusinessAdd() {

    let router = useRouter()

    //단계
    var [step, setStep] = useState(1);

    //*** 1. 동의 체크 
    const [agreements, setAgreements] = useState({
        all: false,
        preferences: false,
        preferences1: false,
        preferences2: false,
    });
    const [collapsed, setCollapsed] = useState({
        preferences: true,
        preferences1: false,
        preferences2: false,
    });

    //*** 2. 사업자등록번호 체크 
    const [businessNumber, setBusinessNumber] = useState(""); //사업자등록번호
    const [businessCheck, setBusinessCheck] = useState(false); //사업자번호 정상인지, 비정상인지
    const [bizButtonCheck, setBizButtonCheck] = useState(false); //사업자번호 조회 버튼을 클릭했는지
    const [bizCheckResult, setBizCheckResult] = useState<string | null>(null); //조회후 결과 메세지

    //*** 2. 사업자번호 확인 핸들들러(API)
    const handleBisunissCheck = async () => {
        const total = await fetchBusinessCheck(businessNumber);
        setBusinessCheck(total > 0 ? true : false);
        setBizButtonCheck(true);
        setBizCheckResult(total > 0 ? '유효한 사업자입니다' : '유효하지 않습니다. 다시 입력후 조회해 주세요.');
    };

    //*** 2. 회원가입양식
    const [isFormatValid, setIsFormatValid] = useState<boolean | null>(null);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checkClicked, setCheckClicked] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    var [userId, setUserId] = useState("");
    var [businessName, setBusinessName] = useState(""); //회사명
    var [pw, setPw] = useState("");
    var [pwRe, setPwRe] = useState("");
    var [tel, setTel] = useState(""); //연락처
    var [email, setEmail] = useState(""); //이메일
    var [zipcode, setZipcode] = useState(""); //주소
    var [addr1, setAddr1] = useState("");
    var [addr2, setAddr2] = useState("");
    var [region, setRegion] = useState("");
    var [businessType, setBusinessType] = useState("");

    
    //1. 동의 체크박스 핸들러
    const handleAgreeCheckboxChange = (key: keyof typeof agreements) => {
        const newAgreements = {
            ...agreements,
            [key]: !agreements[key],
        };
        if (key === "all") {
            for (const k in agreements) {
                newAgreements[k as keyof typeof agreements] = !agreements.all;
            }
        } else {
            if (newAgreements.preferences && newAgreements.preferences1 && newAgreements.preferences2) {
                newAgreements["all"] = true;
            } else {
                newAgreements["all"] = false;
            }
        }
        setAgreements(newAgreements);
    };

    //*** 2. 회원가입 아이디 change시 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value; //아이디값값
        setUserId(value);
        setIsFormatValid(usernameRegex.test(value)); //문자열value가 정규 표현식 객체를 참조하는지(true) 아닌지(false)
        setIsAvailable(null); // 중복 상태 초기화
        setCheckClicked(false); // 중복 버튼 클릭 여부
    };

    //*** 2. 회원가입 아이디 중복확인 버튼 클릭시
    const checkDuplicate = async () => {
        setIsAvailable(false);
        if (!isFormatValid) { //정규식에 맞지 안을경우
            setIsFormatValid(false) //아이디 형식이 올바르지 않습니다.
            return;
        }
        //중복확인 api 호출
        const result = await fetchBusinessIdCheck(userId);
        if (result.success) {
            //alert("사용 가능한 사업자 아이디입니다!");
            setIsAvailable(true); // 가입가능
        } else {
            //alert(`사용 불가: ${result.message}`);
            setIsAvailable(false); // 가입불능
        }
        setCheckClicked(true); // 중복확인 버튼 클릭 완료
    };

    //*** 2. 회원가입 버튼 클릭 핸들러 (handleSubmit)
    const handleSubmit = async () => {
        try {
            if (!businessName.trim()) {
                alert('상호명을 입력해주세요.');
                return;
            }
            if (!isFormatValid) {
                alert('아이디 형식이 올바르지 않습니다.');
                return;
            }
            if (!checkClicked || isAvailable === false) {
                alert('아이디 중복 확인을 완료해주세요.');
                return;
            }
            if (!passwordRegex.test(pw)) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
                alert('비밀번호 형식이 올바르지 않습니다.\n(영문/숫자/특수문자 포함, 8자 이상)');
                return;
            }
            if (pw != pwRe) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
                alert('비밀번호가 서로 일치 하지 않습니다.');
                return;
            }
            if (!emailRegex.test(email)) { //이메일 검증	@ 포함, 일반 이메일 형식
                alert('이메일 형식이 올바르지 않습니다.\n(@ 포함, 일반 이메일 형식)');
                return;
            }
            if (!phoneRegex.test(tel)) { //휴대폰 번호 검증	숫자만, 010으로 시작, 10~11자
                alert('연락처 형식이 올바르지 않습니다.\n(010/011 등으로 시작, 숫자만, 10~11자리)');
                return;
            }
            if (!businessType.trim()) {
                alert('사업분야를 선택해주세요.');
                return;
            }
            if (!addr1.trim()) {
                alert('우편번호를 클릭해주세요.');
                return;
            }
            if (!addr2.trim()) {
                alert('상세주소를 입력해주세요');
                return;
            }

            const newPartner: Partner = {
                partnerName: businessName,      // 상호명
                partnerId: userId,      // 로그인 아이디
                partnerPassword: pw,    // 로그인 비밀번호
                businessRegistrationNo: businessNumber,
                phone: tel,		//전화번호
                email: email,              // 이메일
                businessType: businessType,  // 
                region: addr1.slice(0, 2), // 지역
                address: addr1,            // 주소1
                addressDetail: addr2,      // 주소2
                postalCode: zipcode,         // 우편번호
                partnerType: 1,
            };
            //회원가입 API 호출
            const result = await register(newPartner);
            if (result.success) {
                setStep(step + 1)
            } else {
                alert(result.message);
                return;
            }
        } catch (err) {
            alert('회원가입 실패');
        }
    };

    //focus 타이밍 (상세주소) 를 위한(다음 우편번호)
    const addr2Ref = useRef<HTMLInputElement>(null); // DOM 요소를 addr2Ref에에 할당

    //우편번호 클릭시 (다음 우편번호 팝업 띄움)
    const openPostcode = () => {
        const { daum } = window as any;
        new daum.Postcode({
            oncomplete: (data: { zonecode: string, address: string }) => {
                setZipcode(data.zonecode);
                setAddr1(data.address);
                //focus 타이밍 (상세주소)
                setTimeout(() => {
                    addr2Ref.current?.focus();
                }, 0);
            },
        }).open();
    };

    useEffect(() => {
        // 다음 우편번호 스크립트 삽입(다음 기본셋팅)
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;
        document.body.appendChild(script);
        
    }, []);

    useEffect(() => {
        //if (document.documentElement) {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        //}
    }, []);

    return (<>
        <body id="kt_body" className="app-blank app-blank">
            <div className="d-flex flex-column flex-root" id="kt_app_root">
                <div className="d-flex flex-column flex-lg-row flex-column-fluid stepper stepper-pills stepper-column stepper-multistep" id="kt_create_account_stepper">
                    <div className="d-flex flex-column flex-lg-row-auto w-lg-350px w-xl-500px">
                        <div className="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center" style={{ backgroundImage: "url(/images/login/auth-bg.png)" }}>
                            <div className="d-flex flex-center py-10 py-lg-20 mt-lg-20">
                                <a href="/business/manage">
                                    <img alt="Logo" src="/images/logo/default-dark.svg" className="h-40px" />
                                </a>
                            </div>
                            <div className="d-flex flex-row-fluid justify-content-center p-10">
                                <div className="stepper-nav">
                                    {/*<!--begin::Step 1 -->*/}
                                    <div className={`stepper-item ${step === 1 ? "current" : ""}`} data-kt-stepper-element="nav">
                                        <div className="stepper-wrapper">
                                            <div className="stepper-icon rounded-3">
                                                <i className="stepper-check fas fa-check"></i>
                                                <span className="stepper-number">1</span>
                                            </div>
                                            <div className="stepper-label">
                                                <h3 className="stepper-title fs-2">회원가입 약관</h3>
                                                <div className="stepper-desc fw-normal">KEES 사업자 회원가입 약관 동의</div>
                                            </div>
                                        </div>
                                        <div className="stepper-line h-40px"></div>
                                    </div>
                                    {/*<!--end::Step 1-->*/}
                                    {/*<!--begin::Step 2-->*/}
                                    <div className={`stepper-item ${step === 2 ? "current" : ""}`} data-kt-stepper-element="nav">
                                        <div className="stepper-wrapper">
                                            <div className="stepper-icon rounded-3">
                                                <i className="stepper-check fas fa-check"></i>
                                                <span className="stepper-number">2</span>
                                            </div>
                                            <div className="stepper-label">
                                                <h3 className="stepper-title fs-2">회원가입 정보입력</h3>
                                                <div className="stepper-desc fw-normal">사업자 정보 등 기본정보 입력 단계</div>
                                            </div>
                                        </div>
                                        <div className="stepper-line h-40px"></div>
                                    </div>
                                    {/*<!--end::Step 2-->*/}
                                    {/*<!--begin::Step 3-->*/}
                                    <div className={`stepper-item ${step === 3 ? "current" : ""}`} data-kt-stepper-element="nav">
                                        <div className="stepper-wrapper">
                                            <div className="stepper-icon">
                                                <i className="stepper-check fas fa-check"></i>
                                                <span className="stepper-number">3</span>
                                            </div>
                                            <div className="stepper-label">
                                                <h3 className="stepper-title fs-2">회원가입 완료</h3>
                                                <div className="stepper-desc fw-normal">회원가입 모든 절차 완료 화면</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!--end::Step 3-->*/}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column flex-lg-row-fluid py-10">
                        <div className="d-flex flex-column flex-column-fluid">
                            <div className="w-lg-650px w-xl-700px p-10 p-lg-15 mx-auto">
                                <form className="my-auto pb-5" noValidate id="kt_create_account_form">
                                    {/*<!--begin::Step 1-->*/}
                                    <div className={`${step === 3 ? "pending" : step === 2 ? "pending" : step === 1 ? "current" : ""}`}
                                        data-kt-stepper-element="content">
                                        <div className="w-100">
                                            <div className="pb-10 pb-lg-15">
                                                <h2 className="fw-bold text-dark">회원가입 약관</h2>
                                            </div>
                                            <div className="m-0 position-sm-relative">
                                                <input className="form-check-input me-3 position-sm-absolute" style={{ "top": "1.25rem" }}
                                                    type="checkbox" checked={agreements.preferences} onChange={() => handleAgreeCheckboxChange('preferences')}
                                                />
                                                <div className={`d-flex flex-stack collapsible py-3 toggle ${!collapsed.preferences ? " collapsed " : " "} mb-0`} data-bs-toggle="collapse" data-bs-target="#kt_job_1_1">
                                                    <h4 className="text-gray-700 fw-bold cursor-pointer mb-0 ps-9">이용약관 (필수)</h4>
                                                    <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary" onClick={() => { setCollapsed(prev => ({ ...prev, preferences: !collapsed.preferences })) }}>
                                                        <i className="ki-duotone ki-minus-square toggle-on text-primary fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                        </i>
                                                        <i className="ki-duotone ki-plus-square toggle-off fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                        </i>
                                                    </div>
                                                </div>
                                                <div id="kt_job_1_1" className={`collapse ${collapsed.preferences ? "  show " : " "} fs-6 ms-1`}>
                                                    <div className="mb-4 text-gray-600 fw-semibold fs-6 ps-10">본 약관은 언더핀(이하 ‘KEES’라 합니다)가 운영하는 KEES(https://www.kees.com/, 이하 ‘서비스’라 합니다)의 이용과 관련하여 KEES와 이용자 간의 권리, 의무, 책임사항 및 가입과 이용에 관한 제반 사항, 기타 필요한 사항을 구체적으로 규정함을 목적으로 합니다.</div>
                                                </div>
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="m-0 position-sm-relative">
                                                <input className="form-check-input me-3 position-sm-absolute" style={{ top: "1.25rem" }}
                                                    type="checkbox" checked={agreements.preferences1} onChange={() => handleAgreeCheckboxChange('preferences1')}
                                                />
                                                <div className={`d-flex flex-stack collapsible py-3 toggle ${!collapsed.preferences1 ? " collapsed " : " "} mb-0`} data-bs-toggle="collapse" data-bs-target="#kt_job_1_2">
                                                    <h4 className="text-gray-700 fw-bold cursor-pointer mb-0 ps-9">개인정보수집ㆍ이용에 대한 동의 (필수)</h4>
                                                    <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary" onClick={() => { setCollapsed(prev => ({ ...prev, preferences1: !collapsed.preferences1 })) }}>
                                                        <i className="ki-duotone ki-minus-square toggle-on text-primary fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                        </i>
                                                        <i className="ki-duotone ki-plus-square toggle-off fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                        </i>
                                                    </div>
                                                </div>
                                                <div id="kt_job_1_2" className={`collapse ${collapsed.preferences1 ? "  show " : " "} fs-6 ms-1`}>
                                                    <div className="mb-4 text-gray-600 fw-semibold fs-6 ps-10">본 약관은 언더핀(이하 ‘KEES’라 합니다)가 운영하는 KEES(https://www.kees.com/, 이하 ‘서비스’라 합니다)의 이용과 관련하여 KEES와 이용자 간의 권리, 의무, 책임사항 및 가입과 이용에 관한 제반 사항, 기타 필요한 사항을 구체적으로 규정함을 목적으로 합니다.</div>
                                                </div>
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="m-0 position-sm-relative">
                                                <input className="form-check-input me-3 position-sm-absolute" style={{ top: "1.25rem" }}
                                                    type="checkbox" checked={agreements.preferences2} onChange={() => handleAgreeCheckboxChange('preferences2')}
                                                />
                                                <div className={`d-flex flex-stack collapsible py-3 toggle ${!collapsed.preferences2 ? " collapsed " : " "} mb-0`} data-bs-toggle="collapse" data-bs-target="#kt_job_1_3">
                                                    <h4 className="text-gray-700 fw-bold cursor-pointer mb-0 ps-9">개인정보 처리 위탁 동의 (필수)</h4>
                                                    <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary" onClick={() => { setCollapsed(prev => ({ ...prev, preferences2: !collapsed.preferences2 })) }}>
                                                        <i className="ki-duotone ki-minus-square toggle-on text-primary fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                        </i>
                                                        <i className="ki-duotone ki-plus-square toggle-off fs-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                            <span className="path3"></span>
                                                        </i>
                                                    </div>
                                                </div>
                                                <div id="kt_job_1_3" className={`collapse ${collapsed.preferences2 ? " show " : " "} fs-6 ms-1`}>
                                                    <div className="mb-4 text-gray-600 fw-semibold fs-6 ps-10">본 약관은 언더핀(이하 ‘KEES’라 합니다)가 운영하는 KEES(https://www.kees.com/), 이하 ‘서비스’라 합니다)의 이용과 관련하여 KEES와 이용자 간의 권리, 의무, 책임사항 및 가입과 이용에 관한 제반 사항, 기타 필요한 사항을 구체적으로 규정함을 목적으로 합니다.</div>
                                                </div>
                                                <div className="separator separator-dashed"></div>
                                            </div>
                                            <div className="m-0 position-sm-relative">
                                                <div className="d-flex flex-end collapsible py-9 toggle collapsed mb-0">
                                                    <input className="form-check-input me-3" style={{ top: "2.25rem" }}
                                                        type="checkbox" checked={agreements.all} onChange={() => handleAgreeCheckboxChange('all')} />
                                                    <h4 className="text-gray-700 fw-bold cursor-pointer mb-0">전체동의</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!--end::Step 1-->*/}
                                    {/*<!--begin::Step 2-->*/}
                                    <div className={`${step === 3 ? "pending" : step === 2 ? "current" : step === 1 ? "completed" : ""}`}
                                        data-kt-stepper-element="content">
                                        <div className="w-100">
                                            <div className="pb-10 pb-lg-12">
                                                <h2 className="fw-bold text-dark">회원 정보입력</h2>
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="form-label required">상호</label>
                                                <input className="form-control form-control-lg form-control-solid"
                                                    name="businessName" placeholder="상호입력" value={businessName}
                                                    ref={nameInputRef} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setBusinessName(e.target.value) }} />
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="d-flex align-items-center form-label">
                                                    <label className="form-label required">사업자등록번호</label>
                                                    {bizCheckResult && <p style={{ color: "#E37272" }}>{bizCheckResult}</p>}
                                                </label>
                                                <div className="d-flex">
                                                    <input className="form-control form-control-lg form-control-solid me-3"
                                                        name="businessNumber" placeholder="숫자만 10자리 입력" value={businessNumber}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const input = e.target.value.replace(/\D/g, ''); // 숫자 외 문자 제거
                                                            setBusinessNumber(input);
                                                            setBusinessCheck(false);
                                                            setBizButtonCheck(false);
                                                        }}
                                                    />
                                                    <button onClick={handleBisunissCheck} type="button" className="btn btn-outline text-nowrap">조회하기</button>
                                                </div>
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="form-label required">아이디</label>
                                                
                                                    {isFormatValid === false && (
                                                        <span className="text-primary">
                                                        - 아이디는 영문으로 시작하고, 영문+숫자 조합 4~12자여야 합니다.
                                                        </span>
                                                    )}
                                                    {checkClicked && isAvailable === true && (
                                                        <span className="text-primary">
                                                        - 사용 가능한 아이디입니다.
                                                        </span>
                                                    )}
                                                    {checkClicked && isAvailable === false && (
                                                        <span className="text-primary">
                                                        - 이미 사용 중인 아이디입니다.
                                                        </span>
                                                    )}            


                                                
                                                <div className="d-flex">
                                                    <input className="form-control form-control-solid me-3" placeholder="영문, 숫자만 입력 6~15자리 입력"
                                                        name="userId" onChange={handleChange} value={userId} />
                                                    <button type="button" onClick={checkDuplicate} className="btn btn-outline text-nowrap">중복확인</button>
                                                    
                                                </div>
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="form-label">비밀번호</label>
                                                <input type="password" className="form-control form-control-lg form-control-solid" placeholder="8~12자의 영문, 숫자, 특수문자 중 2가지 이상으로만 가능합니다."
                                                    name="pw" value={pw} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPw(e.target.value) }} />
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="form-label">비밀번호 확인</label>
                                                <input type="password" className="form-control form-control-lg form-control-solid" placeholder="비밀번호를 한번 더 입력해 주세요."
                                                    name="pwRe" value={pwRe} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPwRe(e.target.value) }} />
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="d-flex align-items-center form-label">
                                                    <label className="form-label required">연락처</label>
                                                </label>
                                                <div className="d-flex">
                                                    <input className="form-control form-control-lg form-control-solid me-3"
                                                        name="tel" placeholder="숫자만 입력" value={tel}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            const input = e.target.value.replace(/\D/g, ''); // 숫자 외 문자 제거
                                                            setTel(input);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="fs-6 fw-semibold form-label required">Email</label>
                                                <input className="form-control form-control-lg form-control-solid"
                                                    name="email" placeholder="이메일 주소 (@포함)" value={email}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setEmail(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="fs-6 fw-semibold form-label required">사업분야</label>
                                                <Select<OptionType>
                                                    options={SelectBusinessTypeOptions}
                                                    placeholder="선택"
                                                    isSearchable={false}
                                                    onChange={(selected: SingleValue<OptionType>)=>{
                                                        //console.log(selected?.value); // 선택된 값
                                                        const value = selected?.value?.toString() || '';
                                                        setBusinessType(value);
                                                    }}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        borderRadius: 5,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25: '#e9ecef',
                                                            primary: '#ECECEE',
                                                            neutral0: '#fff', //option 기본색(흰색)
                                                            neutral80: 'e9ecef', //선택된 글자색
                                                        },
                                                    })}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            backgroundColor: '#F9F9F9',
                                                            borderColor: '#fff',
                                                            minHeight: '40px',
                                                            fontSize: '13px',
                                                        }),
                                                        option: (base, state) => ({
                                                            ...base,
                                                            backgroundColor: state.isSelected
                                                                ? '#F7F7F6' //선택시 배경색
                                                                : state.isFocused
                                                                    ? '#F7F7F6' //마우스오버시 배경색
                                                                    : 'transparent',
                                                            color: state.isSelected
                                                                ? '#3E97FF' // 선택시 글자색
                                                                : state.isFocused
                                                                    ? '#3E97FF' // hover 시 파란색 글자
                                                                    : '#808080', // 기본 글자색
                                                            fontWeight: 'normal',
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <div className="fv-row mb-10">
                                                <label className="form-label required">주소</label>
                                                <div className="d-flex mb-3">
                                                    <input type="text" name="zipcode" title="우편번호" id="zipcode" value={zipcode}  
                                                        className="form-control form-control-solid me-3" 
                                                        onChange={(e) => { setZipcode(e.target.value) }} readOnly
                                                    />
                                                    <button type="button" onClick={openPostcode} className="btn btn-outline text-nowrap">우편번호 검색</button>
                                                </div>
                                                <input type="text" name="addr1" id="addr1" value={addr1}
                                                    className="form-control form-control-solid me-3 mb-3" placeholder="" 
                                                    onChange={(e) => { setAddr1(e.target.value) }} readOnly
                                                />
                                                <input type="text" name="addr2" id="addr2" value={addr2} 
                                                    className="form-control form-control-solid me-3" placeholder="상세주소를 입력해주세요." 
                                                    onChange={(e) => { setAddr2(e.target.value) }}
                                                    ref={addr2Ref}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!--end::Step 2-->*/}
                                    {/*<!--begin::Step 3-->*/}
                                    <div className={`${step === 3 ? "current" : step === 2 ? "completed" : step === 1 ? "pending" : ""}`} data-kt-stepper-element="content">
                                        <div className="w-100">
                                            <div className="pb-8 pb-lg-10">
                                                <h2 className="fw-bold text-dark">완료되었습니다!</h2>
                                                <div className="text-muted fw-semibold fs-6">더 많은 정보가 필요하면
                                                    <a href="../../demo1/dist/authentication/layouts/corporate/sign-in.html" className="link-primary fw-bold">로그인</a>하세요.</div>
                                            </div>
                                            <div className="mb-0">
                                                <div className="fs-6 text-gray-600 mb-5">KEES사업자 로그인 후 쿠폰 발급, 통계 등 사업자 고객분들에게 유용한 정보를 활용 하실 수 있습니다. <br />계속해서 새로운 유용한 서비스가 추가될 예정입니다.</div>
                                                <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
                                                    <i className="ki-duotone ki-information fs-2tx text-warning me-4">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                    </i>
                                                    <div className="d-flex flex-stack flex-grow-1">
                                                        <div className="fw-semibold">
                                                            <h4 className="text-gray-900 fw-bold">여러분의 참여가 필요합니다!</h4>
                                                            <div className="fs-6 text-gray-700">KEES서비스를 사용 하시려면 바로
                                                                <a href="" className="fw-bold">로그인</a> 하세요
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<!--end::Step 3-->*/}

                                    {
                                        //step1 - 다음으로
                                        step === 1 ?
                                            <div className="d-flex flex-stack pt-15">
                                                <div className="mr-2"></div>
                                                <div>
                                                    <button type="button" className="btn btn-primary" onClick={() => {
                                                        //**** 2. 동의 체크 확인후 다음 step 으로 이동
                                                        for (const k in agreements) {
                                                            if (k != 'all' && !agreements[k as keyof typeof agreements]) {
                                                                alert("모두 동의 해주세요.");
                                                                return;
                                                            }
                                                        }
                                                        setStep(step + 1)
                                                    }} data-kt-indicator="off">
                                                        <span className="indicator-label">다음으로</span>
                                                        <span className="indicator-progress">Please wait...
                                                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div> : ""
                                    }
                                    {
                                        //step2 - 이전 , 다음으로
                                        step === 2 ?
                                            <div className="d-flex flex-stack pt-15">
                                                <div className="mr-2">
                                                    <button type="button" onClick={() => { setStep(step - 1) }} className="btn btn-light-primary">
                                                        <i className="ki-duotone ki-arrow-left fs-4 me-1">
                                                            <span className="path1"></span>
                                                            <span className="path2"></span>
                                                        </i>이전으로
                                                    </button>
                                                </div>
                                                <div>
                                                    <button type="button" className="btn btn-primary" 
                                                        onClick={handleSubmit} id="register" data-kt-indicator="off">
                                                        <span className="indicator-label">다음으로</span>
                                                        <span className="indicator-progress">Please wait...
                                                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div> : ""
                                    }
                                    {
                                        //step3 - 이전 , 로그인인
                                        step === 3 ?
                                            <div className="d-flex flex-stack pt-15">
                                                <div className="mr-2">
                                                    <a className="btn btn-lg btn-primary me-3" href="/business/login">로그인</a>
                                                </div>
                                            </div> : ""
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body></>
    );
}
