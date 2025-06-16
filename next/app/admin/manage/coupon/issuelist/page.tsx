'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { CouponQRCode } from '@/types/couponQRCode';
import { SearchCouponQRCodes } from '@/types/search';
import { OptionType, SelectCouponIssueSearchOptions, SelectCouponQRCodeIsUsedOptions } from '@/types/select';
import { fetchCouponsIssue } from '@/lib/apis/admin';

import Pagination from '@/components/Pagination';
import CouponIssueTable from '@/components/table/CouponIssueTable';
import CouponsIssueExcel from '@/components/excel/CouponsIssueExcel';

import { formatTwoDateWithDot, formatDateWithDot } from '@/utils/common';
import { format, parseISO } from 'date-fns';

import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";

export default function AdminCouponIssuelist() {

    const router = useRouter();
    const params = useSearchParams();
    const [couponQRCodes, setCouponQRCodes] = useState<CouponQRCode[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //한페이지에 뿌려질 데이타
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('');
    const [isState, setIsState] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            isState: isState || '',
            page: String(1) || '1',
            pageSize: String(event.target.value) || '10',
        }).toString();
        window.location.href = `/admin/manage/coupon/issuelist?${query}`;
    };

    //페이지 변경시(검색)
    const handlePageChange = (newPage: number = page) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            isState: isState || '',
            page: String(newPage) || '1',
            pageSize: String(pageSize) || '10',
        }).toString();
        window.location.href = `/admin/manage/coupon/issuelist?${query}`;
    };

    //검색버튼 클릭시 (재검색)
    const handleSearchSubmit = () => {
        handlePageChange(1);
    }

    //검색범위 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        setSearchType(selected?.value || 'all');
    };

    //상태 검색 셀렉트 박스 사용여부 선택시
    const handleIsUsedChange = (selected: SingleValue<OptionType>) => {
        setIsState(selected?.value || '');
    };

    // 데이터 조회 함수
    const fetchData = async (search: SearchCouponQRCodes) => {
        setIsLoading(false);
        const result = await fetchCouponsIssue(search); //api 호출
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setCouponQRCodes(result.value.couponQRCodes);
            setTotal(result.value.total);
            setIsLoading(true);
        } else {
            console.log(result.message);
        }
    };

    //CouponTable 컴포넌트에서 delete 호출하면 실행(API연동및 재배열)
    const handleDeleteCouponQRCodes = async (ids: number[]) => {
        /*
        const result = await deleteCouponQRCodes(ids); //api 호출
        if (result.success) {
            alert("QR code 들을 삭제 하였습니다.");
            handleSearchSubmit();
        } else {
            console.log(result.message);
        }*/
    };

    //검색타입 selectbox default value
    const selectedSearchType = useMemo(() => {
        return SelectCouponIssueSearchOptions.find(option => option.value === searchType);
    }, [searchType]);
    
    //상태 selectbox  default value
    const selectedIsState = useMemo(() => {
        return SelectCouponQRCodeIsUsedOptions.find(option => option.value === isState);
    }, [isState]);



    //데이타 로딩 함수호출
    useEffect(() => {
        const queryPage = parseInt(params?.get('page') || '1', 10);
        const queryPageSize = parseInt(params?.get('pageSize') || '10', 10);
        const querySearchText = params?.get('searchText') || '';
        const querySearchType = params?.get('searchType') || '';
        const queryIsState = params?.get('isState') || '';
        setSearchText(querySearchText);
        setSearchType(querySearchType);
        setIsState(queryIsState);
        setPage(queryPage);
        setPageSize(queryPageSize);

        //데이타 로딩 함수호출
        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
            isState: queryIsState,
        });
    }, [params]);

    if (!isLoading) return <div className="p-6">로딩 중...</div>;

    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">쿠폰발급 리스트</h1>
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
                            <li className="breadcrumb-item text-muted">쿠폰발급 리스트</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-xxl">
                    <div className="card">
                        <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                            <div className="card-toolbar flex-row-fluid justify-content gap-5">
                                <div className="w-150px">
                                    <Select<OptionType>
                                        options={SelectCouponQRCodeIsUsedOptions}
                                        placeholder="전체"
                                        value={selectedIsState}
                                        isSearchable={false}
                                        onChange={handleIsUsedChange}
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
                                <div className="w-150px">
                                    <Select<OptionType>
                                        options={SelectCouponIssueSearchOptions}
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
                                    <input type="text" value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="form-control form-control-solid w-250px ps-12" placeholder="Search Report" />
                                </div>
                                <div className="mb-2">
                                    <button type="button" onClick={handleSearchSubmit} className="btn btn-outline text-nowrap">검색하기</button>
                                </div>     
                            </div>
                            <div className="card-title">
                                <div className="d-flex align-items-center position-relative my-1">
                                    {/*--- 엑셀 다운로드---- */
                                    <CouponsIssueExcel searchText={searchText} searchType={searchType} isState={isState} />}
                                </div>
                                <div id="kt_ecommerce_report_views_export" className="d-none"></div>    
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            {/* 테이블 
                            <CouponIssueTable couponQRCodes={couponQRCodes} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType}
                                isState={isState}  onDelete={handleDeleteCouponQRCodes}
                            />*/}


                            <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_report_views_table">
                                            <thead>
                                                <tr className="text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                                                    <th className="w-10px pe-2">
                                                        <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                                                            <input className="form-check-input" type="checkbox" data-kt-check="true" data-kt-check-target="#kt_ecommerce_report_views_table .form-check-input" value="1" />
                                                        </div>
                                                    </th>
                                                    <th className="min-w-100px text-center">NO</th>
                                                    <th className="min-w-100px text-center">아이디</th>
                                                    <th className="min-w-370px text-center">쿠폰명</th>
                                                    <th className="min-w-80px text-center">할인율</th>
                                                    <th className="min-w-200px text-center">기간</th>
                                                    <th className="min-w-90px text-center">발급일자</th>
                                                    <th className="min-w-90px text-center">사용여부</th>
                                                </tr>
                                            </thead>
                                            <tbody className="fw-semibold text-gray-600">
                                                {couponQRCodes.map((m, i) => (
                                                <tr className="text-center" key={i}>
                                                    <td>
                                                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                                                            <input className="form-check-input" type="checkbox" value="1" />
                                                            
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {total - ((page - 1) * pageSize) - i}
                                                    </td>
                                                    <td className="text-start">
                                                        {m.userId}
                                                    </td>
                                                    <td className="text-start">
                                                        {m.couponName}
                                                    </td>
                                                    <td>{m.discountRate}%</td>
                                                    <td>{formatTwoDateWithDot(m.usageStartDate , m.usageEndDate)}</td>
                                                    <td data-bs-target="license">{format(new Date(m.createdAt), 'yyyy.MM.dd')}</td>
                                                    <td>
                                                        {m.isState==="Y" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light-primary ">사용</span> : ""}
                                                        {m.isState==="N" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light-primary ">미사용</span> : ""}
                                                        {m.isState==="E" ? <span className="badge fw-bold me-auto px-4 py-3 badge-light  ">기간만료 </span> : ""}
                                                        
                                                        
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>




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
