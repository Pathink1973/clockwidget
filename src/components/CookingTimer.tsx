import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface CookingTimerProps {
  isMuted: boolean;
}

interface Preset {
  name: string;
  duration: number;
}

const PRESETS: Preset[] = [
  { name: 'Soft Boiled Egg', duration: 6 * 60 },
  { name: 'Hard Boiled Egg', duration: 10 * 60 },
  { name: 'Rice', duration: 20 * 60 },
  { name: 'Pasta', duration: 12 * 60 },
  { name: 'Steamed Vegetables', duration: 8 * 60 },
  { name: 'Quick Pizza', duration: 15 * 60 },
  { name: 'Chicken Breast', duration: 25 * 60 },
  { name: 'Fish Fillet', duration: 15 * 60 },
  { name: 'Quinoa', duration: 15 * 60 },
  { name: 'Baked Potato', duration: 45 * 60 },
  { name: 'Soup', duration: 30 * 60 },
  { name: 'Steak (Medium)', duration: 8 * 60 },
  { name: 'Cookies', duration: 12 * 60 },
  { name: 'Bread', duration: 45 * 60 },
  { name: 'Oatmeal', duration: 5 * 60 },
];

export const CookingTimer: React.FC<CookingTimerProps> = ({ isMuted }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customTime, setCustomTime] = useState('');

  const playAlarm = useCallback(() => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    }
  }, [isMuted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, playAlarm]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (preset: Preset) => {
    setTimeLeft(preset.duration);
    setSelectedPreset(preset.name);
    setCustomTime('');
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomTime(value);
    const minutes = parseInt(value, 10);
    if (!isNaN(minutes)) {
      setTimeLeft(minutes * 60);
      setSelectedPreset('');
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setSelectedPreset('');
    setCustomTime('');
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Cooking Timer</h2>

      <div className="mb-4 sm:mb-8">
        <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold tracking-wider">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-6">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetSelect(preset)}
            className={`p-2 sm:p-3 rounded text-sm sm:text-base transition-all ${
              selectedPreset === preset.name
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className="font-semibold">{preset.name}</div>
            <div className="text-xs sm:text-sm opacity-75">{formatTime(preset.duration)}</div>
          </button>
        ))}
      </div>

      <div className="mb-6 sm:mb-8">
        <input
          type="number"
          value={customTime}
          onChange={handleCustomTimeChange}
          placeholder="Enter minutes"
          className="w-32 sm:w-40 px-3 py-2 text-sm sm:text-base rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4"
          min="1"
        />
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={handleStartPause}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base text-white ${
              isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRunning ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 text-sm sm:text-base text-white"
          >
            <RotateCcw size={18} className="sm:w-5 sm:h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};