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
      <h2 className="text-3xl font-bold mb-8">Cooking Timer</h2>

      <div className="mb-8">
        <div className="text-8xl font-mono font-bold tracking-wider">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetSelect(preset)}
            className={`p-4 rounded-lg transition-all ${
              selectedPreset === preset.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
          >
            <div className="font-medium">{preset.name}</div>
            <div className="text-sm text-gray-400">{formatTime(preset.duration)}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <input
          type="number"
          value={customTime}
          onChange={handleCustomTimeChange}
          placeholder="Custom minutes"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg w-40 text-center"
          min="1"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleStartPause}
          className={`px-6 py-3 rounded-full flex items-center gap-2 text-white ${
            isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={timeLeft === 0}
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full flex items-center gap-2 text-white"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};