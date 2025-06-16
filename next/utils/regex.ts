//정규 표현식
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const discountRegex = /^(100|[1-9]?[0-9])$/;

//영문으로 시작하고, 영문+숫자 조합 4~12자여야 합니다.(숫자,영문 최소 1개이상)
export const usernameRegex = /^(?=[A-Za-z0-9]{4,12}$)(?=[A-Za-z]*\d)(?=\d*[A-Za-z])[A-Za-z][A-Za-z0-9]*$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//8~12자의 영문, 숫자, 특수문자 중 2가지 이상으로만 가능합니다.
export const passwordRegex = /^(?!.*[^A-Za-z0-9!@#$%^&*])(?=.{8,12}$)(?:(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[!@#$%^&*])|(?=.*\d)(?=.*[!@#$%^&*])).*$/;

export const phoneRegex = /^(01[016789]|070)\d{7,8}$/;


