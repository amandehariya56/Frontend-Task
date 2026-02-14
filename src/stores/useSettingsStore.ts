import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    theme: 'light' | 'dark' | 'system';
    tableDensity: 'compact' | 'comfortable' | 'spacious';
    sidebarDefaultOpen: boolean;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setTableDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
    setSidebarDefaultOpen: (isOpen: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'system',
            tableDensity: 'comfortable',
            sidebarDefaultOpen: true,
            setTheme: (theme) => set({ theme }),
            setTableDensity: (tableDensity) => set({ tableDensity }),
            setSidebarDefaultOpen: (sidebarDefaultOpen) => set({ sidebarDefaultOpen }),
        }),
        {
            name: 'settings-storage',
        }
    )
);
