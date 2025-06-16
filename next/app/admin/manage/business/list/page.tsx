'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

import { Partner } from '@/types/partner';
import { SearchPartner } from '@/types/search';
import { OptionType, SelectPartnerSearchOptions } from '@/types/select';
import { fetchPartners, deletePartners } from '@/lib/apis/admin';

import Pagination from '@/components/Pagination';
import PartnerTable from '@/components/table/PartnerTable';
import PartnersExcel from '@/components/excel/PartnersExcel';

import Link from 'next/link';


import "../../../../css/datatables.bundle.css";
import "../../../../css/plugins.bundle.css";
import "../../../../css/style.bundle.css";

export default function AdminPartners() {

    const router = useRouter();
    const params = useSearchParams();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); //한페이지에 뿌려질 데이타
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //한페이지에 보여질 데이타수 변경시(검색)
    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            page: String(1) || '1',
            pageSize: String(event.target.value) || '10',
        }).toString();
        window.location.href = `/admin/manage/business/list?${query}`;
    };

    //페이지 변경시(검색)
    const handlePageChange = (newPage: number = page) => {
        const query = new URLSearchParams({
            searchText: searchText || '',
            searchType: searchType || 'all',
            page: String(newPage) || '1',
            pageSize: String(pageSize) || '10',
        }).toString();
        window.location.href = `/admin/manage/business/list?${query}`;
    };

    //검색버튼 클릭시 (재검색)
    const handleSearchSubmit = () => {
        handlePageChange(1);
    }

    //검색범위 셀렉트 박스 선택시
    const handleChange = (selected: SingleValue<OptionType>) => {
        setSearchType(selected?.value || 'all');
    };


    // 데이터 조회 함수
    const fetchData = async (search: SearchPartner) => {
        setIsLoading(false);
        const result = await fetchPartners(search); //api 호출
        if (result.success) {
            console.log("받아온 내용 : ", result.value)
            setPartners(result.value.partners);
            setTotal(result.value.total);
            setIsLoading(true);
        } else {
            console.log(result.message);
        }
    };




    //ParterTable 컴포넌트에서 delete 호출하면 실행(API연동및 재배열)
    const handleDeletePartners = async (ids: string[]) => {
        const result = await deletePartners(ids); //api 호출
        if (result.success) {
            // 삭제 API 호출 또는 로컬 데이터 필터링
            //const filtered = partners.filter(partner => !ids.includes(partner.partnerId));
            //setPartners(filtered); // 상태 업데이트로 화면에서 제거됨
            //console.log("삭제된 파트너 ID:", ids);
            alert("사업자 " + ids + "들을 탈퇴처리 하였습니다. 한달후 자동 삭제 됩니다.");
            handleSearchSubmit(); //다시 검색
        } else {
            console.log(result.message);
            return;
        }
    };

    //검색타입 selectbox default value
    const selectedSearchType = useMemo(() => {
        return SelectPartnerSearchOptions.find(option => option.value === searchType);
    }, [searchType]);


    //데이타 로딩 함수호출
    useEffect(() => {
        const queryPage = parseInt(params?.get('page') || '1', 10);
        const queryPageSize = parseInt(params?.get('pageSize') || '10', 10);
        const querySearchText = params?.get('searchText') || '';
        const querySearchType = params?.get('searchType') || '';
        setSearchText(querySearchText);
        setSearchType(querySearchType);
        setPage(queryPage);
        setPageSize(queryPageSize);

        //데이타 로딩 함수호출
        fetchData({
            page: queryPage,
            pageSize: queryPageSize,
            searchText: querySearchText,
            searchType: querySearchType,
        });
    }, [params]);

    


    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    //선택된 아이디들과, 목록이 변경될때 마다 전체선택인지 확인
    useEffect(() => {
        // 전체 선택 상태 동기화
        if (selectedIds.length === partners.length && partners.length > 0) {
            setSelectAll(true); //전체선택
        } else {
            setSelectAll(false); //전체선택 해제
        }
    }, [selectedIds, partners]);

    //함수
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(partners.map((_, i) => i));
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
        if (confirm("정말 탈퇴처리 하겠습니까?")) {
            const partnerIdsToDelete = selectedIds.map(i => partners[i].partnerId);
            handleDeletePartners(partnerIdsToDelete);
            setSelectedIds([]);
        }
    };

    if (!isLoading) return <div className="p-6">로딩 중...</div>;

    return (
        <>
            <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">사업자회원관리</h1>
                        <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                                <a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">사업자회원관리</li>
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
                                        options={SelectPartnerSearchOptions}
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
                                    {/*--- 엑셀 다운로드---- */}
                                    <PartnersExcel searchText={searchText} searchType={searchType} />
                                </div>
                                <div id="kt_ecommerce_report_views_export" className="d-none"></div>
                            </div>

                        </div>
                        <div className="card-body pt-0">
                            {/* 테이블 
                            <PartnerTable partners={partners} total={total} currentPage={page} pageSize={pageSize}
                                searchText={searchText} searchType={searchType} onDelete={handleDeletePartners} />*/}
                            <div id="kt_ecommerce_report_views_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                                        
                                        <div className="mb-2">
                                            <span className="ms-3 text-muted">총 {total}명</span>
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
                                                        <th className="min-w-300px text-center">상호</th>
                                                        <th className="min-w-200px text-center">사업자번호</th>
                                                        <th className="min-w-100px text-center">사업분야</th>
                                                        <th className="min-w-100px text-center">지역</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="fw-semibold text-gray-600">
                                                    {/*{(currentPage - 1) * pageSize + i + 1} ---- 총 {total}명 */}
                                                    {partners.map((m, i) => (
                                                        <tr className="text-center"  key={i}>
                                                            <td>
                                                                <div className="form-check form-check-sm form-check-custom form-check-solid">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={selectedIds.includes(i)}
                                                                        onChange={() => handleCheckboxChange(i)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="text-start">
                                                                <Link className="text-hover-primary text-gray-600"
                                                                    href={{
                                                                        pathname: `./edit/${m.partnerId}`,
                                                                        query: { searchText, searchType, page, pageSize },
                                                                    }}
                                                                >{m.partnerName}
                                                                </Link>
                                                            </td>
                                                            <td>{m.businessRegistrationNo}</td>
                                                            <td>{m.businessType}</td>
                                                            <td>{m.address.slice(0, 2)}</td>
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
							{/*------- 선택삭제 버튼 ---------- */}
                            <button type="button" className="btn btn-light btn-active-light-primary me-2"
                                disabled={selectedIds.length === 0}
                                onClick={handleDelete}
                            >선택삭제</button>
                            {/*------- 사업자등록 버튼 ---------- */}
                            <button type="button" onClick={()=>{ router.push(`./add`); }}
                                className="btn btn-primary" id="kt_account_profile_details_submit">사업자등록</button>
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
