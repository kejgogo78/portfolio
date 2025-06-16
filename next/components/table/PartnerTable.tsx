//3. 테이블 + 총 개수 + 정렬 + 검색 UI
// components/MemberTable.tsx
import { Partner } from '@/types/partner';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
    partners: Partner[];
    total: number;
    currentPage: number;
    pageSize: number;
    searchText: string;
    searchType: string;
    onDelete: (ids: string[]) => void; // 선택된 ID(partnerId)를 전달받아 삭제
}




export default function PartnerTable({ partners, total, currentPage, pageSize, searchText, searchType, onDelete }: Props) {
    
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
        if(confirm("정말 탈퇴처리 하겠습니까?")) {
            const partnerIdsToDelete = selectedIds.map(i => partners[i].partnerId);
            onDelete(partnerIdsToDelete);
            setSelectedIds([]);
        }
    };

    return (
        <div id="kt_ecommerce_report_views_table_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
            
            <div className="mb-2">
                <span className="ms-3 text-muted">총 {total}명</span>
                <button
                    className="ms-3  btn btn-outline text-nowrap"
                    disabled={selectedIds.length === 0}
                    onClick={handleDelete}
                >
                    선택 삭제
                </button>
                
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
                                            query: { searchText, searchType, page: currentPage, pageSize },
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
    );
}