import { ReactNode, useCallback, useState, useEffect, useRef } from "react";
import { AudioContext, AudioContextType } from "../context/AudioContext";
import { useTranslation } from "react-i18next";

interface SimpleWidgetAudioProps {
  children: ReactNode;
}

export const SimpleWidgetAudio = ({ children }: SimpleWidgetAudioProps) => {
  const { i18n } = useTranslation();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

  const getWidgetConfig = useCallback(() => {
    if (typeof window !== 'undefined' && (window as any).myWidgetConfig) {
      return (window as any).myWidgetConfig;
    }
    return { cdnBase: './src/assets', audioEnabled: true };
  }, []);

  const canLoadAudio = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const config = getWidgetConfig();
    return config.audioEnabled !== false && !!config.cdnBase && 
           (window.location.protocol === 'http:' || window.location.protocol === 'https:');
  }, [getWidgetConfig]);

  const createAudioElements = useCallback(() => {
    if (!canLoadAudio()) {
      return;
    }

    const config = getWidgetConfig();
    const cdnBase = config.cdnBase;
    const language = i18n.language || 'en';

    // Clean up existing audio
    [backgroundAudioRef, voiceAudioRef, introAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.src = '';
        ref.current = null;
      }
    });

    // Create background music
    const backgroundAudio = new Audio(`${cdnBase}/sounds/Background.mp3`);
    backgroundAudio.loop = true;
    backgroundAudio.volume = 0.3;
    backgroundAudio.preload = 'auto';
    backgroundAudioRef.current = backgroundAudio;

    // Create voice instructions
    const voiceAudio = new Audio(`${cdnBase}/sounds/cycle-${language}.mp3`);
    voiceAudio.loop = true;
    voiceAudio.volume = 0.6;
    voiceAudio.preload = 'auto';
    voiceAudioRef.current = voiceAudio;

    // Create intro voice
    const introAudio = new Audio(`${cdnBase}/sounds/intro-${language}.mp3`);
    introAudio.loop = false;
    introAudio.volume = 0.8;
    introAudio.preload = 'auto';
    introAudioRef.current = introAudio;

  }, [canLoadAudio, getWidgetConfig, i18n.language]);

  // Background music control
  const setBackgroundMusic = useCallback(async (play: boolean) => {
    if (!canLoadAudio() || !backgroundAudioRef.current || !audioUnlocked) {
      return;
    }

    try {
      if (play && !isBackgroundMusicPlaying && isSoundEnabled) {
        await backgroundAudioRef.current.play();
        setIsBackgroundMusicPlaying(true);
      } else if (!play && isBackgroundMusicPlaying) {
        backgroundAudioRef.current.pause();
        setIsBackgroundMusicPlaying(false);
      }
    } catch {
      // Ignore background music errors
    }
  }, [canLoadAudio, audioUnlocked, isBackgroundMusicPlaying, isSoundEnabled]);

  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioTypeRef = useRef<'intro' | 'cycle' | null>(null);

  const setGuidedVoice = useCallback(async (play: boolean, duration?: number) => {
    if (!canLoadAudio() || !audioUnlocked) {
      return;
    }

    try {
      if (!play) {
        // Stop all voice audio
        [voiceAudioRef, introAudioRef].forEach(ref => {
          if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
          }
        });

        // Clear any existing timeout
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }

        currentAudioTypeRef.current = null;
        return;
      }

      if (!isSoundEnabled) return;

      const audioType = duration && duration > 0 ? 'cycle' : 'intro';
      
      if (currentAudioTypeRef.current && currentAudioTypeRef.current !== audioType) {
        
        // Stop current audio
        [voiceAudioRef, introAudioRef].forEach(ref => {
          if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
          }
        });

        // Clear any existing timeout
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }

        await new Promise(resolve => setTimeout(resolve, 150));
      }

      currentAudioTypeRef.current = audioType;

      if (audioType === 'cycle') {
        if (voiceAudioRef.current) {
          voiceAudioRef.current.currentTime = 0;
          await voiceAudioRef.current.play();
          
          voiceTimeoutRef.current = setTimeout(() => {
            if (voiceAudioRef.current) {
              voiceAudioRef.current.pause();
              voiceAudioRef.current.currentTime = 0;
            }
            currentAudioTypeRef.current = null;
            voiceTimeoutRef.current = null;
          }, ((duration || 60) + 1) * 1000);
        }
      } else {
        if (introAudioRef.current) {
          introAudioRef.current.currentTime = 0;
          await introAudioRef.current.play();
          
          introAudioRef.current.onended = () => {
            currentAudioTypeRef.current = null;
          };
        }
      }
    } catch {
      currentAudioTypeRef.current = null;
    }
  }, [canLoadAudio, audioUnlocked, isSoundEnabled]);

  const volumeDownMusic = useCallback(() => {
    [backgroundAudioRef, voiceAudioRef, introAudioRef].forEach(ref => {
      if (ref.current) ref.current.volume = 0;
    });
  }, []);

  const volumeUpMusic = useCallback(() => {
    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = 0.3;
    if (voiceAudioRef.current) voiceAudioRef.current.volume = 0.6;
    if (introAudioRef.current) introAudioRef.current.volume = 0.8;
  }, []);

  // Stop all audio
  const stopMusicAndInstructions = useCallback(() => {
    // Clear any voice timeout
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    // Reset audio type tracking
    currentAudioTypeRef.current = null;

    // Stop all audio elements
    [backgroundAudioRef, voiceAudioRef, introAudioRef].forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    setIsBackgroundMusicPlaying(false);
  }, []);

  // Handle user interaction to unlock audio
  const handleUserInteraction = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
    }
  }, [audioUnlocked]);

  // Initialize audio
  const initAudio = useCallback(async (musicType: "none" | "4-7-8") => {
    if (musicType === "none") {
      stopMusicAndInstructions();
      return;
    }

    createAudioElements();
    
    if (!audioUnlocked) {
      setAudioUnlocked(true);
    }
  }, [i18n.language, createAudioElements, stopMusicAndInstructions, audioUnlocked]);

  useEffect(() => {
    createAudioElements();
  }, [createAudioElements, canLoadAudio, isSoundEnabled]);

  useEffect(() => {
    if (currentLanguage !== i18n.language) {
      setCurrentLanguage(i18n.language);
      createAudioElements();
    }
  }, [i18n.language, currentLanguage, createAudioElements]);

  // Auto-unlock audio on user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioUnlocked) {
        handleUserInteraction();
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, [audioUnlocked, handleUserInteraction]);

  const safeSetIsSoundEnabled = useCallback((enabled: boolean) => {
    setIsSoundEnabled(enabled);
    
    if (!enabled) {
      stopMusicAndInstructions();
    }
  }, [stopMusicAndInstructions]);

  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
      [backgroundAudioRef, voiceAudioRef, introAudioRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = '';
        }
      });
    };
  }, []);

  const contextValue: AudioContextType = {
    setBackgroundMusic,
    setGuidedVoice,
    volumeDownMusic,
    volumeUpMusic,
    stopMusicAndInstructions,
    isBackgroundMusicPlaying,
    handleUserInteraction,
    audioUnlocked,
    isSoundEnabled,
    setIsSoundEnabled: safeSetIsSoundEnabled,
    initAudio,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
