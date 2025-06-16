'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Coupon, CouponProduct } from '@/types/coupon';
import { Partner } from '@/types/partner';
import { dateRegex, discountRegex } from '@/utils/regex';
import { getToday, getNextDay, hasText, rangeDate } from '@/utils/common';
import { createCoupon, fetchPartnersAll } from '@/lib/apis/admin';


import "../../../../css/fullcalendar.bundle.css";
import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";

export default function AdminCouponAdd() {

	let router = useRouter()

	const nameInputRef = useRef<HTMLInputElement>(null);

	const [partnerId, setPartnerId] = useState("");
	const [couponName, setCouponName] = useState("");
	const [discountRate, setDiscountRate] = useState(0);
	const [templateType, setTemplateType] = useState(1);
	const [usageStartDate, setUsageStartDate] = useState(getToday);
	const [usageEndDate, setUsageEndDate] = useState(getNextDay(6));
	const [issueStartDate, setIssueStartDate] = useState(getToday);
	const [issueEndDate, setIssueEndDate] = useState(getNextDay(6));
	const [benefitDescription, setBenefitDescription] = useState("");
	const [isUsable, setIsUsable] = useState("USABLE");
	const [isIssue, setIsIssue] = useState("N"); //발급여부
	const [partners, setPartners] = useState<Partner[]>([]);
	const [productNames, setProductNames] = useState<string[]>([]);
	const [couponProducts, setCouponProducts] = useState<CouponProduct[]>([])

	//쿠폰상품에 재배열 
	const couponProductsUpdate = () => {
		const names = couponProducts.map(p => p.name.trim()).filter(name => name.length > 0)
		setProductNames(prev => ({ ...prev!, productNames: names }))

		console.log("상품 등록 내용 (productNames) :  ", names);
	}

	//상품 추가 
	const addProduct = () => {
		/*
		if (couponProducts.length >= 5) {
			alert("최대 5개까지 입력 가능합니다.")
			return
		}*/
		const newProduct: CouponProduct = {
			id: Date.now(),
			name: ''
		}
		setCouponProducts([...couponProducts, newProduct])
		couponProductsUpdate()
	}
	//상품 삭제 
	const removeProduct = (id: number) => {
		setCouponProducts(couponProducts.filter(product => product.id !== id))
		couponProductsUpdate()
	}
	//상품 입력 
	const handleProductChange = (id: number, value: string) => {
		console.log("id, value : ", id + "," + value)
		setCouponProducts(couponProducts.map(product =>
			product.id === id ? { ...product, name: value } : product
		))
		couponProductsUpdate()
	}

	useEffect(() => {
		// 사업자 데이터 조회
		const fetchData = async () => {
			const result = await fetchPartnersAll();
			if (result.success) {
				//console.log("받아온 내용 : ", result.value)
				setPartners(result.value);
			} else {
				console.log(result.message);
				return;
			}
		};

		fetchData();
	}, []);


	//쿠폰등록 버튼 클릭 핸들러 (handleSubmit)
	const handleSubmit = async () => {
		try {
			//nameInputRef.current?.focus(); /*********** 이름에 포커스 ******************* */
			if (!partnerId) {
				alert('사업자를 선택해 주세요.');
				return false;
			}
			if (!hasText(couponName)) {
				alert('쿠폰명을 입력해주세요.');
				return;
			}
			if (!dateRegex.test(usageStartDate)) { //시작일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(usageEndDate)) { //마지막일 검증
				alert('사용기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(issueStartDate)) { //시작일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!dateRegex.test(issueEndDate)) { //마지막일 검증
				alert('발급기간 형식이 올바르지 않습니다.');
				return;
			}
			if (!discountRegex.test(String(Number(discountRate)))) { //할인율
				alert('할인율은 (0~100) 입니다. 형식이 올바르지 않습니다.');
				return;
			}
			const usageSDate = new Date(usageStartDate);
			const usageEDate = new Date(usageEndDate);
			const issueSDate = new Date(issueStartDate);
			const issueEDate = new Date(issueEndDate);

			if (usageSDate > usageEDate) {
				alert('사용기간 시작일은 종료일보다 늦을 수 없습니다.');
				return false;
			}

			if (issueSDate > issueEDate) {
				alert('발급기간 시작일은 종료일보다 늦을 수 없습니다.');
				return false;
			}

			if (usageEDate < issueEDate) {
				alert('사용기간 종료일은 발급기간 종료일보다 같거나 늦어야 합니다.');
				return false;
			}

			if (usageSDate < issueSDate) {
				alert('사용기간 시작일은 발급기간 시작일보다 같거나 늦어야 합니다.');
				return false;
			}
			/*
			//상품 최소 한개 이상 입력
			const names = couponProducts.map(p => p.name.trim()).filter(name => name.length > 0)
			if (names.length === 0) {
				alert("최소 한 개 이상의 상품명을 입력해주세요.")
				return
			}*/
			const names = couponProducts.map(p => p.name.trim()).filter(name => name.length > 0)
			const newCoupon: Coupon = {
				partnerId: partnerId,
				couponName: couponName,
				discountRate: discountRate,
				templateType: templateType,
				usageStartDate: usageStartDate,
				usageEndDate: usageEndDate,
				issueStartDate: issueStartDate,
				issueEndDate: issueEndDate,
				benefitDescription: benefitDescription,
				isUsable: "USABLE",
				isIssue: "N",
				issueDate: "",
				productNames: names,
			}
			//쿠폰등록 API 호출
			const result = await createCoupon(newCoupon);
			if (result.success) {
				alert(`쿠폰을 생성 하였습니다.`);
				router.push("./list"); //페이지 이동
			} else {
				alert(result.message);
				return;
			}
		} catch (err) {
			alert('쿠폰생성 실패');
		}
	};

	const handleRangeDateClick = (dateType: string, rangeType: string) => {

		//날짜 범위 구하기 
		const { startDate, endDate } = rangeDate(rangeType)

		if (dateType === 'usage') {
			setUsageStartDate(startDate);
			setUsageEndDate(endDate);
		} else {
			setIssueStartDate(startDate);
			setIssueEndDate(endDate);
		}
	}

	return (
		<>
			<div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
				<div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
					<div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
						<h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰등록</h1>
						<ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
							<li className="breadcrumb-item text-muted">
								<a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
							</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">쿠폰관리</li>
							<li className="breadcrumb-item">
								<span className="bullet bg-gray-400 w-5px h-2px"></span>
							</li>
							<li className="breadcrumb-item text-muted">쿠폰등록</li>
						</ul>
					</div>
				</div>
			</div>
			<div id="kt_app_content" className="app-content flex-column-fluid">
				<div id="kt_app_content_container" className="app-container container-xxl">
					<div className="card mb-5 mb-xl-10">
						<div id="kt_account_settings_profile_details" className="collapse show">
							<form id="kt_account_profile_details_form" className="form">
								<div className="card-body border-top p-9">
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">상호</label>
										<div className="col-lg-8 fv-row">
											<select name="partnerId" value={partnerId}
												className="form-select form-select-solid"
												onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
													setPartnerId(e.target.value)
												}}
											>
												<option value="">선택</option>
												{partners.map((m, i) => (
													<option value={m.partnerId} key={i}>{m.partnerName} ({m.partnerId})</option>
												))}
											</select>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰명</label>
										<div className="col-lg-8 fv-row">
											<input type="text" name="couponName" className="form-control form-control-lg form-control-solid" placeholder=""
												value={couponName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCouponName(e.target.value) }} />
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">할인율</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="number" name="discountRate" className="form-control form-control-lg form-control-solid mb-3 mb-lg-0" placeholder="숫자만 입력"
														value={discountRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDiscountRate(parseFloat(e.target.value)) }} />
												</div>
												<span className="col-lg-1 fw-semibold pt-7">%</span>
											</div>
										</div>
									</div>

									{/*--------------------------------------------------------------------*/}
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">상품명</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<button type="button" onClick={addProduct} className="btn btn-primary">상품추가</button>
												</div>
											</div>
										</div>
									</div>
									{couponProducts.map((product, index) => (
										<div className="row mb-6" key={product.id}>
											<label className="col-lg-4 col-form-label fw-semibold fs-6">{/*상품명*/}</label>
											<div className="col-lg-8">
												<div className="row">
													<div className="col-lg-6 fv-row">
														<input type="text" className="form-control form-control-lg form-control-solid mb-3 mb-lg-0" placeholder="상품명 입력"
															value={product.name}
															onChange={(e) => handleProductChange(product.id, e.target.value)}
														/>
													</div>
													<span className="col-lg-1 fw-semibold pt-7" onClick={() => removeProduct(product.id)}>삭제</span>
												</div>
											</div>
										</div>
									))}
									{/*--------------------------------------------------------------------*/}

									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">템플릿 선택</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6">
													<input type="radio" className="btn-check" name="templateType" value="1" checked={templateType === 1} id="kt_create_account_form_account_type_personal"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value)) }} />
													<label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_personal">
														<i className="ki-duotone ki-badge fs-3x me-5">
															<span className="path1"></span>
															<span className="path2"></span>
															<span className="path3"></span>
															<span className="path4"></span>
															<span className="path5"></span>
														</i>
														<span className="d-block fw-semibold text-start">
															<span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
															<span className="text-muted fw-semibold fs-6">사용기간 : {usageStartDate.replace(/-/g, '.')}~{usageEndDate.replace(/-/g, '.')}</span>
														</span>
													</label>
												</div>
												<div className="col-lg-6">
													<input type="radio" className="btn-check" name="templateType" value="2" checked={templateType === 2} id="kt_create_account_form_account_type_corporate"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTemplateType(parseFloat(e.target.value)) }} />
													<label className="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center" htmlFor="kt_create_account_form_account_type_corporate">
														<i className="ki-duotone ki-briefcase fs-3x me-5">
															<span className="path1"></span>
															<span className="path2"></span>
														</i>
														<span className="d-block fw-semibold text-start">
															<span className="text-dark fw-bold d-block fs-4 mb-2">상품명 및 할인율</span>
															<span className="text-muted fw-semibold fs-6">사용기간 : {usageStartDate.replace(/-/g, '.')}~{usageEndDate.replace(/-/g, '.')}</span>
														</span>
													</label>
												</div>
											</div>
										</div>
									</div>
									{/*--------------------------------------------------------------------*/}
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">사용기간</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="date" className="form-control form-control-solid" name="usageStartDate" placeholder="Pick a start date" id="kt_calendar_datepicker_start_date"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageStartDate(e.target.value) }}
														value={usageStartDate} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" className="form-control form-control-solid" name="usageEndDate" placeholder="Pick a end date" id="kt_calendar_datepicker_end_date"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUsageEndDate(e.target.value) }}
														value={usageEndDate} />
												</div>
											</div>
											<div className="nav-group nav-group-fluid mt-2">
												<label>
													<input type="radio" className="btn-check" name="type" value="has" onClick={() => handleRangeDateClick('usage', '7days')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">07일</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type" value="users" onClick={() => handleRangeDateClick('usage', '15days')} />

													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">15일</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type" value="month" onClick={() => handleRangeDateClick('usage', '1month')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">1개월</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type" value="3month" onClick={() => handleRangeDateClick('usage', '3months')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">3개월</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type" value="6month" onClick={() => handleRangeDateClick('usage', '6months')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">6개월</span>
												</label>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">발급기간</label>
										<div className="col-lg-8">
											<div className="row">
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueStartDate" className="form-control form-control-solid" placeholder="Pick a start date" id="kt_calendar_datepicker_start_date01"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueStartDate(e.target.value) }}
														value={issueStartDate} />
												</div>
												<div className="col-lg-6 fv-row">
													<input type="date" name="issueEndDate" className="form-control form-control-solid" placeholder="Pick a end date" id="kt_calendar_datepicker_end_date01"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIssueEndDate(e.target.value) }}
														value={issueEndDate} />
												</div>
											</div>
											<div className="nav-group nav-group-fluid mt-2">
												<label>
													<input type="radio" className="btn-check" name="type1" value="has" onClick={() => handleRangeDateClick('issue', '7days')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">07일</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type1" value="users" onClick={() => handleRangeDateClick('issue', '15days')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">15일</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type1" value="month" onClick={() => handleRangeDateClick('issue', '1month')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">1개월</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type1" value="3month" onClick={() => handleRangeDateClick('issue', '3months')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">3개월</span>
												</label>
												<label>
													<input type="radio" className="btn-check" name="type1" value="6month" onClick={() => handleRangeDateClick('issue', '6months')} />
													<span className="btn btn-sm btn-color-muted btn-active btn-active-primary fw-bold px-4">6개월</span>
												</label>
											</div>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label fw-semibold fs-6">혜택내용</label>
										<div className="col-lg-8 fv-row">
											<textarea className="form-control form-control-solid" rows={3}
												name="benefitDescription" placeholder="내용 입력" value={benefitDescription}
												onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBenefitDescription(e.target.value)}></textarea>
										</div>
									</div>
									<div className="row mb-6">
										<label className="col-lg-4 col-form-label required fw-semibold fs-6">쿠폰 사용여부</label>
										<div className="col-lg-8 fv-row">
											<div className="d-flex align-items-center mt-3">
												<label className="form-check form-check-custom form-check-inline form-check-solid me-5">
													<input name="isUsable" type="radio" value="USABLE" checked={isUsable === 'USABLE'} className="form-check-input me-3" id="kt_modal_update_role_option_0"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value) }} />
													<span className="fw-semibold ps-2 fs-6">사용</span>
												</label>
												<label className="form-check form-check-custom form-check-inline form-check-solid">
													<input name="isUsable" type="radio" value="NOT_USABLE" checked={isUsable === 'NOT_USABLE'} className="form-check-input me-3" id="kt_modal_update_role_option_1"
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setIsUsable(e.target.value) }} />
													<span className="fw-semibold ps-2 fs-6">사용불가</span>
												</label>
											</div>
										</div>
									</div>
								</div>
								<div className="card-footer d-flex justify-content-end py-6 px-9">
									<button type="button" onClick={handleSubmit} className="btn btn-primary me-2" id="kt_account_profile_details_submit">쿠폰생성</button>
									<button type="button" className="btn btn-light btn-active-light-primary"
										onClick={() => {
											router.push("./list"); //목록
										}}
									>목록</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}




