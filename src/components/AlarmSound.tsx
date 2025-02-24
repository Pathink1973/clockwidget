import React, { useEffect, useRef } from 'react';

interface AlarmSoundProps {
  play: boolean;
  onEnd?: () => void;
}

export const AlarmSound: React.FC<AlarmSoundProps> = ({ play, onEnd }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundUrl = '/sounds/alarm.mp3';

  useEffect(() => {
    const playSound = async () => {
      if (!audioRef.current) return;
      
      try {
        console.log('🎵 Attempting to play alarm sound');
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 1.0;
        
        // Ensure the audio is loaded before playing
        if (audioRef.current.readyState < 2) { // HAVE_CURRENT_DATA
          await new Promise((resolve) => {
            audioRef.current!.addEventListener('canplay', resolve, { once: true });
          });
        }
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Successfully playing alarm sound');
            })
            .catch(error => {
              console.error('❌ Error playing sound:', error);
              if (error.name === 'NotAllowedError') {
                console.log('⚠️ Audio permission denied. Please interact with the page first');
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
      console.log('⏹️ Stopping alarm sound');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [play]);

  return (
    <audio
      ref={audioRef}
      src={soundUrl}
      preload="auto"
      loop={true}
      onEnded={() => {
        console.log('✅ Alarm sound finished playing');
        // For trigger sound, keep playing until manually stopped
        if (audioRef.current && play) {
          console.log('🔄 Restarting alarm sound');
          audioRef.current.play().catch(error => {
            console.error('❌ Error restarting sound:', error);
          });
        } else {
          onEnd?.();
        }
      }}
      onError={(e) => {
        console.error('❌ Audio error:', e);
      }}
      onCanPlayThrough={() => {
        console.log('✅ Audio loaded and ready to play');
      }}
    />
  );
};
