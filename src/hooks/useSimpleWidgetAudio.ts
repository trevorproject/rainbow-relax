
import { useEffect, useRef, useState, useCallback } from "react";
import { musicType } from "../context/AudioContext";
import { useTranslation } from "react-i18next";

export const useSimpleWidgetAudio = () => {
  const { i18n } = useTranslation();

  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const instructionsRef = useRef<HTMLAudioElement | null>(null);
  const guidedVoiceRef = useRef<HTMLAudioElement | null>(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");

  const canLoadAudio = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const config = (window as any).myWidgetConfig;
    return (
      config?.audioEnabled !== false && 
      !!config?.cdnBase && 
      (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    );
  }, []);

  useEffect(() => {
    if (!canLoadAudio()) {
      return;
    }

    setAudioUnlocked(false);
    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);

    const unlockAudio = () => {
      setAudioUnlocked(true);
    };

    const interactionEvents = ['click', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      unlockAudio();
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    const fallbackTimeout = setTimeout(() => {
      setAudioUnlocked(true);
    }, 1000);

    return () => {
      clearTimeout(fallbackTimeout);
      interactionEvents.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, [currentMusicType, canLoadAudio]);

  const createAudioElement = (src: string, loop: boolean = false, volume: number = 1.0): HTMLAudioElement => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = 'auto';
    
    // Add audio element to DOM for debugging and proper functionality
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    console.log('[Simple Widget Audio] Created audio element:', {
      src: audio.src,
      loop: audio.loop,
      volume: audio.volume
    });
    
    return audio;
  };

  const createMusicInstance = useCallback(async (musicType: musicType, language: string) => {
    console.log('[Simple Widget Audio] createMusicInstance called:', { musicType, language });
    
    if (!canLoadAudio()) {
      console.log('[Simple Widget Audio] Audio loading disabled or config invalid');
      return;
    }

    const config = (window as any).myWidgetConfig;
    const soundBase = config?.cdnBase ? `${config.cdnBase}sounds/` : './sounds/';
    
    console.log('[Simple Widget Audio] Using sound base:', soundBase);
    
    try {
      if (musicType === "none") {
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
          bgMusicRef.current = null;
        }
        if (instructionsRef.current) {
          instructionsRef.current.pause();
          instructionsRef.current = null;
        }
        if (guidedVoiceRef.current) {
          guidedVoiceRef.current.pause();
          guidedVoiceRef.current = null;
        }
        return;
      }

      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (instructionsRef.current) {
        instructionsRef.current.pause();
        instructionsRef.current = null;
      }
      if (guidedVoiceRef.current) {
        guidedVoiceRef.current.pause();
        guidedVoiceRef.current = null;
      }


      const bgMusicSrc = soundBase + 'Background.mp3';
      bgMusicRef.current = createAudioElement(bgMusicSrc, true, 0.3);
      bgMusicRef.current.addEventListener('error', (e) => console.warn('[Simple Widget Audio] Background music error:', e));

      const instructionsSrc = soundBase + (language === "es" ? "cycle-es.mp3" : "cycle-en.mp3");
      instructionsRef.current = createAudioElement(instructionsSrc, true, 0.4);
      instructionsRef.current.addEventListener('error', (e) => console.warn('[Simple Widget Audio] Instructions error:', e));

      const guidedVoiceSrc = soundBase + (language === "es" ? "intro-es.mp3" : "intro-en.mp3");
      guidedVoiceRef.current = createAudioElement(guidedVoiceSrc, false, 0.4);
      guidedVoiceRef.current.addEventListener('error', (e) => console.warn('[Simple Widget Audio] Guided voice error:', e));

    } catch (error) {
      console.error('[Simple Widget Audio] Error creating music instances:', error);
    }
  }, [canLoadAudio]);

  const setBackgroundMusic = useCallback(
    (play: boolean) => {
      if (!canLoadAudio() || (!isSoundEnabled && play)) return;
      if (play === isBackgroundMusicPlaying) return;
      if (!bgMusicRef.current) {
        return;
      }

      if (play) {
        if (!audioUnlocked) {
          return;
        }
        try {
          bgMusicRef.current.play();
          setIsBackgroundMusicPlaying(true);
        } catch (error) {
          console.warn('[Simple Widget Audio] Background music play error:', error);
        }
      } else {
        try {
          bgMusicRef.current.pause();
          setIsBackgroundMusicPlaying(false);
        } catch (error) {
          console.warn('[Simple Widget Audio] Background music pause error:', error);
        }
      }
    },
    [isBackgroundMusicPlaying, audioUnlocked, isSoundEnabled, canLoadAudio]
  );

  const setGuidedVoice = useCallback(
    (play: boolean) => {
      if (!canLoadAudio() || (!isSoundEnabled && play)) return;
      if (play === isGuidedVoicePlaying) return;
      if (!guidedVoiceRef.current) {
        return;
      }

      if (play) {
        if (!audioUnlocked) {
          return;
        }
        try {
          guidedVoiceRef.current.play();
          setIsGuidedVoicePlaying(true);
        } catch (error) {
          console.warn('[Simple Widget Audio] Guided voice error:', error);
        }
      } else {
        try {
          guidedVoiceRef.current.pause();
          setIsGuidedVoicePlaying(false);
        } catch (error) {
          console.warn('[Simple Widget Audio] Guided voice pause error:', error);
        }
      }
    },
    [isGuidedVoicePlaying, audioUnlocked, isSoundEnabled, canLoadAudio]
  );

  const stopMusicAndInstructions = useCallback(() => {
    try {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
      if (instructionsRef.current) {
        instructionsRef.current.pause();
      }
      if (guidedVoiceRef.current) {
        guidedVoiceRef.current.pause();
      }
    } catch (error) {
      console.warn('[Simple Widget Audio] Error stopping audio:', error);
    }
    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
  }, []);

  const volumeDownMusic = useCallback(() => {
    try {
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0;
      }
      if (instructionsRef.current) {
        instructionsRef.current.volume = 0;
      }
      if (guidedVoiceRef.current) {
        guidedVoiceRef.current.volume = 0;
      }
    } catch (error) {
      console.warn('[Simple Widget Audio] Error setting volume down:', error);
    }
    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
  }, []);

  const volumeUpMusic = useCallback(() => {
    try {
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = 0.3;
      }
      if (instructionsRef.current) {
        instructionsRef.current.volume = 0.4;
      }
      if (guidedVoiceRef.current) {
        guidedVoiceRef.current.volume = 0.4;
      }
    } catch (error) {
      console.warn('[Simple Widget Audio] Error setting volume up:', error);
    }
    setIsGuidedVoicePlaying(true);
    setIsBackgroundMusicPlaying(true);
  }, []);

  const handleUserInteraction = useCallback(() => {
  }, []);

  useEffect(() => {
    return () => {
      try {
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
          bgMusicRef.current = null;
        }
        if (instructionsRef.current) {
          instructionsRef.current.pause();
          instructionsRef.current = null;
        }
        if (guidedVoiceRef.current) {
          guidedVoiceRef.current.pause();
          guidedVoiceRef.current = null;
        }
      } catch (error) {
        console.warn('[Simple Widget Audio] Error during cleanup:', error);
      }
    };
  }, []);

  const initAudio = useCallback(
    async (musicType: musicType) => {
      setCurrentMusicType(musicType);
      
      try {
        await createMusicInstance(musicType, i18n.language);
        return true;
      } catch (error) {
        console.error('[Simple Widget Audio] Failed to initialize audio:', error);
        return false;
      }
    },
    [i18n.language, createMusicInstance]
  );

  return {
    setBackgroundMusic,
    setGuidedVoice,
    volumeDownMusic,
    volumeUpMusic,
    stopMusicAndInstructions,
    isBackgroundMusicPlaying,
    handleUserInteraction,
    audioUnlocked,
    isSoundEnabled,
    setIsSoundEnabled,
    initAudio,
  };
};
