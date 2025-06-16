import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const setCookieName = (name: string, val:string, timesLimit:number) => {
  setCookie(name, val, { maxAge: timesLimit });
};

export const removeCookieName = (name: string) => {
  deleteCookie(name);
};

export const getCookieName = (name : string): string | undefined => {
    if (typeof window !== 'undefined') {
        return getCookie(name) as string | undefined;
    }    
    return undefined;
};

