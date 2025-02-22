import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  isDarkMode: boolean;
  useDigitalFont: boolean;
  useDotoFont: boolean;
  use12Hour: boolean;
  showDate: boolean;
  isNightMode: boolean;
  fontColor: 'orange' | 'red' | 'green' | 'blue';
  useSlideEffect: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  isDarkMode: true,
  useDigitalFont: false,
  useDotoFont: false,
  use12Hour: false,
  showDate: true,
  isNightMode: false,
  fontColor: 'blue',
  useSlideEffect: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('clockSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('clockSettings', JSON.stringify(settings));
    
    // Apply dark mode
    document.documentElement.classList.toggle('dark', settings.isDarkMode);
    
    // Apply night mode
    document.documentElement.classList.toggle('night-mode', settings.isNightMode);
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};