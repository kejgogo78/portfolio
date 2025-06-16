'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { CouponResponse } from '@/types/coupon';
import { SearchCoupon } from '@/types/search';
import { OptionType, SelectCouponSearchOptions, SelectCouponIsStateOptions } from '@/types/select';
import { fetchAdminCoupons, deleteCoupons } from '@/lib/apis/admin';
import DateRangePicker from "@/components/DateRangePicker";

import Pagination from '@/components/Pagination';
//import CouponTable from '@/components/table/CouponTable';
import CouponsExcel from '@/components/excel/CouponsExcel';


import Link from 'next/link';
import { formatTwoDateWithDot } from '@/utils/common';




import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";

export default function AdminCoupons() {

    const router = useRouter();
    const params = useSearchParams();
    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //한페이지에 뿌려질 데이타
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [isState, setIsState] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            isState: isState || '',
            startDate: startDate || '',
            endDate: endDate || '',
            page: String(1) || '1',
            pageSize: String(event.target.value) || '10',
        }).toString();
        window.location.href = `/admin/manage/coupon/list?${query}`;
    };

    //페이지 변경시(검색)
    const handlePageChange = (newPage: number = page) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            isState: isState || '',
            startDate: startDate || '',
            endDate: endDate || '',
            page: String(newPage) || '1',
            pageSize: String(pageSize) || '10',
        }).toString();
        window.location.href = `/admin/manage/coupon/list?${query}`;
    };

    //검색버튼 클릭시 (재검색)
    const handleSearchSubmit = () => {
        handlePageChange(1);
    }

    //검색범위 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        setSearchType(selected?.value || 'all');
    };

    //상태 검색 셀렉트 박스 선택시
    const handleIsStateChange = (selected: SingleValue<OptionType>) => {
        setIsState(selected?.value || '');
    };

    // 데이터 조회 함수
    const fetchData = async (search: SearchCoupon) => {
        setIsLoading(false);
        const result = await fetchAdminCoupons(search); //api 호출
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setCoupons(result.value.coupons);
            setTotal(result.value.total);
            setIsLoading(true);
        } else {
            console.log(result.message);
        }
    };

    //CouponTable 컴포넌트에서 delete 호출하면 실행(API연동및 재배열)
    const handleDeleteCoupons = async (ids: number[]) => {
        const result = await deleteCoupons(ids); //api 호출
        if (result.success) {
            alert("쿠폰들을 삭제 하였습니다.");
            handleSearchSubmit();
        } else {
            console.log(result.message);
        }
    };

    //DateRangePicker 컴포넌트
    const handleOnDateLoad = async (rangeDate: String) => {
        if (rangeDate) {
            console.log("데이타 있어.", rangeDate)
            const [startDate, endDate] = rangeDate.split(" - ");
            setStartDate(startDate.replace(/\./g, "-"))
            setEndDate(endDate.replace(/\./g, "-"))
        } else {
            console.log("데이타 없어.", rangeDate)
            setStartDate("")
            setEndDate("")
        }
    };

    //검색타입 selectbox default value
    const selectedSearchType = useMemo(() => {
        return SelectCouponSearchOptions.find(option => option.value === searchType);
    }, [searchType]);

    //상태 selectbox  default value
    const selectedIsState = useMemo(() => {
        return SelectCouponIsStateOptions.find(option => option.value === isState);
    }, [isState]);

    //데이타 로딩 함수호출
    useEffect(() => {
        const queryPage = parseInt(params?.get('page') || '1', 10);
        const queryPageSize = parseInt(params?.get('pageSize') || '10', 10);
        const querySearchText = params?.get('searchText') || '';
        const querySearchType = params?.get('searchType') || '';
        const queryIsState = params?.get('isState') || '';
        const queryStartDate = params?.get('startDate') || '';
        const queryEndDate = params?.get('endDate') || '';
        setSearchText(querySearchText);
        setSearchType(querySearchType);
        setIsState(queryIsState);
        setStartDate(queryStartDate);
        setEndDate(queryEndDate);
        setPage(queryPage);
        setPageSize(queryPageSize);

        //데이타 로딩 함수호출
        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
            isState: queryIsState,
            startDate: queryStartDate,
            endDate: queryEndDate
        });
    }, [params]);












    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    //선택된 아이디들과, 목록이 변경될때 마다 전체선택인지 확인
    useEffect(() => {
        // 전체 선택 상태 동기화
        if (selectedIds.length === coupons.length && coupons.length > 0) {
            setSelectAll(true); //전체선택
        } else {
            setSelectAll(false); //전체선택 해제
        }
    }, [selectedIds, coupons]);

    //함수
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(coupons.map((_, i) => i));
        }
        setSelectAll(!selectAll);
    };
    //함수
    const handleCheckboxChange = (index: number) => {
        setSelectedIds(prev =>
            prev.includes(index)
                ? prev.filter(id => id !== index)
                : [...prev, index]
        );
    };
    //함수
    const handleDelete = () => {
        if (confirm("정말 삭제 하겠습니까?")) {
            const couponIdsToDelete = selectedIds.map(i => coupons[i].couponId);
            handleDeleteCoupons(couponIdsToDelete);
            setSelectedIds([]);
        }
    };


















    if (!isLoading) return <div className="p-6">로딩 중...</div>;

    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰리스트</h1>
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
                            <li className="breadcrumb-item text-muted">쿠폰리스트</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-xxl">
                    <div className="card">
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            <div className="card-toolbar flex-row-fluid justify-content gap-5">

                                <DateRangePicker startDate={startDate} endDate={endDate} onDateLoad={handleOnDateLoad} />
                                {/*<HorizontalDateRangePicker />*/}
                                <div className="w-130px">
                                    <Select<OptionType>
                                        options={SelectCouponIsStateOptions}
                                        placeholder="전체"
                                        value={selectedIsState}
                                        isSearchable={false}
                                        onChange={handleIsStateChange}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 5,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e9ecef',
                                                primary: '#ECECEE',
                                                neutral0: '#fff', //option 기본색(흰색)
                                                neutral80: '#929191', //선택된 글자색
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
                                <div className="w-100px">
                                    <Select<OptionType>
                                        options={SelectCouponSearchOptions}
                                        placeholder="전체"
                                        value={selectedSearchType}
                                        isSearchable={false}
                                        onChange={handleChange}
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 5,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e9ecef',
                                                primary: '#ECECEE',
                                                neutral0: '#fff', //option 기본색(흰색)
                                                neutral80: '#929191', //선택된 글자색
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
                                <div className="d-flex align-items-center position-relative my-1">
                                    <i className="ki-duotone ki-magnifier fs-2 position-absolute ms-4">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                    </i>
                                    <input
                                        type="text" value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="form-control form-control-solid w-200px ps-12" placeholder="Search Report"
                                    />
                                </div>
                                <div className="mb-2">
                                    <button type="button" onClick={handleSearchSubmit} className="btn btn-outline text-nowrap">검색하기</button>
                                </div>
                            </div>
                            <div className="card-title">
                                <div className="d-flex align-items-center position-relative my-1">
                                    {/*--- 엑셀 다운로드---- */}
                                    <CouponsExcel searchText={searchText} searchType={searchType} isState={isState} startDate={startDate} endDate={endDate} />
                                </div>
                                <div id="kt_ecommerce_report_views_export" className="d-none"></div>
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            {/* 테이블 
                            <CouponTable coupons={coupons} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType} isState={isState}
                                startDate={startDate} endDate={endDate} onDelete={handleDeleteCoupons} />*/}
                            <div id="kt_ecommerce_report_views_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">

                                <div className="mb-2">
                                    <span className="ms-3 text-muted">총 {total}개</span>
                                </div>

                                <div className="table-responsive">
                                    <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_report_views_table">
                                        <thead>
                                            <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                                <th className="w-10px pe-2">
                                                    <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAllChange}
                                                            className="form-check-input"
                                                            data-kt-check="true" data-kt-check-target="#kt_ecommerce_report_views_table .form-check-input"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="min-w-200px text-center">상호</th>
                                                <th className="min-w-300px text-center">쿠폰명</th>
                                                <th className="min-w-70px text-center">할인율</th>
                                                <th className="min-w-200px text-center">기간</th>
                                                <th className="min-w-80px text-center">다운로드 수</th>
                                                <th className="min-w-80px text-center">사용 수</th>
                                                <th className="min-w-100px text-center">상태</th>
                                            </tr>
                                        </thead>
                                        <tbody className="fw-semibold text-gray-600">
                                            {coupons.map((m, i) => (
                                                <tr className="text-center" key={i}>
                                                    <td>
                                                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={selectedIds.includes(i)}
                                                                onChange={() => handleCheckboxChange(i)}
                                                            />
                                                            {/*(currentPage - 1) * pageSize + i + 1*/}
                                                        </div>
                                                    </td>
                                                    <td className="text-start">
                                                        {m.partnerName}
                                                    </td>
                                                    <td className="text-start">
                                                        <Link className="text-hover-primary text-gray-600"
                                                            href={{
                                                                pathname: `./edit/${m.couponId}`,
                                                                query: { searchText, searchType, isState, startDate, endDate, page, pageSize },
                                                            }}
                                                        >{m.couponName}</Link>
                                                    </td>
                                                    <td>{m.discountRate}%</td>
                                                    <td>{formatTwoDateWithDot(m.usageStartDate, m.usageEndDate)}</td>
                                                    <td data-bs-target="license">{m.downloadCnt}</td>
                                                    <td>{m.usedCnt}</td>
                                                    <td>
                                                        {m.isState === "ING" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light-primary ">진행중</span> : ""}
                                                        {m.isState === "END" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light">기간만료</span> : ""}
                                                        {m.isState === "WAITING" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light">대기중</span> : ""}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <div className="dataTables_length">
                                        <label>
                                            <select value={pageSize} onChange={handlePageSizeChange}
                                                className="form-select form-select-sm form-select-solid">
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                {/* 페이징 */}
                                <Pagination
                                    currentPage={page} totalItems={total} pageSize={pageSize}
                                    onPageChange={(p) => {
                                        handlePageChange(p);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end py-6 px-9">
                            <button type="button" className="btn btn-light btn-active-light-primary me-2"
                                disabled={selectedIds.length === 0}
                                onClick={handleDelete}
                            >선택삭제</button>
                            <button type="button" onClick={() => {
                                router.push(`./add`);

                            }}
                                className="btn btn-primary" id="kt_account_profile_details_submit">쿠폰등록</button>
                        </div>
                    </div>
                </div>

                <div id="kt_scrolltop" className="scrolltop" data-kt-scrolltop="true">
                    <i className="ki-duotone ki-arrow-up">
                        <span className="path1"></span>
                        <span className="path2"></span>
                    </i>
                </div>
            </div>
        </>
    );
}


