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

type TrackKind = "bg" | "instr" | "voice";
type SoundSettings = {
  backgroundEnabled: boolean;
  instructionsEnabled: boolean;
  guidedVoiceEnabled: boolean;
};

const STORAGE_KEY = "rainbow-relax-sound-settings";

const firstSrc = (opts: HowlOptions | undefined) => {
  const s: any = opts?.src;
  if (!s) return "";
  if (Array.isArray(s)) return String(s[0] ?? "");
  return String(s);
};

const safeOffUnload = (howl: Howl | null) => {
  if (!howl) return;
  try { howl.off(); } catch {}
  try { howl.stop(); } catch {}
  try { howl.unload(); } catch {}
};

export const useAudio = () => {
  const { i18n } = useTranslation();
  const { config } = useWidgetConfig();
  const { hasConsented } = useConsent();

  // --------- Persistencia de toggles ----------
  const loadSoundSettings = useCallback((): SoundSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const s = JSON.parse(stored);
        return {
          backgroundEnabled: s.backgroundEnabled !== false,
          instructionsEnabled: s.instructionsEnabled !== false,
          guidedVoiceEnabled: s.guidedVoiceEnabled !== false,
        };
      }
    } catch {}
    return { backgroundEnabled: true, instructionsEnabled: true, guidedVoiceEnabled: true };
  }, []);

  const saveSoundSettings = useCallback((s: SoundSettings) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
  }, []);

  const [backgroundEnabled, _setBackgroundEnabled] = useState(() => loadSoundSettings().backgroundEnabled);
  const [instructionsEnabled, _setInstructionsEnabled] = useState(() => loadSoundSettings().instructionsEnabled);
  const [guidedVoiceEnabled, _setGuidedVoiceEnabled] = useState(() => loadSoundSettings().guidedVoiceEnabled);
  const [showSoundControl, setShowSoundControl] = useState(true);

  const backgroundEnabledRef = useRef(backgroundEnabled);
  const instructionsEnabledRef = useRef(instructionsEnabled);
  const guidedVoiceEnabledRef = useRef(guidedVoiceEnabled);

  useEffect(() => { backgroundEnabledRef.current = backgroundEnabled; }, [backgroundEnabled]);
  useEffect(() => { instructionsEnabledRef.current = instructionsEnabled; }, [instructionsEnabled]);
  useEffect(() => { guidedVoiceEnabledRef.current = guidedVoiceEnabled; }, [guidedVoiceEnabled]);

  // --------- Estado público ----------
  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const langRef = useRef(i18n.language);
  useEffect(() => { langRef.current = i18n.language; }, [i18n.language]);

  // ======= (DEL VIEJO) gen para evitar callbacks stale =======
  const audioGenRef = useRef(0);

  // --------- Cache de Howls ----------
  const cacheRef = useRef<Map<string, Howl>>(new Map());
  const activeKeysRef = useRef<{ bg?: string; instr?: string; voice?: string }>({});
  const seekRef = useRef<{ bg: number; instr: number; voice: number }>({ bg: 0, instr: 0, voice: 0 });

  // ======= (MEJORADO) intención pendiente y última intención =======
  const pendingActionRef = useRef<null | (() => void)>(null);
  const lastIntentRef = useRef<null | (() => void)>(null);

  // --------- Helpers ----------
  const getHowl = useCallback((kind: TrackKind): Howl | null => {
    const key = activeKeysRef.current[kind];
    if (!key) return null;
    return cacheRef.current.get(key) ?? null;
  }, []);

  const makeKey = useCallback((kind: TrackKind, mt: musicType, lang: string, src: string) => {
    if (kind === "bg") return `bg|${mt}|${src}`;
    return `${kind}|${mt}|${lang}|${src}`;
  }, []);

  // ======= (DEL VIEJO) waitForHowlLoaded + waitForAudioLoad =======
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
        try { howl.off("load", onLoad); } catch {}
        try { howl.off("loaderror", onErr); } catch {}
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

  // ======= (DEL VIEJO) play safe si aún no carga =======
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
        // si falla carga, no hacemos nada; puedes loggear si quieres
      });
    },
    []
  );

  const ensureHowl = useCallback((key: string, opts: HowlOptions) => {
    const existing = cacheRef.current.get(key);
    if (existing) return existing;

    const howl = new Howl({
      ...opts,

      // IMPORTANT: si tu config trae loop en voz, lo anula startExercise al crear voz con loop:false
      onplayerror: (...args: any[]) => {
        // ======= (DEL VIEJO) marcar acción pendiente real =======
        // Reintenta la última intención (incluye seek/orden)
        pendingActionRef.current = lastIntentRef.current ?? pendingActionRef.current;

        // Deja que el config original reciba el evento si existe
        (opts as any)?.onplayerror?.(...args);
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

    // Si cambian los activos, incrementa gen (evita callbacks stale)
    const prev = activeKeysRef.current;
    const changed = prev.bg !== bgKey || prev.instr !== instrKey || prev.voice !== voiceKey;
    if (changed) audioGenRef.current += 1;

    activeKeysRef.current = { bg: bgKey, instr: instrKey, voice: voiceKey };

    if (bgSrc) ensureHowl(bgKey, bgCfg);
    if (instrSrc) ensureHowl(instrKey, instrCfg);

    // ======= CLAVE: loop:false para que "end" dispare =======
    if (voiceSrc) ensureHowl(voiceKey, { ...voiceCfg, loop: false });
  }, [config, ensureHowl, hasConsented, makeKey]);

  const unlockAudio = useCallback(async () => {
    try {
      const ctx: any = (Howler as any).ctx;
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
    events.forEach((e) =>
      document.addEventListener(e, handleUserInteraction, { passive: true, capture: true })
    );
    return () => {
      events.forEach((e) =>
        document.removeEventListener(e, handleUserInteraction, { capture: true } as any)
      );
    };
  }, [handleUserInteraction]);

  // --------- Controles base ----------
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

  // ======= (DEL VIEJO) setBackgroundMusic play-safe si no loaded =======
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

  // ======= (DEL VIEJO) setGuidedVoice play-safe si no loaded =======
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
        try { voice.off("end"); } catch {}
        voice.once("end", onEnd);
      }

      if (!already) voice.play();
      setIsGuidedVoicePlaying(true);
    };

    playWhenLoaded(voice, genAtBind, doPlay);
  }, [applyVolumes, getHowl, playWhenLoaded]);

  // --------- startExercise: guía -> bg+instr ----------
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

  // --------- initAudio (precarga) ----------
  const initAudio = useCallback((mt: musicType) => {
    setCurrentMusicType(mt);
    if (!hasConsented) return;
    if (mt === "none") return;
    ensureTracks(mt, langRef.current);
  }, [ensureTracks, hasConsented]);

  // --------- Cambio de idioma: precarga instr/voice del nuevo lang (bg se queda) ----------
  useEffect(() => {
    if (!hasConsented) return;
    if (currentMusicType === "none") return;

    // evita mezcla de idiomas
    pauseAll();
    ensureTracks(currentMusicType, i18n.language);
  }, [i18n.language, currentMusicType, hasConsented, ensureTracks, pauseAll]);

  // --------- Setters con persistencia ----------
  const setBackgroundEnabled = useCallback((enabled: boolean) => {
    _setBackgroundEnabled(enabled);
    saveSoundSettings({ backgroundEnabled: enabled, instructionsEnabled, guidedVoiceEnabled });
    const bg = getHowl("bg");
    if (bg) bg.volume(enabled ? 0.3 : 0);
  }, [getHowl, guidedVoiceEnabled, instructionsEnabled, saveSoundSettings]);

  // ======= (DEL VIEJO) si habilitas instrucciones y bg ya suena: sync + play =======
  const setInstructionsEnabled = useCallback((enabled: boolean) => {
    _setInstructionsEnabled(enabled);
    saveSoundSettings({ backgroundEnabled, instructionsEnabled: enabled, guidedVoiceEnabled });

    const instr = getHowl("instr");
    const bg = getHowl("bg");
    if (!instr) return;

    instr.volume(enabled ? 0.4 : 0);

    if (!enabled) return;

    // si no está sonando pero bg sí, lo arrancamos sincronizado
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
    saveSoundSettings({ backgroundEnabled, instructionsEnabled, guidedVoiceEnabled: enabled });

    const voice = getHowl("voice");
    if (voice && voice.playing()) {
      voice.volume(enabled ? 0.4 : 0);
    }
  }, [backgroundEnabled, getHowl, instructionsEnabled, saveSoundSettings]);

  // --------- Compat: controles tipo los tuyos ----------
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
    // equivalente al viejo: guarda seek si estaban sonando y pausa
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

  // ======= (DEL VIEJO) volumeUp deja “pendiente” reintentar si está bloqueado =======
  const volumeUpMusic = useCallback(() => {
    const action = () => {
      applyVolumes();

      // no forzamos secuencia aquí; solo “reanuda lo que estaba”
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

  // opcional: limpiar cache manual
  const destroyAll = useCallback(() => {
    stopAll(true);
    for (const [, howl] of cacheRef.current.entries()) safeOffUnload(howl);
    cacheRef.current.clear();
    activeKeysRef.current = {};
    audioGenRef.current += 1;
  }, [stopAll]);

  return {
    // Nuevo control bueno
    startExercise,

    // API compatible
    initAudio,
    setBackgroundMusic,
    setGuidedVoice,
    stopMusicAndInstructions,
    pauseAll,
    stopAll,
    volumeDownMusic,
    volumeUpMusic,

    // Estado
    audioUnlocked,
    isBackgroundMusicPlaying,
    isGuidedVoicePlaying,

    // Toggles
    backgroundEnabled,
    setBackgroundEnabled,
    instructionsEnabled,
    setInstructionsEnabled,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled,
    showSoundControl,
    setShowSoundControl,

    // Load helper (del viejo)
    waitForAudioLoad,

    // Debug
    destroyAll,
  };
};
