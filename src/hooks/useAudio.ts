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
  const [isInstructionsPlaying, setIsInstructionsPlaying] = useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const bgMusicRef = useRef<Howl | null>(null);
  const instructionsRef = useRef<Howl | null>(null);
  const guidedVoiceRef = useRef<Howl | null>(null);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const pendingPlayRef = useRef(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");

  useEffect(() => {
    setAudioUnlocked(false);
    setIsBackgroundMusicPlaying(false);
    setIsInstructionsPlaying(false);
    pendingPlayRef.current = false;
    const soundConfigToUse = getSoundConfig(config);
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

  const createMusicInstance = (musicType: musicType, language: string) => {
    const instructionsConfig = getInstructionsConfig(language);
    const guidedVoiceConfig = getGuidedVoiceConfig(language);
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
    const soundConfigToUse = getSoundConfig(config);
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
  };

  const setGuidedVoice = useCallback(
    (play: boolean) => {
      if (!isSoundEnabled && play) return;
      if (play === isGuidedVoicePlaying) return;
      if (!guidedVoiceRef.current) return;

      if (play) {
        if (!audioUnlocked) {
          pendingPlayRef.current = true;
          return;
        }

        if (guidedVoiceRef.current.state() !== "loaded") {
          guidedVoiceRef.current.once("load", () => {
            guidedVoiceRef.current?.play();
            setIsGuidedVoicePlaying(true);
          });
        } else {
          guidedVoiceRef.current.play();
          setIsGuidedVoicePlaying(true);
        }
      } else {
        guidedVoiceRef.current.pause();
        setIsGuidedVoicePlaying(false);
      }
    },
    [isGuidedVoicePlaying, audioUnlocked, isSoundEnabled]
  );

  const setBackgroundMusic = useCallback(
    (play: boolean) => {
      if (!isSoundEnabled && play) return;
      if (play === isBackgroundMusicPlaying) return;
      if (!bgMusicRef.current) return;

      if (play) {
        if (!audioUnlocked) {
          pendingPlayRef.current = true;
          return;
        }
        instructionsRef.current?.play();
        setIsInstructionsPlaying(true);
        bgMusicRef.current.play();
        setIsBackgroundMusicPlaying(true);
      } else {
        instructionsRef.current?.pause();
        setIsInstructionsPlaying(false);
        bgMusicRef.current.pause();
        setIsBackgroundMusicPlaying(false);
      }
    },
    [
      isInstructionsPlaying,
      isBackgroundMusicPlaying,
      audioUnlocked,
      isSoundEnabled,
    ]
  );
  const stopMusicAndInstructions = useCallback(() => {
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
    setIsInstructionsPlaying(false);
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
    setIsInstructionsPlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
  }, []);

  const volumeUpMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume(0.4);
    }
    if (instructionsRef.current) {
      instructionsRef.current.volume(0.4);
    }
    if (guidedVoiceRef.current) {
      guidedVoiceRef.current.volume(0.4);
    }
    setIsGuidedVoicePlaying(true);
    setIsInstructionsPlaying(true);
    setIsBackgroundMusicPlaying(true);
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
      setIsInstructionsPlaying(true);
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
    [i18n.language, config]
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
