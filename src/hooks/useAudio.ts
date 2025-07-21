import { useEffect, useRef, useState, useCallback } from "react";
import { Howl } from "howler";
import { getInstructionsConfig, soundConfig } from "../config/soundConfig";
import { musicType } from "../context/AudioContext";
import { useTranslation } from "react-i18next";

export const useAudio = () => {
  const { i18n } = useTranslation();

  const bgMusicRef = useRef<Howl | null>(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const instructionsRef = useRef<Howl | null>(null);
  const [isInstructionsPlaying, setIsInstructionsPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const pendingPlayRef = useRef(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");

  useEffect(() => {
    setAudioUnlocked(false);
    setIsBackgroundMusicPlaying(false);
    setIsInstructionsPlaying(false);
    pendingPlayRef.current = false;
    const unlockSound = new Howl({
      ...soundConfig[currentMusicType],
      volume: 0,
      onunlock: () => {
        setAudioUnlocked(true);
      },
    });

    unlockSound.load();

    return () => {
      unlockSound.unload();
    };
  }, [currentMusicType]);

  const createMusicInstance = (musicType: musicType, language: string) => {
    const instructionsConfig = getInstructionsConfig(language);
    if (musicType === "none") {
      if (bgMusicRef.current) {
        instructionsRef.current?.unload();
        instructionsRef.current = null;

        bgMusicRef.current.unload();
        bgMusicRef.current = null;
      }
      return;
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.unload();
    }
    if (instructionsRef.current) {
      instructionsRef.current.unload();
    }
    bgMusicRef.current = new Howl({
      ...soundConfig[musicType],
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
  };
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

  const stopBackgroundMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.stop();
    }
    if (instructionsRef.current) {
      instructionsRef.current.stop();
    }
    setIsInstructionsPlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingPlayRef.current = false;
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
      createMusicInstance(currentMusicType, i18n.language);
    },
    [i18n.language]
  );

  return {
    setBackgroundMusic,
    stopBackgroundMusic,
    isBackgroundMusicPlaying,
    handleUserInteraction,
    audioUnlocked,
    isSoundEnabled,
    setIsSoundEnabled,
    initAudio,
  };
};
