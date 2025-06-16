// app/admin/business/[id]/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { fetchAdminPartnerDetail, deletePartner } from '@/lib/apis/admin';
import { PartnerResponse } from '@/types/partner';
import axios from 'axios';

export default function AdminPartnerDetail({ params }: { params: Promise<{ id: string }> }) {

    //params	동적 라우팅(폴더 경로)의 [id], [slug] 같은 URL 경로의 일부를 가져옴
    //searchParams	?key=value 형태의 쿼리 파라미터를 가져옴
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryString = (searchParams as unknown as URLSearchParams).toString();


    const [partner, setPartner] = useState<PartnerResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchAdminPartnerDetail(id);
                setPartner(result.value);
            } catch (error) {
                console.error("데이터 가져오기 실패:", error);
            }
        };
        fetchData();

    }, [id]);

    const handleDelete = async () => {
        if(!confirm(" 사업자를 정말 삭제 하시겠습니까? ")) return;
        try {
            const result = await deletePartner(id);
            if (result.success) {
                alert(`사업자를 삭제 하였습니다.`);
                router.push(`./list`); //페이지 이동
            } else {
                alert(result.message);
                return;
            }
        } catch (error) {
            console.error("데이터 삭제 실패:", error);
        }
    };

    

    if (!partner) return <div className="p-6">로딩 중...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">사업자 상세정보보</h1>
            <div className="border p-4 mb-4">
                <p><strong>이름:</strong> {partner?.partnerName}</p>
                <p><strong>사업자번호:</strong> {partner?.businessRegistrationNo}</p>
                <p><strong>분야:</strong> {partner?.businessType}</p>
                <p><strong>지역:</strong> {partner?.region}</p>
                <p><strong>주소:</strong> ({partner?.postalCode}) {partner?.address} {partner?.addressDetail}</p>
                <p><strong>전화번호:</strong> {partner?.phone}</p>
                <p><strong>이메일:</strong> {partner?.email}</p>
            </div>

            <button onClick={() => { router.push(`./list?${queryString}`); }}>목록으로 돌아가기</button>
            <button onClick={() => { router.push(`./edit/${id}?${queryString}`); }}>수정</button>
            <button onClick={handleDelete} id="del">삭제</button>
        </div>
    );
}
