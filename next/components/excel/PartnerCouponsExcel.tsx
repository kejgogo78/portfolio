'use client';

import { useRef } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx-js-style';
import { fetchPartnerCouponsExcel } from '@/lib/apis/partner';
import { SearchCoupon } from '@/types/search';
import { CouponResponse } from '@/types/coupon';
import { formatTwoDateWithDot } from '@/utils/common';


type Props = {
    searchText?: string;
    searchType?: string;
    isState?: string;
    startDate?: string;
    endDate?: string;
};

export default function PartnerCouponsExcel<T>({ searchText, searchType, isState, startDate, endDate }: Props) {

    const isDownloadingRef = useRef(false); // useRef 사용
    
    const searchCoupon: SearchCoupon = {
        page: 0,                 // 의미 없는 값
        pageSize: 0,             // 의미 없는 값
        searchText: searchText || "",
        searchType: searchType || "",
        isState: isState || "",
        startDate: startDate || "",
        endDate: endDate || ""
    };
    
    //다운로드 파일명
    const fileName = "쿠폰.xlsx";

    const handleDownload = async () => {
        
        if (isDownloadingRef.current) return; // 중복 방지
        isDownloadingRef.current = true; // 시작과 동시에 잠금
        
        try {
            const result = await fetchPartnerCouponsExcel(searchCoupon);
            if (result.success) {

                console.log("엑셀을 위한 데이타 : ", result.value)

                //다운로드할 데이타 불러오기
                const couponList: CouponResponse[] | undefined = result.value; //CouponResponse타입을 지정해주자(typescript)

                if (!couponList || couponList.length === 0) {
                    alert("엑셀로 다운로드할 쿠폰 데이터가 없습니다.");
                    return;
                }

                //컬럼 및 헤더 설정
                const header = ["쿠폰명", "할인율", "기간", "다운로드수", "사용수", "상태"];
                const sheetData = [header, ...couponList.map(item => 
                    [item.couponName
                        , item.discountRate
                        , formatTwoDateWithDot(item.usageStartDate,item.usageEndDate)
                        , item.downloadCnt
                        , item.usedCnt
                        , item.isState==="ING"?"진행중":item.isState==="END"?"기간만료":item.isState==="WAITING"?"대기중":""
                    ]
                ),];

                // 워크시트 생성
                const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

                // 셀 스타일 설정 (헤더 볼드 + 배경색, 테두리)
                const range = XLSX.utils.decode_range(worksheet['!ref']!);
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    for (let C = range.s.c; C <= range.e.c; ++C) {
                        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
                        const cell = worksheet[cell_address];
                        if (cell) {
                            // 테두리
                            cell.s = {
                                border: {
                                    top: { style: "thin", color: { rgb: "000000" } },
                                    bottom: { style: "thin", color: { rgb: "000000" } },
                                    left: { style: "thin", color: { rgb: "000000" } },
                                    right: { style: "thin", color: { rgb: "000000" } },
                                },
                                alignment: { horizontal: 'center', vertical: 'center' },
                                font: R === 0 ? { bold: true } : {},
                                fill: R === 0
                                    ? { fgColor: { rgb: 'D9E1F2' } } // 헤더 연한 파랑
                                    : { fgColor: { rgb: 'FFFFFF' } }, // 리스트 흰색
                            };
                            // 헤더 스타일
                            if (R === 0) {
                                cell.s.fill = { fgColor: { rgb: "D9E1F2" } }; // 연한 파란색
                                cell.s.font = { bold: true };
                            }
                        }
                    }
                }

                // 워크북 생성 및 다운로드 (fileName)
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, '쿠폰 목록');
                XLSX.writeFile(workbook, fileName, { bookType: 'xlsx' });

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
                //파일 다운로드 처리
                saveAs(blob, `${fileName}`);

            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.error("엑셀 다운로드 중 오류 발생:", error);
        } finally {
            // 반드시 해제해줘야 함
            isDownloadingRef.current = false;
        }
    };

    return (
        <button type="button" className="btn btn-light-primary" onClick={handleDownload} disabled={isDownloadingRef.current}>
            <i className="ki-duotone ki-exit-up fs-2">
                <span className="path1"></span>
                <span className="path2"></span>
            </i>{isDownloadingRef.current ? '다운로드 중...' : '엑셀다운로드'}
        </button>
    );
};
