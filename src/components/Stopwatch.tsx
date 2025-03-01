import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const getFontClass = () => {
    if (settings.useDigitalFont) return 'font-digital';
    if (settings.useDotoFont) return 'font-doto';
    return 'font-mono';
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Stopwatch</h2>
      
      <div className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-8 tracking-wider ${getFontClass()}`}>
        {formatTime(time)}
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={handleStartStop}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-white text-sm sm:text-base ${
            isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleLap}
          className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-white text-sm sm:text-base"
          disabled={!isRunning}
        >
          <Flag size={18} className="sm:w-5 sm:h-5" />
          Lap
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-white text-sm sm:text-base"
        >
          <RotateCcw size={18} className="sm:w-5 sm:h-5" />
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Laps</h3>
          <div className="space-y-2">
            {laps.map((lap, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 sm:p-4 rounded-lg flex justify-between items-center text-sm sm:text-base"
              >
                <span>Lap {laps.length - index}</span>
                <span className={getFontClass()}>{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};