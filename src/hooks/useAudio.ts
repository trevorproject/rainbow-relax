import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { soundConfig } from '../config/soundConfig';
import { musicType } from '../context/AudioContext';

export const useAudio = () => {
  const bgMusicRef = useRef<Howl | null>(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const pendingPlayRef = useRef(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");
  

  useEffect(() => {
    setAudioUnlocked(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
    const unlockSound = new Howl({
      ...soundConfig[currentMusicType],
      volume: 0,
      onunlock: () => {
        setAudioUnlocked(true);
      }
    });
    
    unlockSound.load();
    createMusicInstance(currentMusicType);
    
    return () => {
      unlockSound.unload();
    };
  }, [currentMusicType]);

  const createMusicInstance = (musicType: musicType) => {
    if (musicType === "none") {
      if (bgMusicRef.current) {
        bgMusicRef.current.unload();
        bgMusicRef.current = null;
      }
      return;
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.unload();
    }
    bgMusicRef.current = new Howl({
      ...soundConfig[musicType],
      onplayerror: () => {
        pendingPlayRef.current = true;
      }
    });
  };
  const setBackgroundMusic = useCallback((play: boolean) => {
    if (!isSoundEnabled && play) return;
    if (play === isBackgroundMusicPlaying) return;
    if (!bgMusicRef.current) return;
    
    if (play) {
      if (!audioUnlocked) {
        pendingPlayRef.current = true;
        return;
      }
      bgMusicRef.current.play();
      setIsBackgroundMusicPlaying(true);
    } else {
      bgMusicRef.current.pause();
      setIsBackgroundMusicPlaying(false);
    }
  }, [isBackgroundMusicPlaying, audioUnlocked, isSoundEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop();
    }
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (pendingPlayRef.current && bgMusicRef.current) {
      bgMusicRef.current.play();
      setIsBackgroundMusicPlaying(true);
      pendingPlayRef.current = false;
    }
  }, []);

  useEffect(() => {
    const interactionEvents = ['click', 'touchstart', 'keydown'];
    const handleInteraction = () => handleUserInteraction();
    
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });
    
    return () => {
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [handleUserInteraction]);

  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.stop();
        bgMusicRef.current.unload();
        bgMusicRef.current = null;
      }
    };
  }, []);

  const initAudio = useCallback((musicType: musicType) => {
    setCurrentMusicType(musicType);
  }, []);

  return {
    setBackgroundMusic,
    stopBackgroundMusic,
    isBackgroundMusicPlaying,
    handleUserInteraction,
    audioUnlocked,
    isSoundEnabled,
    setIsSoundEnabled,
    initAudio
  };
};