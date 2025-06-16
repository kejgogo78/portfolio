'use client'

import Select, { SingleValue } from 'react-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { PartnerResponse, PartnerRequest } from '@/types/partner';
import { OptionType, SelectBusinessTypeOptions } from '@/types/select';
import { emailRegex, passwordRegex, phoneRegex } from '@/utils/regex';
import { fetchPartnerDetail, updatePartner, deletePartner } from '@/lib/apis/partner';
import { getCookieBusinessId, removeBusinessTokensCookies } from '@/lib/businessAuth';


export default function PartnerEdit() {

	//params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
	//searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
	const partnerId = getCookieBusinessId() + '';
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryString = (searchParams as unknown as URLSearchParams).toString();

	const nameInputRef = useRef<HTMLInputElement>(null);
	const [partner, setPartner] = useState<PartnerResponse | null>(null);
	var [pwRe, setPwRe] = useState("");

	const [selectedOptionValue, setSelectedOptionValue] = useState<OptionType | null>(null);
	
    //useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchPartnerDetail(partnerId);
				setPartner(result.value);
				//업종 selectbox
				const selectedOption = SelectBusinessTypeOptions.find(
					(option) => option.value === result.value.businessType
				);
				setSelectedOptionValue(selectedOption||null); //selectbox default 값 설정
			} catch (error) {
				console.error("데이터 가져오기 실패:", error);
			}
		};
		fetchData();
	}, [partnerId]);

	//focus 타이밍 (상세주소) 를 위한(다음 우편번호)
	const addr2Ref = useRef<HTMLInputElement>(null); // DOM 요소를 addr2Ref에에 할당
	
	//우편번호 클릭시 (다음 우편번호 팝업 띄움)
	const openPostcode = () => {
		const { daum } = window as any;
		new daum.Postcode({
			oncomplete: (data: { zonecode: string, address: string }) => {
				setPartner(prev => ({ ...prev!, postalCode: data.zonecode }))
				setPartner(prev => ({ ...prev!, address: data.address }))
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

	
	const handleDelete = async () => {
		try {
			if(confirm("정말 탈퇴 하시겠습니까?")) {
				//사업자탈퇴 API 호출
				const result = await deletePartner();
				if (result.success) {
					alert(`사업자 정보를 탈퇴처리 하였습니다.`);
					removeBusinessTokensCookies();
					//setUser(null);
					window.location.href = '/business/login'; //페이지 이동
				} else {
					alert(result.message);
					return;
				}
			}
		} catch (err) {
			alert('사업자 정보 탈퇴 실패');
		}

	}
	//사업자수정 버튼 클릭 핸들러 (handleSubmit)
	const handleSubmit = async () => {
		try {
			console.log(partner?.partnerPassword);
			if ((partner?.partnerPassword || '').trim() && pwRe.trim()) {
				if (!passwordRegex.test(partner?.partnerPassword??'')) { //비밀번호 검증
					alert('비밀번호 형식이 올바르지 않습니다.\n(영문/숫자/특수문자 포함, 8자 이상)');
					return;
				}
				if (partner?.partnerPassword != pwRe) { //비밀번호 검증
					alert('비밀번호가 서로 일치 하지 않습니다.');
					return;
				}
			}
			if (!emailRegex.test(partner?.email??'')) { //이메일 검증	@ 포함, 일반 이메일 형식
                alert('이메일 형식이 올바르지 않습니다.\n(@ 포함, 일반 이메일 형식)');
                return;
            }
            if (!phoneRegex.test(partner?.phone??'')) { //휴대폰 번호 검증	숫자만, 010으로 시작, 10~11자
                alert('연락처 형식이 올바르지 않습니다.\n(010/011 등으로 시작, 숫자만, 10~11자리)');
                return;
            }
            if (!partner?.address.trim()) {
                alert('우편번호를 클릭해주세요.');
                return;
            }
            if (!partner?.addressDetail.trim()) {
                alert('상세주소를 입력해주세요');
                return;
            }
			
			const newPartner: PartnerRequest = {
				partnerName: partner?.partnerName || '',
				partnerId: partner?.partnerId || '',
				partnerPassword: partner?.partnerPassword || '',
				businessRegistrationNo: partner?.businessRegistrationNo || '',
				phone: partner?.phone || '',
				email: partner?.email || '',
				businessType: partner?.businessType || '',
				region: partner?.address.slice(0, 2) || '',
				address: partner?.address || '',
				addressDetail: partner?.addressDetail || '',
				postalCode: partner?.postalCode || '',
				partnerType: partner?.partnerType || 1,
			}
			//console.log("----------------------------", newPartner)

			//사업자수정 API 호출
			const result = await updatePartner(newPartner);
			if (result.success) {
				alert(`사업자 정보를 수정 하였습니다.`);
				router.push(`/business/manage/edit`); //페이지 이동
			} else {
				alert(result.message);
				return;
			}

		} catch (err) {
			alert('사업자 정보 수정 실패');
		}
	};

	return (
		<>
			<div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
				<div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
					<div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">정보수정</h1>
						<ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
							<li className="breadcrumb-item text-muted">
								<a href="/business/manage" className="text-muted text-hover-primary">Home</a>
							</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">정보수정</li>
						</ul>
					</div>
				</div>
			</div>
			<div id="kt_app_content" className="app-content flex-column-fluid">
				<div id="kt_app_content_container" className="app-container container-xxl">
					<div className="card mb-5 mb-xl-10">
						<form id="kt_account_profile_details_form" className="form">
							<div id="kt_account_settings_profile_details" className="collapse show">
								<div className="card-body border-top p-9">
									<div className="fv-row mb-10">
										<label className="form-label required">상호</label>
										<input name="partnerName" type="text" className="form-control form-control-lg form-control-solid"
											placeholder="상호입력" value={partner?.partnerName || ''}
											onChange={e => setPartner(prev => ({ ...prev!, partnerName: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label required">사업자등록번호</label> <span className="text-primary">- 수정불능 (관리자에게 문의하세요.)</span>
										<div className="d-flex">
											<input value={partner?.businessRegistrationNo??''} className="form-control form-control-lg form-control-solid me-3" readOnly />
										</div>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label required">아이디</label> <span className="text-primary">- 수정불능 </span>
										<div className="d-flex">
											<input name="business_type" className="form-control form-control-solid me-3" readOnly value={partner?.partnerId??''} />
										</div>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label">비밀번호</label> <span className="text-primary">- 수정이 필요한 경우만 입력해 주세요.</span>
										<input className="form-control form-control-lg form-control-solid"
											placeholder="8~12자의 영문, 숫자, 특수문자 중 2가지 이상으로만 가능합니다."
											type="password" name="partnerPassword" 
											onChange={e => setPartner(prev => ({ ...prev!, partnerPassword: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label">비밀번호 확인</label> <span className="text-primary">- 수정이 필요한 경우만 입력해 주세요.</span>
										<input className="form-control form-control-lg form-control-solid"
											placeholder="비밀번호를 한번 더 입력해 주세요."
											type="password" name="pwRe" 
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPwRe(e.target.value) }}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="fs-6 fw-semibold form-label required">Email </label>
										<input className="form-control form-control-lg form-control-solid" placeholder="이메일 주소 (@포함)"
											name="email" value={partner?.email??''}
											onChange={e => setPartner(prev => ({ ...prev!, email: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="fs-6 fw-semibold form-label required">연락처</label>
										<input className="form-control form-control-lg form-control-solid" placeholder="입력해 주세요."
											name="phone" value={partner?.phone??''}
											onChange={e => setPartner(prev => ({ ...prev!, phone: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="fs-6 fw-semibold form-label required">사업분야</label>
										<Select<OptionType>
											options={SelectBusinessTypeOptions}
											placeholder="업종선택"
											value={selectedOptionValue}
											isSearchable={false}
											onChange={(selected: SingleValue<OptionType>) => {
												console.log(selected?.value); // 선택된 값
												setSelectedOptionValue(selected); // 상태 반영
												const value = selected?.value?.toString() || '';
												setPartner(prev => ({ ...prev!, businessType: value })) //파트너 정보 담기기
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
											<input className="form-control form-control-solid me-3" placeholder=""
												type="text" name="postalCode" value={partner?.postalCode??''}
												onChange={e => setPartner(prev => ({ ...prev!, postalCode: e.target.value }))}
												readOnly
											/>
											<button type="button" onClick={openPostcode} className="btn btn-outline text-nowrap">우편번호 검색</button>
										</div>
										<input className="form-control form-control-solid me-3 mb-3" placeholder=""
											type="text" name="address" value={partner?.address??''}
											onChange={e => setPartner(prev => ({ ...prev!, address: e.target.value }))}
											readOnly

										/>
										<input className="form-control form-control-solid me-3" placeholder="상세주소를 입력해주세요."
											type="text" name="addressDetail" value={partner?.addressDetail??''}
											onChange={e => setPartner(prev => ({ ...prev!, addressDetail: e.target.value }))}
										/>
									</div>
								</div>
							</div>
							<div className="card-footer d-flex justify-content-end py-6 px-9">
								<button type="button" onClick={handleDelete} className="btn btn-light btn-active-light-primary me-2">탈퇴</button>
								<button type="button" onClick={handleSubmit} className="btn btn-primary" id="register">수정</button>
							</div>
						</form>
					</div>
				</div>
			</div>

		</>

	);
}