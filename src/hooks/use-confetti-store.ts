import { create } from 'zustand';

type ConfettiStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}


export const useConfettiStore = create<ConfettiStore>((set) => ({
    isOpen: false,
    onOpen: () => {
        set((state) => ({ ...state, isOpen: true }));
    },
    onClose: () => {
        set((state) => ({ ...state, isOpen: false }));
    }
}))


