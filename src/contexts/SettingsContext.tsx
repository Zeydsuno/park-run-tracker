import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsState {
    runnerName: string;
    runnerId: string;
    pushEnabled: boolean;
    language: string;
    weightKg: number;
    eventId: number;
    eventDistance: number;
}

interface SettingsContextType {
    settings: SettingsState;
    updateSettings: (newSettings: Partial<SettingsState>) => void;
}

const defaultSettings: SettingsState = {
    runnerName: 'Attidmese Bunsua',
    runnerId: 'U-001',
    pushEnabled: true,
    language: 'TH',
    weightKg: 65,
    eventId: 101, // e.g. Lumpini Park
    eventDistance: 2.5,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    const updateSettings = (newSettings: Partial<SettingsState>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
