import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface TimerProps {
  isMuted: boolean;
}

export const Timer: React.FC<TimerProps> = ({ isMuted }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { settings } = useSettings();
  const tickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3');
    tickSound.current.volume = 0.2; // Softer tick sound
  }, []);

  const playAlarm = useCallback(() => {
    if (!isMuted) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1029/1029-preview.mp3');
      audio.volume = 0.7; // Slightly lower volume for comfort
      audio.play();
    }
  }, [isMuted]);

  const playTick = useCallback(() => {
    if (!isMuted && tickSound.current && timeLeft <= 10) { // Only play tick sound in last 10 seconds
      tickSound.current.currentTime = 0;
      tickSound.current.play().catch(() => {
        // Handle any playback errors silently
      });
    }
  }, [isMuted, timeLeft]);

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
          playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, playAlarm, playTick]);

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getFontClass = () => {
    if (settings.useDigitalFont) return 'font-digital';
    if (settings.useDotoFont) return 'font-doto';
    return 'font-mono';
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-8">Timer</h2>
      
      {!isRunning && timeLeft === 0 ? (
        <div className="flex justify-center gap-4 mb-8">
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-24 text-center"
            placeholder="Hours"
          />
          <input
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-24 text-center"
            placeholder="Minutes"
          />
          <input
            type="number"
            value={seconds}
            onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-24 text-center"
            placeholder="Seconds"
          />
        </div>
      ) : (
        <div className={`text-8xl mb-8 tracking-wider ${getFontClass()}`}>
          {formatTime(timeLeft)}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};