//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { CouponResponse } from '@/types/coupon';
import Link from 'next/link';
import { formatTwoDateWithDot } from '@/utils/common';
import { useEffect, useState } from 'react';

interface Props {
    coupons: CouponResponse[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchText: string;
    searchType: string;
    isState: string;
    startDate: string;
    endDate: string;
    onDelete: (ids: number[]) => void; // 선택된 ID(couponId)를 전달받아 삭제
}

export default function PartnerCouponTable({ coupons, total, currentPage, pageSize, searchText, searchType, isState, startDate, endDate, onDelete }: Props) {

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
            onDelete(couponIdsToDelete);
            setSelectedIds([]);
        }
    };

    return (
        <div id="kt_ecommerce_report_views_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
            {/*
            <div className="mb-2">
                <span className="ms-3 text-muted">총 {total}개</span>
                <button
                    className="ms-3  btn btn-outline text-nowrap"
                    disabled={selectedIds.length === 0}
                    onClick={handleDelete}
                >
                    선택 삭제
                </button>

            </div>
             */}    
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
                                    <Link className="text-hover-primary text-gray-600"
                                        href={{
                                            pathname: `./edit/${m.couponId}`,
                                            query: { searchText, searchType, isState, startDate, endDate, page: currentPage, pageSize },
                                        }}
                                    >{m.couponName}</Link>
                                </td>
                                <td>{m.discountRate}%</td>
                                <td>{formatTwoDateWithDot(m.usageStartDate, m.usageEndDate)}</td>
                                <td data-bs-target="license">{m.downloadCnt}</td>{/*다운로드수*/}
                                <td>{m.usedCnt}</td>{/*사용수*/}
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
    );
}