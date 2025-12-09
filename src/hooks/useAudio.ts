import { useEffect, useRef, useState, useCallback } from "react";
import { Howl } from "howler";
import {
  getGuidedVoiceConfig,
  getInstructionsConfig,
  getSoundConfig,
} from "../config/soundConfig";
import { musicType } from "../context/AudioContext";
import { useTranslation } from "react-i18next";
import { useWidgetConfig } from "../context/WidgetConfigContext";
import { useConsent } from "./useConsent";

export const useAudio = () => {
  const { i18n } = useTranslation();
  const { config } = useWidgetConfig();
  const { hasConsented } = useConsent();

  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const bgMusicRef = useRef<Howl | null>(null);
  const instructionsRef = useRef<Howl | null>(null);
  const guidedVoiceRef = useRef<Howl | null>(null);

  // Track playback positions to maintain sync when muting/unmuting
  const bgMusicSeekPositionRef = useRef<number>(0);
  const instructionsSeekPositionRef = useRef<number>(0);
  const guidedVoiceSeekPositionRef = useRef<number>(0);

  const backgroundEnabledRef = useRef<boolean>(true);
  const instructionsEnabledRef = useRef<boolean>(true);
  const guidedVoiceEnabledRef = useRef<boolean>(true);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const pendingPlayRef = useRef(false);
  
  // Load sound settings from localStorage
  const loadSoundSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem("rainbow-relax-sound-settings");
      if (stored) {
        const settings = JSON.parse(stored);
        return {
          backgroundEnabled: settings.backgroundEnabled !== false,
          instructionsEnabled: settings.instructionsEnabled !== false,
          guidedVoiceEnabled: settings.guidedVoiceEnabled !== false,
        };
      }
    } catch (e) {
      console.error("Failed to load sound settings from localStorage", e);
    }
    return {
      backgroundEnabled: true,
      instructionsEnabled: true,
      guidedVoiceEnabled: true,
    };
  }, []);

  const [backgroundEnabled, setBackgroundEnabled] = useState(() => loadSoundSettings().backgroundEnabled);
  const [instructionsEnabled, setInstructionsEnabled] = useState(() => loadSoundSettings().instructionsEnabled);
  const [guidedVoiceEnabled, setGuidedVoiceEnabled] = useState(() => loadSoundSettings().guidedVoiceEnabled);
  const [showSoundControl, setShowSoundControl] = useState(true);
  
  backgroundEnabledRef.current = backgroundEnabled;
  instructionsEnabledRef.current = instructionsEnabled;
  guidedVoiceEnabledRef.current = guidedVoiceEnabled;

  useEffect(() => {
    backgroundEnabledRef.current = backgroundEnabled;
  }, [backgroundEnabled]);

  useEffect(() => {
    instructionsEnabledRef.current = instructionsEnabled;
  }, [instructionsEnabled]);

  useEffect(() => {
    guidedVoiceEnabledRef.current = guidedVoiceEnabled;
  }, [guidedVoiceEnabled]);
  
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");

  // Save sound settings to localStorage
  const saveSoundSettings = useCallback((settings: { backgroundEnabled: boolean; instructionsEnabled: boolean; guidedVoiceEnabled: boolean }) => {
    try {
      localStorage.setItem("rainbow-relax-sound-settings", JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save sound settings to localStorage", e);
    }
  }, []);

  useEffect(() => {
    if (!hasConsented) {
      return;
    }
    
    setAudioUnlocked(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
    const soundConfigToUse = getSoundConfig(config, currentMusicType);
    const unlockSound = new Howl({
      ...soundConfigToUse[currentMusicType],
      volume: 0,
      onunlock: () => {
        setAudioUnlocked(true);
      },
    });

    unlockSound.load();

    return () => {
      unlockSound.unload();
    };
  }, [currentMusicType, config, hasConsented]);

  const createMusicInstance = useCallback((musicType: musicType, language: string) => {
    if (!hasConsented) {
      return;
    }
    
    const instructionsConfig = getInstructionsConfig(language, config, musicType);
    const guidedVoiceConfig = getGuidedVoiceConfig(language, config, musicType);
    if (musicType === "none") {
      if (bgMusicRef.current) {
        instructionsRef.current?.unload();
        instructionsRef.current = null;

        bgMusicRef.current.unload();
        bgMusicRef.current = null;

        guidedVoiceRef.current?.unload();
        guidedVoiceRef.current = null;
      }
      return;
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.unload();
    }
    if (instructionsRef.current) {
      instructionsRef.current.unload();
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.unload();
    }
    // Reset seek positions when creating new instances
    bgMusicSeekPositionRef.current = 0;
    instructionsSeekPositionRef.current = 0;
    guidedVoiceSeekPositionRef.current = 0;
    const soundConfigToUse = getSoundConfig(config, musicType);
    bgMusicRef.current = new Howl({
      ...soundConfigToUse[musicType],
      onplayerror: () => {
        pendingPlayRef.current = true;
      },
    });
    instructionsRef.current = new Howl({
      ...instructionsConfig[musicType],
      onplayerror: () => {
        pendingPlayRef.current = true;
      },
    });

    guidedVoiceRef.current = new Howl({
      ...guidedVoiceConfig[musicType],
      onplayerror: () => {
        pendingPlayRef.current = true;
      },
    });
  }, [config, hasConsented]);

  const setGuidedVoice = useCallback(
    (play: boolean, seekPosition?: number) => {
      if (!guidedVoiceRef.current) return;

      if (play) {
        if (!audioUnlocked) {
          pendingPlayRef.current = true;
          return;
        }

        if (guidedVoiceRef.current.state() !== "loaded") {
          guidedVoiceRef.current.once("load", () => {
            const sound = guidedVoiceRef.current;
            if (sound) {
              const positionToSeek = seekPosition !== undefined 
                ? seekPosition 
                : (guidedVoiceSeekPositionRef.current > 0 ? guidedVoiceSeekPositionRef.current : undefined);
              
              if (positionToSeek !== undefined) {
                const duration = sound.duration() || 0;
                if (duration > 0) {
                  sound.seek(positionToSeek % duration);
                } else {
                  sound.seek(positionToSeek);
                }
                guidedVoiceSeekPositionRef.current = 0;
              }
              sound.volume(guidedVoiceEnabledRef.current ? 0.4 : 0);
              sound.play();
              setIsGuidedVoicePlaying(true);
            }
          });
        } else {
          const sound = guidedVoiceRef.current;
          const isAlreadyPlaying = sound.playing();
          const positionToSeek = seekPosition !== undefined 
            ? seekPosition 
            : (guidedVoiceSeekPositionRef.current > 0 ? guidedVoiceSeekPositionRef.current : undefined);
          
          // Only seek if audio is not already playing, to avoid restarting playback
          if (positionToSeek !== undefined && !isAlreadyPlaying) {
            const duration = sound.duration() || 0;
            if (duration > 0) {
              sound.seek(positionToSeek % duration);
            } else {
              sound.seek(positionToSeek);
            }
            guidedVoiceSeekPositionRef.current = 0;
          }
          sound.volume(guidedVoiceEnabledRef.current ? 0.4 : 0);
          if (!isAlreadyPlaying) {
            sound.play();
          }
          setIsGuidedVoicePlaying(true);
        }
      } else {
        if (guidedVoiceRef.current.playing()) {
          guidedVoiceSeekPositionRef.current = guidedVoiceRef.current.seek() as number || 0;
        }
        guidedVoiceRef.current.pause();
        setIsGuidedVoicePlaying(false);
      }
    },
    [audioUnlocked]
  );

  const setBackgroundMusic = useCallback(
    (play: boolean, seekPosition?: number) => {
      if (!bgMusicRef.current) return;

      if (play) {
        if (!audioUnlocked) {
          pendingPlayRef.current = true;
          return;
        }
        if (bgMusicRef.current) {
          const bgSound = bgMusicRef.current;
          const isAlreadyPlaying = bgSound.playing();
          const positionToSeek = seekPosition !== undefined 
            ? seekPosition 
            : (bgMusicSeekPositionRef.current > 0 ? bgMusicSeekPositionRef.current : undefined);
                    if (positionToSeek !== undefined && !isAlreadyPlaying) {
            const duration = bgSound.duration() || 0;
            if (duration > 0) {
              bgSound.seek(positionToSeek % duration);
            } else {
              bgSound.seek(positionToSeek);
            }
            bgMusicSeekPositionRef.current = 0;
          }
          bgSound.volume(backgroundEnabledRef.current ? 0.3 : 0);
          if (!isAlreadyPlaying) {
            bgSound.play();
          }
        }
        if (instructionsRef.current) {
          const instrSound = instructionsRef.current;
          const isAlreadyPlaying = instrSound.playing();
          const positionToSeek = seekPosition !== undefined 
            ? seekPosition 
            : (instructionsSeekPositionRef.current > 0 ? instructionsSeekPositionRef.current : undefined);
          
          if (positionToSeek !== undefined && !isAlreadyPlaying) {
            const duration = instrSound.duration() || 0;
            if (duration > 0) {
              instrSound.seek(positionToSeek % duration);
            } else {
              instrSound.seek(positionToSeek);
            }
            instructionsSeekPositionRef.current = 0;
          }
          instrSound.volume(instructionsEnabledRef.current ? 0.4 : 0);
          if (!isAlreadyPlaying) {
            instrSound.play();
          }
        }
        if (backgroundEnabledRef.current || instructionsEnabledRef.current) {
          setIsBackgroundMusicPlaying(true);
        }
      } else {
        if (bgMusicRef.current && bgMusicRef.current.playing()) {
          bgMusicSeekPositionRef.current = bgMusicRef.current.seek() as number || 0;
        }
        if (instructionsRef.current && instructionsRef.current.playing()) {
          instructionsSeekPositionRef.current = instructionsRef.current.seek() as number || 0;
        }
        
        if (bgMusicRef.current) {
          bgMusicRef.current.pause();
        }
        if (instructionsRef.current) {
          instructionsRef.current.pause();
        }
        setIsBackgroundMusicPlaying(false);
      }
    },
    [audioUnlocked]
  );
  const stopMusicAndInstructions = useCallback(() => {
    // Save current positions before pausing (for pause button functionality)
    if (bgMusicRef.current && bgMusicRef.current.playing()) {
      bgMusicSeekPositionRef.current = bgMusicRef.current.seek() as number || 0;
    }
    if (instructionsRef.current && instructionsRef.current.playing()) {
      instructionsSeekPositionRef.current = instructionsRef.current.seek() as number || 0;
    }
    if (guidedVoiceRef.current && guidedVoiceRef.current.playing()) {
      guidedVoiceSeekPositionRef.current = guidedVoiceRef.current.seek() as number || 0;
    }
    
    // Now pause all sounds
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    if (instructionsRef.current) {
      instructionsRef.current.pause();
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.pause();
    }
    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
  }, []);

  const volumeDownMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume(0);
    }
    if (instructionsRef.current) {
      instructionsRef.current.volume(0);
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.volume(0);
    }
    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
  }, []);

  const volumeUpMusic = useCallback(() => {
    const bgVolume = backgroundEnabledRef.current ? 0.3 : 0;
    const instructionsVolume = instructionsEnabledRef.current ? 0.4 : 0;
    const guidedVoiceVolume = guidedVoiceEnabledRef.current ? 0.4 : 0;
    
    if (bgMusicRef.current) {
      bgMusicRef.current.volume(bgVolume);
    }
    if (instructionsRef.current) {
      instructionsRef.current.volume(instructionsVolume);
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.volume(guidedVoiceVolume);
    }
    setIsGuidedVoicePlaying(guidedVoiceEnabledRef.current);
    setIsBackgroundMusicPlaying(backgroundEnabledRef.current || instructionsEnabledRef.current);
    pendingPlayRef.current = true;
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (pendingPlayRef.current && bgMusicRef.current) {
      bgMusicRef.current.play();
      setIsBackgroundMusicPlaying(true);
      pendingPlayRef.current = false;
    }
    if (pendingPlayRef.current && instructionsRef.current) {
      instructionsRef.current.play();
      pendingPlayRef.current = false;
    }
  }, []);

  useEffect(() => {
    const interactionEvents = ["click", "touchstart", "keydown"];
    const handleInteraction = () => handleUserInteraction();

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handleInteraction, { once: true });
    });

    return () => {
      interactionEvents.forEach((event) => {
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
        instructionsRef.current?.stop();
        instructionsRef.current?.unload();
        instructionsRef.current = null;
      }
    };
  }, []);

  const initAudio = useCallback(
    (musicType: musicType) => {
      setCurrentMusicType(musicType);
      createMusicInstance(musicType, i18n.language);
    },
    [i18n.language, createMusicInstance]
  );

  // Wrapper functions to update state and persist to localStorage
  const setBackgroundEnabledWithPersistence = useCallback((enabled: boolean) => {
    setBackgroundEnabled(enabled);
    saveSoundSettings({
      backgroundEnabled: enabled,
      instructionsEnabled,
      guidedVoiceEnabled,
    });
    // When muting/unmuting, use volume control instead of pause/play
    // This keeps playback continuing so position stays in sync
    if (bgMusicRef.current && bgMusicRef.current.playing()) {
      const targetVolume = enabled ? 0.3 : 0;
      bgMusicRef.current.volume(targetVolume);
    }
  }, [instructionsEnabled, guidedVoiceEnabled, saveSoundSettings]);

  const setInstructionsEnabledWithPersistence = useCallback((enabled: boolean) => {
    setInstructionsEnabled(enabled);
    saveSoundSettings({
      backgroundEnabled,
      instructionsEnabled: enabled,
      guidedVoiceEnabled,
    });
    // When muting/unmuting, use volume control instead of pause/play
    // This keeps playback continuing so position stays in sync
    if (instructionsRef.current && instructionsRef.current.playing()) {
      const targetVolume = enabled ? 0.4 : 0;
      instructionsRef.current.volume(targetVolume);
    }
  }, [backgroundEnabled, guidedVoiceEnabled, saveSoundSettings]);

  const setGuidedVoiceEnabledWithPersistence = useCallback((enabled: boolean) => {
    setGuidedVoiceEnabled(enabled);
    saveSoundSettings({
      backgroundEnabled,
      instructionsEnabled,
      guidedVoiceEnabled: enabled,
    });
    // When muting/unmuting, use volume control instead of pause/play
    // This keeps playback continuing so position stays in sync
    if (guidedVoiceRef.current && guidedVoiceRef.current.playing()) {
      const targetVolume = enabled ? 0.4 : 0;
      guidedVoiceRef.current.volume(targetVolume);
    }
  }, [backgroundEnabled, instructionsEnabled, saveSoundSettings]);

  return {
    setBackgroundMusic,
    setGuidedVoice,
    volumeDownMusic,
    volumeUpMusic,
    stopMusicAndInstructions,
    isBackgroundMusicPlaying,
    isGuidedVoicePlaying,
    handleUserInteraction,
    audioUnlocked,
    backgroundEnabled,
    setBackgroundEnabled: setBackgroundEnabledWithPersistence,
    instructionsEnabled,
    setInstructionsEnabled: setInstructionsEnabledWithPersistence,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled: setGuidedVoiceEnabledWithPersistence,
    initAudio,
    showSoundControl,
    setShowSoundControl,
  };
};
