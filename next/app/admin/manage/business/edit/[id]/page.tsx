'use client'

import Select, { SingleValue } from 'react-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import { fetchAdminPartnerDetail, updatePartner, deletePartner } from '@/lib/apis/admin';
import { PartnerResponse, PartnerRequest } from '@/types/partner';
import { OptionType, SelectBusinessTypeOptions } from '@/types/select';
import { fetchBusinessCheck } from '@/lib/apis/common';
import { usernameRegex, emailRegex, passwordRegex, phoneRegex } from '@/utils/regex';


export default function AdminPartnerEdit({ params }: { params: Promise<{ id: string }> }) {

	//params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
	//searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
	const { id } = use(params);
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryString = (searchParams as unknown as URLSearchParams).toString();

	const nameInputRef = useRef<HTMLInputElement>(null);
	const [partner, setPartner] = useState<PartnerResponse | null>(null);
	const [pwRe, setPwRe] = useState("");

	//*** 2. 사업자등록번호 체크 
	const [businessCheck, setBusinessCheck] = useState(false); //사업자번호 정상인지, 비정상인지
	const [bizButtonCheck, setBizButtonCheck] = useState(false); //사업자번호 조회 버튼을 클릭했는지
	const [bizCheckResult, setBizCheckResult] = useState<string | null>(null); //조회후 결과 메세지


	//*** 2. 사업자번호 확인 핸들들러(API)
	const handleBisunissCheck = async () => {
		const total = await fetchBusinessCheck(partner?.businessRegistrationNo ?? '');
		setBusinessCheck(total > 0 ? true : false);
		setBizButtonCheck(true);
		setBizCheckResult(total > 0 ? '유효한 사업자입니다' : '유효하지 않습니다. 다시 입력후 조회해 주세요.');
	};

	const [selectedOptionValue, setSelectedOptionValue] = useState<OptionType | null>(null);


	//useEffect
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchAdminPartnerDetail(id);
				setPartner(result.value);
				//업종 selectbox
				const selectedOption = SelectBusinessTypeOptions.find(
					(option) => option.value === result.value.businessType
				);
				setSelectedOptionValue(selectedOption || null); //selectbox default 값 설정
			} catch (error) {
				console.error("데이터 가져오기 실패:", error);
			}
		};
		fetchData();
	}, [id]);

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
			if (confirm("정말 탈퇴 하시겠습니까?")) {
				//사업자탈퇴 API 호출
				const result = await deletePartner(partner?.partnerId ?? '');
				if (result.success) {
					alert(`사업자 정보를 탈퇴처리 하였습니다.`);
					window.location.href = '../list'; //페이지 이동
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
			if (!partner?.partnerName.trim()) {
				alert('상호명을 입력해주세요.');
				return;
			}
			if ((partner?.partnerPassword || '').trim() && pwRe.trim()) {
				if (!passwordRegex.test(partner?.partnerPassword || '')) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
					alert('비밀번호 형식이 올바르지 않습니다.\n(영문/숫자/특수문자 포함, 8자 이상)');
					return;
				}
				if (partner?.partnerPassword != pwRe) { //비밀번호 검증	영문/숫자/특수문자 포함, 8자 이상
					alert('비밀번호가 서로 일치 하지 않습니다.');
					return;
				}
			}
			if (!emailRegex.test(partner?.email ?? '')) { //이메일 검증	@ 포함, 일반 이메일 형식
				alert('이메일 형식이 올바르지 않습니다.\n(@ 포함, 일반 이메일 형식)');
				return;
			}
			if (!phoneRegex.test(partner?.phone ?? '')) { //휴대폰 번호 검증	숫자만, 010으로 시작, 10~11자
				alert('연락처 형식이 올바르지 않습니다.\n(010/011 등으로 시작, 숫자만, 10~11자리)');
				return;
			}
			if (!(partner?.address ?? '').trim()) {
				alert('우편번호를 클릭해주세요.');
				return;
			}
			if (!(partner?.addressDetail ?? '').trim()) {
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
				region: partner?.address.slice(0, 2),
				address: partner?.address || '',
				addressDetail: partner?.addressDetail || '',
				postalCode: partner?.postalCode || '',
				partnerType: partner?.partnerType || 1,
			}
			//console.log(newPartner)

			//사업자수정 API 호출
			const result = await updatePartner(newPartner);
			if (result.success) {
				alert(`사업자 정보를 수정 하였습니다.`);
				router.push(`../list?${queryString}`); //페이지 이동
			} else {
				alert(result.message);
				return;
			}

		} catch (err) {
			alert('사업자 정보 수정 실패');
		}
	}

	return (
		<>
			<div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
				<div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
					<div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">사업자회원 수정</h1>
						<ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
							<li className="breadcrumb-item text-muted">
								<a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
							</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">사업자회원관리 </li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">사업자회원 수정</li>
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
											ref={nameInputRef}
											onChange={e => setPartner(prev => ({ ...prev!, partnerName: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label required">사업자등록번호</label> {bizCheckResult && <span className="text-primary">- {bizCheckResult}</span>}
										<div className="d-flex">
											<input value={partner?.businessRegistrationNo ?? ''} className="form-control form-control-lg form-control-solid me-3"
												name="businessRegistrationNo" type="text"
												placeholder="숫자만 10자리 입력"
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													setPartner(prev => ({ ...prev!, businessRegistrationNo: e.target.value.replace(/\D/g, '') })) // 숫자 외 문자 제거
													setBusinessCheck(false);
													setBizButtonCheck(false);
												}}
											/>
											<button onClick={handleBisunissCheck} type="button" className="btn btn-outline text-nowrap">조회하기</button>
										</div>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label required">아이디</label>
										<span className="text-primary">- 수정불능</span>
										<div className="d-flex">
											<input name="partnerId" className="form-control form-control-solid me-3" readOnly
												value={partner?.partnerId ?? ''} type="input"
											/>
										</div>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label">비밀번호</label>
										<input className="form-control form-control-lg form-control-solid"
											placeholder="8~12자의 영문, 숫자, 특수문자 중 2가지 이상으로만 가능합니다."
											type="password" name="partnerPassword"
											onChange={e => setPartner(prev => ({ ...prev!, partnerPassword: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="form-label">비밀번호 확인</label>
										<input className="form-control form-control-lg form-control-solid"
											placeholder="비밀번호를 한번 더 입력해 주세요."
											type="password" name="pwRe"
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPwRe(e.target.value) }}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">구분</label>
										<div className="d-flex align-items-center mt-3">
											<label className="form-check form-check-custom form-check-inline form-check-solid me-5">
												<input name="partnerType" type="radio" className="form-check-input me-3" id="kt_modal_update_role_option_0"
													checked={partner?.partnerType === 1}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPartner(prev => ({ ...prev!, partnerType: 1 })) }} />
												<span className="fw-semibold ps-2 fs-6">일반</span>
											</label>
											<label className="form-check form-check-custom form-check-inline form-check-solid">
												<input name="partnerType" type="radio" className="form-check-input me-3" id="kt_modal_update_role_option_1"
													checked={partner?.partnerType === 2}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPartner(prev => ({ ...prev!, partnerType: 2 })) }} />
												<span className="fw-semibold ps-2 fs-6">인플루엔서</span>
											</label>
										</div>
									</div>
									<div className="fv-row mb-10">
										<label className="fs-6 fw-semibold form-label required">Email </label>
										<input className="form-control form-control-lg form-control-solid" placeholder="이메일 주소 (@포함)"
											name="email" value={partner?.email ?? ''}
											onChange={e => setPartner(prev => ({ ...prev!, email: e.target.value }))}
										/>
									</div>
									<div className="fv-row mb-10">
										<label className="fs-6 fw-semibold form-label required">연락처</label>
										<input className="form-control form-control-lg form-control-solid" placeholder="연락처를 입력해 주세요."
											name="phone" value={partner?.phone ?? ''}
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
												//console.log(selected?.value); // 선택된 값
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
												type="text" name="postalCode" value={partner?.postalCode ?? ''}
												onChange={e => setPartner(prev => ({ ...prev!, postalCode: e.target.value }))}
												readOnly
											/>
											<button type="button" onClick={openPostcode}
												className="btn btn-outline text-nowrap">우편번호 검색</button>
										</div>
										<input className="form-control form-control-solid me-3 mb-3" placeholder=""
											type="text" name="address" value={partner?.address ?? ''}
											onChange={e => setPartner(prev => ({ ...prev!, address: e.target.value }))}
											readOnly

										/>
										<input className="form-control form-control-solid me-3" placeholder="상세주소를 입력해주세요."
											type="text" name="addressDetail" value={partner?.addressDetail ?? ''}
											onChange={e => setPartner(prev => ({ ...prev!, addressDetail: e.target.value }))}
										/>
									</div>
								</div>
							</div>
							<div className="card-footer d-flex justify-content-end py-6 px-9">
								<button type="button" onClick={handleDelete} className="btn btn-light btn-active-light-primary me-2">탈퇴</button>
								<button type="button" onClick={handleSubmit} className="btn btn-primary  me-2" id="kt_account_profile_details_submit">수정</button>
								<button type="button" onClick={() => {
									router.push(`../list?${queryString}`); //페이지 이동
								}} className="btn btn-light btn-active-light-primary me-2">목록</button>





							</div>
						</form>
					</div>
				</div>
			</div>

		</>

	);
}




