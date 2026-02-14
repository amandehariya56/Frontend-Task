import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
    setIsOpen: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            setIsOpen: (value) => set({ isOpen: value }),
        }),
        {
            name: 'sidebar-storage',
        }
    )
);
