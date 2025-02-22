import React from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) return null;

  const colorOptions: { value: 'orange' | 'red' | 'green' | 'blue'; label: string }[] = [
    { value: 'orange', label: 'Orange' },
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ];

  const handleFontChange = (useDigital: boolean, useDoto: boolean) => {
    updateSettings({
      useDigitalFont: useDigital,
      useDotoFont: useDoto
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${settings.isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-2xl p-8 max-w-md w-full shadow-xl ${settings.useSlideEffect ? 'animate-slide-up' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg block">Clock Font</label>
            <div className="space-y-2">
              <button
                onClick={() => handleFontChange(true, false)}
                className={`w-full p-3 rounded ${
                  settings.useDigitalFont
                    ? 'bg-blue-600 text-white'
                    : `${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                }`}
              >
                Digital Font
              </button>
              <button
                onClick={() => handleFontChange(false, true)}
                className={`w-full p-3 rounded ${
                  settings.useDotoFont
                    ? 'bg-blue-600 text-white'
                    : `${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                }`}
              >
                Doto Font
              </button>
              <button
                onClick={() => handleFontChange(false, false)}
                className={`w-full p-3 rounded ${
                  !settings.useDigitalFont && !settings.useDotoFont
                    ? 'bg-blue-600 text-white'
                    : `${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                }`}
              >
                Default Font
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg">12-hour Format (AM/PM)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.use12Hour}
                onChange={(e) => updateSettings({ use12Hour: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg">Show Date</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={(e) => updateSettings({ showDate: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg">Night Mode</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isNightMode}
                onChange={(e) => updateSettings({ isNightMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-lg">Sliding Effect</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.useSlideEffect}
                onChange={(e) => updateSettings({ useSlideEffect: e.target.checked })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 ${settings.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-lg block">Font Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ fontColor: color.value })}
                  className={`p-2 rounded ${
                    settings.fontColor === color.value
                      ? 'ring-2 ring-white dark:ring-gray-300'
                      : ''
                  } bg-${color.value}-600 hover:bg-${color.value}-700 text-white`}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};