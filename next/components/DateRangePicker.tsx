"use client";
import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format, startOfToday, subDays, startOfMonth, endOfMonth, addMonths } from "date-fns";
//import "react-date-range/dist/styles.css";
//import "react-date-range/dist/theme/default.css";
import { parse } from "date-fns";

interface Props {
    startDate?: string; // optional
    endDate?: string;
    onDateLoad: (rangeDate: string) => void;
}

const DateRangePicker = ({ startDate, endDate, onDateLoad }: Props) => {

    const rangeLabels = ["오늘", "어제", "지난 7일", "지난 30일", "이번달", "다음달"] as const;
    type RangeLabel = typeof rangeLabels[number];

    const tmpStartDate = startDate
    ? parse(startDate, "yyyy-MM-dd", new Date())
    : null;
  const tmpEndDate = endDate
    ? parse(endDate, "yyyy-MM-dd", new Date())
    : null;

    const [showMenu, setShowMenu] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedRange, setSelectedRange] = useState<Range | null>(
    tmpStartDate && tmpEndDate
      ? {
          startDate: tmpStartDate,
          endDate: tmpEndDate,
          key: "selection",
        }
      : null
  );
    
    /*
    const [selectedRange, setSelectedRange] = useState<Range | null>({});
    const [selectedRange, setSelectedRange] = useState<Range | null>({
        startDate: startOfToday(),
        endDate: startOfToday(),
        key: "selection",
    });*/


    const predefinedRanges: Record<RangeLabel, [Date, Date]> = {
        오늘: [startOfToday(), startOfToday()],
        어제: [subDays(startOfToday(), 1), subDays(startOfToday(), 1)],
        "지난 7일": [subDays(startOfToday(), 6), startOfToday()],
        "지난 30일": [subDays(startOfToday(), 29), startOfToday()],
        이번달: [startOfMonth(new Date()), endOfMonth(new Date())],
        다음달: [
            startOfMonth(addMonths(new Date(), 1)),
            endOfMonth(addMonths(new Date(), 1)),
        ],
    };

    const formatDisplay = (range: Range | null) => {
        if (!range?.startDate || !range?.endDate) return "";
        const formatted = `${format(range.startDate, "yyyy.MM.dd")} - ${format(range.endDate, "yyyy.MM.dd")}`;
        onDateLoad(formatted);
        return formatted;
    };

    const handleRangeClick = (label: RangeLabel) => {
        const [start, end] = predefinedRanges[label];
        setSelectedRange({ startDate: start, endDate: end, key: "selection" });
        setShowMenu(false);
        setShowCalendar(false);
    };

    return (
        <div className="relative inline-block" >
            <input
                className="form-control form-control-solid w-100 mw-200px"
                placeholder="Pick date range" id="kt_ecommerce_report_views_daterangepicker"
                readOnly
                value={formatDisplay(selectedRange)}
                onClick={() => setShowMenu((prev) => !prev)}
            />


            {/*input 뱍스 */}
            {showMenu && (
                <div className="absolute bg-white border mt-1 z-10 shadow-lg w-64">
                    {/*오늘,어제,지난 7일,지난 30일,이번달,다음달*/}
                    {(rangeLabels).map((label) => (
                        <div
                            key={label}
                            onClick={() => handleRangeClick(label)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {label}
                        </div>
                    ))}
                    {/*Custom Range*/}
                    <div
                        onClick={() => {
                            setShowCalendar(true);
                            setShowMenu(false);
                        }}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                        Custom Range
                    </div>
                </div>
            )}
            {showCalendar && (
                <div className="absolute z-20 mt-2">
                    {/*Custom Range 달력 */}
                    <DateRange
                        ranges={selectedRange ? [selectedRange] : []}
                        onChange={(ranges) => setSelectedRange(ranges.selection)}
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        direction="horizontal"
                    />
                    {/*showSelectionPreview={true} */}

                    <button
                        className="applyBtn btn btn-sm btn-secondary"
                        type="button"
                        onClick={() => {
                            setSelectedRange(null);         // 선택 초기화
                            onDateLoad("");                 // 외부에서도 값 비우기
                            setShowCalendar(false);         // 달력 닫기
                        }}
                    >
                        Cancel
                    </button>
                    <button className="applyBtn btn btn-sm btn-primary" type="button"
                        onClick={() => setShowCalendar(false)}>Apply</button>
                </div>
            )
            }
        </div >
    );
};

export default DateRangePicker;