import { useCallback, useEffect, useRef, useState } from "react";
import { Howl, HowlOptions, Howler } from "howler";
import { useTranslation } from "react-i18next";
import { useWidgetConfig } from "../context/WidgetConfigContext";
import { useConsent } from "./useConsent";
import { musicType } from "../context/AudioContext";
import {
  getGuidedVoiceConfig,
  getInstructionsConfig,
  getSoundConfig,
} from "../config/soundConfig";

type TrackKind = "bg" | "instr" | "voice" | "closure";
type SoundSettings = {
  backgroundEnabled: boolean;
  instructionsEnabled: boolean;
  guidedVoiceEnabled: boolean;
  closureEnabled: boolean;
};

const STORAGE_KEY = "rainbow-relax-sound-settings";

const ignore = () => undefined;

const firstSrc = (opts: HowlOptions | undefined) => {
  const s = opts?.src as unknown;
  if (!s) return "";
  if (Array.isArray(s)) return String(s[0] ?? "");
  return String(s);
};

const safeOffUnload = (howl: Howl | null) => {
  if (!howl) return;
  try { howl.off(); } catch { ignore(); }
  try { howl.stop(); } catch { ignore(); }
  try { howl.unload(); } catch { ignore(); }
};

export const useAudio = () => {
  const { i18n } = useTranslation();
  const { config } = useWidgetConfig();
  const { hasConsented } = useConsent();

  const loadSoundSettings = useCallback((): SoundSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const s = JSON.parse(stored);
        return {
          backgroundEnabled: s.backgroundEnabled !== false,
          instructionsEnabled: s.instructionsEnabled !== false,
          guidedVoiceEnabled: s.guidedVoiceEnabled !== false,
          closureEnabled: s.closureEnabled !== false,
        };
      }
    } catch { ignore(); }
    return { backgroundEnabled: true, instructionsEnabled: true, guidedVoiceEnabled: true, closureEnabled: true };
  }, []);

  const saveSoundSettings = useCallback((s: SoundSettings) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { ignore(); }
  }, []);

  const [backgroundEnabled, _setBackgroundEnabled] = useState(() => loadSoundSettings().backgroundEnabled);
  const [instructionsEnabled, _setInstructionsEnabled] = useState(() => loadSoundSettings().instructionsEnabled);
  const [guidedVoiceEnabled, _setGuidedVoiceEnabled] = useState(() => loadSoundSettings().guidedVoiceEnabled);
  const [closureEnabled] = useState(() => loadSoundSettings().closureEnabled);
  const [showSoundControl, setShowSoundControl] = useState(true);

  const backgroundEnabledRef = useRef(backgroundEnabled);
  const instructionsEnabledRef = useRef(instructionsEnabled);
  const guidedVoiceEnabledRef = useRef(guidedVoiceEnabled);
  const closureEnabledRef = useRef(closureEnabled);

  useEffect(() => { backgroundEnabledRef.current = backgroundEnabled; }, [backgroundEnabled]);
  useEffect(() => { instructionsEnabledRef.current = instructionsEnabled; }, [instructionsEnabled]);
  useEffect(() => { guidedVoiceEnabledRef.current = guidedVoiceEnabled; }, [guidedVoiceEnabled]);
  useEffect(() => { closureEnabledRef.current = closureEnabled; }, [closureEnabled]);

  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const langRef = useRef(i18n.language);
  useEffect(() => { langRef.current = i18n.language; }, [i18n.language]);

  const audioGenRef = useRef(0);
  const cacheRef = useRef<Map<string, Howl>>(new Map());
  const activeKeysRef = useRef<{ bg?: string; instr?: string; voice?: string; closure?: string }>({});
  const seekRef = useRef<{ bg: number; instr: number; voice: number }>({ bg: 0, instr: 0, voice: 0 });

  const pendingActionRef = useRef<null | (() => void)>(null);
  const lastIntentRef = useRef<null | (() => void)>(null);

  const getHowl = useCallback((kind: TrackKind): Howl | null => {
    const key = activeKeysRef.current[kind];
    if (!key) return null;
    return cacheRef.current.get(key) ?? null;
  }, []);

  const makeKey = useCallback((kind: TrackKind, mt: musicType, lang: string, src: string) => {
    if (kind === "bg") return `bg|${mt}|${src}`;
    return `${kind}|${mt}|${lang}|${src}`;
  }, []);

  const waitForHowlLoaded = (howl: Howl | null, timeoutMs: number) => {
    if (!howl) return Promise.resolve(true);
    if (howl.state() === "loaded") return Promise.resolve(true);

    return new Promise<boolean>((resolve) => {
      let done = false;

      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        cleanup();
        resolve(ok);
      };

      const onLoad = () => finish(true);
      const onErr = () => finish(false);
      const timer = window.setTimeout(() => finish(false), timeoutMs);

      const cleanup = () => {
        window.clearTimeout(timer);
        try { howl.off("load", onLoad); } catch { ignore(); }
        try { howl.off("loaderror", onErr); } catch { ignore(); }
      };

      howl.once("load", onLoad);
      howl.once("loaderror", onErr);
    });
  };

  const waitForAudioLoad = useCallback(async (timeoutMs: number = 5000) => {
    const gen = audioGenRef.current;

    const [bgOk, instrOk, voiceOk] = await Promise.all([
      waitForHowlLoaded(getHowl("bg"), timeoutMs),
      waitForHowlLoaded(getHowl("instr"), timeoutMs),
      waitForHowlLoaded(getHowl("voice"), timeoutMs),
    ]);

    if (audioGenRef.current !== gen) return false;
    return bgOk && instrOk && voiceOk;
  }, [getHowl]);

  const playWhenLoaded = useCallback(
    (howl: Howl, genAtBind: number, doPlay: () => void) => {
      if (howl.state() === "loaded") {
        doPlay();
        return;
      }

      howl.once("load", () => {
        if (audioGenRef.current !== genAtBind) return;
        doPlay();
      });

      howl.once("loaderror", () => {
      });
    },
    []
  );

  const ensureHowl = useCallback((key: string, opts: HowlOptions) => {
    const existing = cacheRef.current.get(key);
    if (existing) return existing;

    const howl = new Howl({
      ...opts,

      onplayerror: () => {
          pendingActionRef.current = lastIntentRef.current ?? pendingActionRef.current;
      },
    });

    cacheRef.current.set(key, howl);
    howl.load();
    return howl;
  }, []);

  const ensureTracks = useCallback((mt: musicType, lang: string) => {
    if (!hasConsented) return;
    if (mt === "none") return;

    const bgCfgAll = getSoundConfig(config, mt);
    const instrCfgAll = getInstructionsConfig(lang, config, mt);
    const voiceCfgAll = getGuidedVoiceConfig(lang, config, mt);

    const bgCfg = bgCfgAll[mt];
    const instrCfg = instrCfgAll[mt];
    const voiceCfg = voiceCfgAll[mt];

    const bgSrc = firstSrc(bgCfg);
    const instrSrc = firstSrc(instrCfg);
    const voiceSrc = firstSrc(voiceCfg);

    const bgKey = makeKey("bg", mt, lang, bgSrc);
    const instrKey = makeKey("instr", mt, lang, instrSrc);
    const voiceKey = makeKey("voice", mt, lang, voiceSrc);

    const prev = activeKeysRef.current;
    const changed = prev.bg !== bgKey || prev.instr !== instrKey || prev.voice !== voiceKey;
    if (changed) audioGenRef.current += 1;

    activeKeysRef.current = { bg: bgKey, instr: instrKey, voice: voiceKey };

    if (bgSrc) ensureHowl(bgKey, bgCfg);
    if (instrSrc) ensureHowl(instrKey, instrCfg);

    if (voiceSrc) ensureHowl(voiceKey, { ...voiceCfg, loop: false });
  }, [config, ensureHowl, hasConsented, makeKey]);

  const unlockAudio = useCallback(async () => {
    try {
      const ctx = (Howler as unknown as { ctx?: AudioContext }).ctx;
      if (ctx && ctx.state === "suspended") {
        await ctx.resume();
      }
      setAudioUnlocked(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const runOrQueue = useCallback((action: () => void) => {
    lastIntentRef.current = action;

    if (audioUnlocked) {
      action();
      return;
    }
    pendingActionRef.current = action;
  }, [audioUnlocked]);

  const handleUserInteraction = useCallback(async () => {
    await unlockAudio();

    const action = pendingActionRef.current;
    if (action) {
      pendingActionRef.current = null;
      action();
    }
  }, [unlockAudio]);

    useEffect(() => {
      const events = ["click", "touchstart", "keydown"] as const;
      const options: AddEventListenerOptions = { passive: true, capture: true };

      events.forEach((e) => {
        document.addEventListener(e, handleUserInteraction, options);
      });

      return () => {
        events.forEach((e) => {
          document.removeEventListener(e, handleUserInteraction, options);
        });
      };
    }, [handleUserInteraction]);

  const pauseAll = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    if (bg && bg.playing()) seekRef.current.bg = (bg.seek() as number) || 0;
    if (instr && instr.playing()) seekRef.current.instr = (instr.seek() as number) || 0;
    if (voice && voice.playing()) seekRef.current.voice = (voice.seek() as number) || 0;

    bg?.pause();
    instr?.pause();
    voice?.pause();

    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);
  }, [getHowl]);

  const stopAll = useCallback((resetSeek: boolean = true) => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    bg?.stop();
    instr?.stop();
    voice?.stop();

    if (resetSeek) seekRef.current = { bg: 0, instr: 0, voice: 0 };

    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);
  }, [getHowl]);

  const applyVolumes = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    bg?.volume(backgroundEnabledRef.current ? 0.3 : 0);
    instr?.volume(instructionsEnabledRef.current ? 0.4 : 0);
    voice?.volume(guidedVoiceEnabledRef.current ? 0.4 : 0);
  }, [getHowl]);

  const playBackgroundAndInstructions = useCallback((seekSeconds?: number) => {
    const genAtBind = audioGenRef.current;

    const bg = getHowl("bg");
    const instr = getHowl("instr");
    if (!bg && !instr) return;

    applyVolumes();

    const playBg = () => {
      if (!bg) return;
      const already = bg.playing();
      const pos = seekSeconds ?? (seekRef.current.bg > 0 ? seekRef.current.bg : undefined);
      if (pos !== undefined && !already) {
        const d = bg.duration() || 0;
        bg.seek(d > 0 ? (pos % d) : pos);
        seekRef.current.bg = 0;
      }
      if (!already) bg.play();
    };

    const playInstr = () => {
      if (!instr) return;
      const already = instr.playing();
      const pos = seekSeconds ?? (seekRef.current.instr > 0 ? seekRef.current.instr : undefined);
      if (pos !== undefined && !already) {
        const d = instr.duration() || 0;
        instr.seek(d > 0 ? (pos % d) : pos);
        seekRef.current.instr = 0;
      }
      if (!already) instr.play();
    };

    if (bg) playWhenLoaded(bg, genAtBind, playBg);
    if (instr) playWhenLoaded(instr, genAtBind, playInstr);

    if (backgroundEnabledRef.current || instructionsEnabledRef.current) {
      setIsBackgroundMusicPlaying(true);
    }
  }, [applyVolumes, getHowl, playWhenLoaded]);

  const playGuidedVoice = useCallback((seekSeconds?: number, onEnd?: () => void) => {
    const genAtBind = audioGenRef.current;

    const voice = getHowl("voice");
    if (!voice) return;

    applyVolumes();

    const doPlay = () => {
      const already = voice.playing();
      const pos = seekSeconds ?? (seekRef.current.voice > 0 ? seekRef.current.voice : undefined);

      if (pos !== undefined && !already) {
        const d = voice.duration() || 0;
        voice.seek(d > 0 ? (pos % d) : pos);
        seekRef.current.voice = 0;
      }

      if (onEnd) {
        try { voice.off("end"); } catch { ignore(); }
        voice.once("end", onEnd);
      }

      if (!already) voice.play();
      setIsGuidedVoicePlaying(true);
    };

    playWhenLoaded(voice, genAtBind, doPlay);
  }, [applyVolumes, getHowl, playWhenLoaded]);

  const startExercise = useCallback((opts?: { musicType?: musicType; startAtSeconds?: number }) => {
    const mt = opts?.musicType ?? currentMusicType;
    const lang = langRef.current;
    const startAt = opts?.startAtSeconds ?? 0;

    if (!hasConsented) return;
    if (mt === "none") return;

    ensureTracks(mt, lang);

    runOrQueue(() => {
      stopAll(true);
      applyVolumes();

      const shouldPlayVoice = guidedVoiceEnabledRef.current;
      const voice = getHowl("voice");

      if (shouldPlayVoice && voice) {
        playGuidedVoice(0, () => {
          playBackgroundAndInstructions(startAt);
        });
      } else {
        playBackgroundAndInstructions(startAt);
      }
    });
  }, [
    applyVolumes,
    currentMusicType,
    ensureTracks,
    getHowl,
    hasConsented,
    playBackgroundAndInstructions,
    playGuidedVoice,
    runOrQueue,
    stopAll,
  ]);

  const initAudio = useCallback((mt: musicType) => {
    setCurrentMusicType(mt);
    if (!hasConsented) return;
    if (mt === "none") return;
    ensureTracks(mt, langRef.current);
  }, [ensureTracks, hasConsented]);

  useEffect(() => {
    if (!hasConsented) return;
    if (currentMusicType === "none") return;

    pauseAll();
    ensureTracks(currentMusicType, i18n.language);
  }, [i18n.language, currentMusicType, hasConsented, ensureTracks, pauseAll]);

  const setBackgroundEnabled = useCallback((enabled: boolean) => {
    _setBackgroundEnabled(enabled);
    saveSoundSettings({ backgroundEnabled: enabled, instructionsEnabled, guidedVoiceEnabled, closureEnabled});
    const bg = getHowl("bg");
    if (bg) bg.volume(enabled ? 0.3 : 0);
  }, [getHowl, guidedVoiceEnabled, instructionsEnabled, saveSoundSettings]);

  const setInstructionsEnabled = useCallback((enabled: boolean) => {
    _setInstructionsEnabled(enabled);
    saveSoundSettings({ backgroundEnabled, instructionsEnabled: enabled, guidedVoiceEnabled, closureEnabled:enabled });

    const instr = getHowl("instr");
    const bg = getHowl("bg");
    if (!instr) return;

    instr.volume(enabled ? 0.4 : 0);

    if (!enabled) return;

    if (!instr.playing() && bg && bg.playing()) {
      const genAtBind = audioGenRef.current;
      const doPlay = () => {
        const bgPos = (bg.seek() as number) || 0;
        const d = instr.duration() || 0;
        instr.seek(d > 0 ? (bgPos % d) : bgPos);
        instr.play();
        setIsBackgroundMusicPlaying(true);
      };
      playWhenLoaded(instr, genAtBind, doPlay);
    }
  }, [backgroundEnabled, getHowl, guidedVoiceEnabled, playWhenLoaded, saveSoundSettings]);

  const setGuidedVoiceEnabled = useCallback((enabled: boolean) => {
    _setGuidedVoiceEnabled(enabled);
    saveSoundSettings({ backgroundEnabled, instructionsEnabled, guidedVoiceEnabled: enabled, closureEnabled });

    const voice = getHowl("voice");
    if (voice && voice.playing()) {
      voice.volume(enabled ? 0.4 : 0);
    }
  }, [backgroundEnabled, getHowl, instructionsEnabled, saveSoundSettings]);

  const setBackgroundMusic = useCallback((play: boolean, seekSeconds?: number) => {
    runOrQueue(() => {
      if (play) playBackgroundAndInstructions(seekSeconds);
      else pauseAll();
    });
  }, [pauseAll, playBackgroundAndInstructions, runOrQueue]);

  const setGuidedVoice = useCallback((play: boolean, seekSeconds?: number) => {
    runOrQueue(() => {
      if (play) playGuidedVoice(seekSeconds);
      else pauseAll();
    });
  }, [pauseAll, playGuidedVoice, runOrQueue]);

  const stopMusicAndInstructions = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    if (bg && bg.playing()) seekRef.current.bg = (bg.seek() as number) || 0;
    if (instr && instr.playing()) seekRef.current.instr = (instr.seek() as number) || 0;
    if (voice && voice.playing()) seekRef.current.voice = (voice.seek() as number) || 0;

    bg?.pause();
    instr?.pause();
    voice?.pause();

    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingActionRef.current = null;
  }, [getHowl]);

  const volumeDownMusic = useCallback(() => {
    getHowl("bg")?.volume(0);
    getHowl("instr")?.volume(0);
    getHowl("voice")?.volume(0);
    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);
    pendingActionRef.current = null;
  }, [getHowl]);

  const volumeUpMusic = useCallback(() => {
    const action = () => {
      applyVolumes();

      const bg = getHowl("bg");
      const instr = getHowl("instr");
      const voice = getHowl("voice");

      if (bg && !bg.playing() && (isBackgroundMusicPlaying || backgroundEnabledRef.current)) bg.play();
      if (instr && !instr.playing() && (isBackgroundMusicPlaying || instructionsEnabledRef.current)) instr.play();
      if (voice && !voice.playing() && (isGuidedVoicePlaying || guidedVoiceEnabledRef.current)) voice.play();

      setIsBackgroundMusicPlaying(backgroundEnabledRef.current || instructionsEnabledRef.current);
      setIsGuidedVoicePlaying(guidedVoiceEnabledRef.current);
    };

    runOrQueue(action);
  }, [
    applyVolumes,
    getHowl,
    isBackgroundMusicPlaying,
    isGuidedVoicePlaying,
    runOrQueue,
  ]);

const playClosure = useCallback(() => {
  const closure = getHowl("closure");
  if (closure) {
    closure.volume(instructionsEnabledRef.current ? 0.4 : 0);
    closure.play();
  }
}, [getHowl]);

  const destroyAll = useCallback(() => {
    stopAll(true);
    for (const [, howl] of cacheRef.current.entries()) safeOffUnload(howl);
    cacheRef.current.clear();
    activeKeysRef.current = {};
    audioGenRef.current += 1;
  }, [stopAll]);

  return {
    startExercise,
    initAudio,
    setBackgroundMusic,
    setGuidedVoice,
    stopMusicAndInstructions,
    pauseAll,
    stopAll,
    volumeDownMusic,
    volumeUpMusic,
    handleUserInteraction,
    audioUnlocked,
    isBackgroundMusicPlaying,
    isGuidedVoicePlaying,
    backgroundEnabled,
    setBackgroundEnabled,
    instructionsEnabled,
    setInstructionsEnabled,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled,
    showSoundControl,
    setShowSoundControl,
    waitForAudioLoad,
    playClosure,
    destroyAll,
  };
};