import { create } from 'zustand';

interface SignUpState {
    bizNumber: string;
    setBizNumber: (num: string) => void;
}
  
export const useSignUpStore = create<SignUpState>((set) => ({
    bizNumber: '',
    setBizNumber: (num) => set({ bizNumber: num }),
}));
