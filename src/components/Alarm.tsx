import React, { useState, useEffect } from 'react';
import { Bell, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { AlarmSound } from './AlarmSound';

interface AlarmProps {
  alarms: string[];
  setAlarms: (alarms: string[]) => void;
  isMuted: boolean;
  currentTime: Date;
}

export const Alarm: React.FC<AlarmProps> = ({ alarms, setAlarms, isMuted, currentTime }) => {
  const [newAlarm, setNewAlarm] = useState('');
  const [playTriggerSound, setPlayTriggerSound] = useState(false);
  const [triggeredAlarm, setTriggeredAlarm] = useState<string | null>(null);

  useEffect(() => {
    // Check if any alarm should be triggered
    const currentTimeStr = currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    console.log('🕒 Checking alarms:', {
      currentTimeStr,
      alarms,
      isMuted,
      triggeredAlarm
    });

    const matchingAlarm = alarms.find(alarm => {
      const [hours, minutes] = alarm.split(':');
      const currentHours = currentTime.getHours().toString().padStart(2, '0');
      const currentMinutes = currentTime.getMinutes().toString().padStart(2, '0');
      const currentTimeFormatted = `${currentHours}:${currentMinutes}`;
      
      console.log('⏰ Comparing times:', {
        alarm: `${hours}:${minutes}`,
        current: currentTimeFormatted,
        matches: currentTimeFormatted === alarm
      });

      return currentTimeFormatted === alarm;
    });

    if (matchingAlarm) {
      console.log('🔔 Found matching alarm:', {
        matchingAlarm,
        isMuted,
        isAlreadyTriggered: matchingAlarm === triggeredAlarm
      });
    }

    if (matchingAlarm && !isMuted && matchingAlarm !== triggeredAlarm) {
      console.log('🚨 Triggering alarm:', matchingAlarm);
      
      setTriggeredAlarm(matchingAlarm);
      setPlayTriggerSound(true);
      
      if (Notification.permission === 'granted') {
        new Notification('⏰ Alarm!', {
          body: `It's ${matchingAlarm}`,
          icon: '/clock-icon.png',
          silent: true // We'll play our own sound
        });
      }
    }
  }, [currentTime, alarms, isMuted, triggeredAlarm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlarm && !alarms.includes(newAlarm)) {
      console.log('✨ Creating new alarm:', newAlarm);
      setAlarms(prev => [...prev, newAlarm].sort());
      setNewAlarm('');
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
    }
  };

  const handleDelete = (alarmToDelete: string) => {
    // If we're deleting a triggered alarm, stop the sound
    if (alarmToDelete === triggeredAlarm) {
      setPlayTriggerSound(false);
      setTriggeredAlarm(null);
    }
    setAlarms(alarms.filter(alarm => alarm !== alarmToDelete));
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="time"
            value={newAlarm}
            onChange={(e) => setNewAlarm(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Bell size={20} />
            Add Alarm
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {alarms.map((alarm) => (
          <div
            key={alarm}
            className={`flex items-center justify-between p-3 ${
              alarm === triggeredAlarm ? 'bg-red-100 dark:bg-red-900 animate-pulse' : 'bg-gray-100 dark:bg-gray-800'
            } rounded-lg`}
          >
            <span className="text-xl font-semibold">{alarm}</span>
            <button
              onClick={() => handleDelete(alarm)}
              className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-all"
              title="Delete alarm"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Sound component */}
      <AlarmSound
        type="trigger"
        play={playTriggerSound}
        onEnd={() => {
          setPlayTriggerSound(false);
          setTriggeredAlarm(null);
        }}
      />

      {alarms.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No alarms set. Add an alarm to get started.
        </p>
      )}
    </div>
  );
};