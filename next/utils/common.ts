import dayjs from 'dayjs'; // 날짜 계산을 위해 dayjs 사용 추천


// 날짜 관련 함수
// 오늘날짜(YYYY-MM-DD)
export const getToday = (): string => {
	return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
};
// 오늘부터 n일후 날짜 (YYYY-MM-DD)
export const getNextDay = (days: number): string => {
	const today = new Date();
	today.setDate(today.getDate() + days);
	return today.toISOString().split('T')[0];
};
// 오늘부터 n일전 날짜 (YYYY-MM-DD)
export const getPreDay = (days: number): string => {
	const today = new Date();
	today.setDate(today.getDate() - days);
	return today.toISOString().split('T')[0];
};

export const formatDateKR = (date?: string | Date): string => {
	if (!date) return '';
	const d = new Date(date);
	if (isNaN(d.getTime())) return '';
	return d.toLocaleDateString('ko-KR'); // "2025. 5. 20."
};

export const getKSTDate = (): string => {
	const now = new Date();
	const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
	return kst.toISOString().slice(0, 10);
};

//YYYY-MM-DD 를 YYYY.mm.dd로 만들어줌
export function formatDateWithDot(dateStr: string): string {
	return dateStr.replace(/-/g, '.');
}
//YYYY-MM-DD~YYYY-MM-DD 를 YYYY.mm.dd ~ YYYY.mm.dd 로 만들어줌
export function formatTwoDateWithDot(date1Str: string, date2Str: string): string {
	return date1Str.replace(/-/g, '.') + ' ~ ' + date2Str.replace(/-/g, '.');
}



// 문자열 관련 함수
// 문자열이 실제 값이 있는지 확인 (공백 제외)
export const hasText = (str?: string | null): boolean => {
	return typeof str === 'string' && str.trim().length > 0;
};
//console.log(hasText('hello'));     // true
//console.log(hasText('   '));       // false
//console.log(hasText(''));          // false
//console.log(hasText(null));        // false
//console.log(hasText(undefined));   // false

export const capitalize = (str: string): string => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncate = (str: string, length: number): string => {
	if (str.length <= length) return str;
	return str.slice(0, length) + '...';
};

export const isEmail = (str: string): boolean => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(str);
};




// 숫자 관련 함수
export const formatNumber = (num: number): string => {
	return num.toLocaleString('ko-KR'); // "1,234,567"
};

export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

export const isNumeric = (val: any): boolean => {
	return !isNaN(parseFloat(val)) && isFinite(val);
};

// 날짜 범위 함수 
export const rangeDate = (rangeType: string): { startDate: string, endDate: string } => {

	const today = dayjs();
	let startDate = today;
	let endDate = today;

	switch (rangeType) {
		case '7days':
			endDate = today.add(6, 'day'); // 오늘 포함 7일
			break;
		case '15days':
			endDate = today.add(14, 'day');
			break;
		case '1month':
			endDate = today.add(1, 'month').subtract(1, 'day');
			break;
		case '3months':
			endDate = today.add(3, 'month').subtract(1, 'day');
			break;
		case '6months':
			endDate = today.add(6, 'month').subtract(1, 'day');
			break;
		default:
	}

	return {
		startDate: startDate.format('YYYY-MM-DD'),
    	endDate: endDate.format('YYYY-MM-DD'),
	};
};