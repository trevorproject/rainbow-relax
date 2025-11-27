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

export const useAudio = () => {
  const { i18n } = useTranslation();
  const { config } = useWidgetConfig();

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
  }, [currentMusicType, config]);

  const createMusicInstance = useCallback((musicType: musicType, language: string) => {
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
  }, [config]);

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
              sound.volume(guidedVoiceEnabled ? 0.4 : 0);
              sound.play();
              setIsGuidedVoicePlaying(true);
            }
          });
        } else {
          const sound = guidedVoiceRef.current;
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
          sound.volume(guidedVoiceEnabled ? 0.4 : 0);
          if (!sound.playing()) {
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
    [audioUnlocked, guidedVoiceEnabled]
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
          const positionToSeek = seekPosition !== undefined 
            ? seekPosition 
            : (bgMusicSeekPositionRef.current > 0 ? bgMusicSeekPositionRef.current : undefined);
          
          if (positionToSeek !== undefined) {
            const duration = bgSound.duration() || 0;
            if (duration > 0) {
              bgSound.seek(positionToSeek % duration);
            } else {
              bgSound.seek(positionToSeek);
            }
            bgMusicSeekPositionRef.current = 0;
          }
          bgSound.volume(backgroundEnabled ? 0.3 : 0);
          if (!bgSound.playing()) {
            bgSound.play();
          }
        }
        if (instructionsRef.current) {
          const instrSound = instructionsRef.current;
          const positionToSeek = seekPosition !== undefined 
            ? seekPosition 
            : (instructionsSeekPositionRef.current > 0 ? instructionsSeekPositionRef.current : undefined);
          
          if (positionToSeek !== undefined) {
            const duration = instrSound.duration() || 0;
            if (duration > 0) {
              instrSound.seek(positionToSeek % duration);
            } else {
              instrSound.seek(positionToSeek);
            }
            instructionsSeekPositionRef.current = 0;
          }
          instrSound.volume(instructionsEnabled ? 0.4 : 0);
          if (!instrSound.playing()) {
            instrSound.play();
          }
        }
        if (backgroundEnabled || instructionsEnabled) {
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
    [
      audioUnlocked,
      backgroundEnabled,
      instructionsEnabled,
    ]
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
    const bgVolume = backgroundEnabled ? 0.3 : 0;
    const instructionsVolume = instructionsEnabled ? 0.4 : 0;
    const guidedVoiceVolume = guidedVoiceEnabled ? 0.4 : 0;
    
    if (bgMusicRef.current) {
      bgMusicRef.current.volume(bgVolume);
    }
    if (instructionsRef.current) {
      instructionsRef.current.volume(instructionsVolume);
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.volume(guidedVoiceVolume);
    }
    setIsGuidedVoicePlaying(guidedVoiceEnabled);
    setIsBackgroundMusicPlaying(backgroundEnabled || instructionsEnabled);
    pendingPlayRef.current = true;
  }, [backgroundEnabled, instructionsEnabled, guidedVoiceEnabled]);

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
    if (bgMusicRef.current) {
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
    if (instructionsRef.current) {
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
    if (guidedVoiceRef.current) {
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
