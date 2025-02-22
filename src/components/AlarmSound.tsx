import React, { useEffect, useRef } from 'react';

interface AlarmSoundProps {
  type: 'creation' | 'trigger';
  play: boolean;
  onEnd?: () => void;
}

export const AlarmSound: React.FC<AlarmSoundProps> = ({ type, play, onEnd }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const soundUrl = type === 'creation'
    ? 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    : 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

  useEffect(() => {
    const playSound = async () => {
      if (!audioRef.current) return;
      
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = type === 'creation' ? 0.5 : 1.0;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`🎵 Playing ${type} sound`);
            })
            .catch(error => {
              console.error('❌ Error playing sound:', error);
              if (error.name === 'NotAllowedError') {
                console.log('⚠️ Please interact with the page first to enable sounds');
              }
            });
        }
      } catch (error) {
        console.error('❌ Error in playSound:', error);
      }
    };

    if (play) {
      playSound();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [play, type]);

  return (
    <audio
      ref={audioRef}
      src={soundUrl}
      preload="auto"
      loop={type === 'trigger'}
      onEnded={() => {
        console.log(`✅ ${type} sound finished playing`);
        if (type === 'trigger') {
          // For trigger sound, keep playing until manually stopped
          if (audioRef.current && play) {
            audioRef.current.play();
          }
        } else {
          onEnd?.();
        }
      }}
      onError={(e) => {
        console.error('❌ Audio error:', e);
      }}
    />
  );
};
