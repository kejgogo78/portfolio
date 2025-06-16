//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { CouponQRCode } from '@/types/couponQRCode';
import { formatTwoDateWithDot, formatDateWithDot } from '@/utils/common';
import { format, parseISO } from 'date-fns';

interface Props {
    couponQRCodes: CouponQRCode[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchText: string;
    searchType: string;
    isState: string;
    onDelete: (ids: number[]) => void; // 선택된 ID(couponId)를 전달받아 삭제
}

export default function CouponIssueTable({ couponQRCodes, total, currentPage, pageSize, searchText, searchType, isState, onDelete }: Props) {
    
    

    return (
        <>
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
                            {total - ((currentPage - 1) * pageSize) - i}
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
        </>
    );
}