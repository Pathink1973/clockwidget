import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface ClockProps {
  time: Date;
  is24Hour: boolean;
  showSeconds: boolean;
}

export const Clock: React.FC<ClockProps> = ({ time, is24Hour, showSeconds }) => {
  const { settings } = useSettings();

  const formatTime = () => {
    let hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (!is24Hour) {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    return `${hoursStr}:${minutes}${showSeconds ? ':' + seconds : ''}${!is24Hour ? ' ' + ampm : ''}`;
  };

  const getFontClass = () => {
    if (settings.useDigitalFont) return 'font-digital';
    if (settings.useDotoFont) return 'font-doto';
    return 'font-mono';
  };

  return (
    <div className="text-center">
      <div className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider ${getFontClass()}`}>
        {formatTime()}
      </div>
      {settings.showDate && (
        <div className="mt-4 text-xl text-gray-400">
          {time.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      )}
    </div>
  );
};