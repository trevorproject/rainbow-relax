import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Howl, type HowlOptions, Howler } from "howler";
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

const ignore = () => undefined;

const firstSrc = (opts: HowlOptions | undefined) => {
  const s = opts?.src as unknown;
  if (!s) return "";
  if (Array.isArray(s)) return String(s[0] ?? "");
  return String(s);
};

const safeOffUnload = (howl: Howl | null) => {
  if (!howl) return;
  try {
    howl.off();
  } catch {
    ignore();
  }
  try {
    howl.stop();
  } catch {
    ignore();
  }
  try {
    howl.unload();
  } catch {
    ignore();
  }
};

export const useAudio = () => {
  const { i18n } = useTranslation();
  const { config } = useWidgetConfig();
  const { hasConsented } = useConsent();

  const inExerciseRef = useRef(false);
  const introPendingRef = useRef(false);
  const introConsumedRef = useRef(false);

  const audioUnlockedRef = useRef(false);
  const unlockingRef = useRef(false);

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
    } catch {
      ignore();
    }
    return {
      backgroundEnabled: true,
      instructionsEnabled: true,
      guidedVoiceEnabled: true,
    };
  }, []);

  const saveSoundSettings = useCallback((s: SoundSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {
      ignore();
    }
  }, []);

  const [backgroundEnabled, _setBackgroundEnabled] = useState(
    () => loadSoundSettings().backgroundEnabled
  );
  const [instructionsEnabled, _setInstructionsEnabled] = useState(
    () => loadSoundSettings().instructionsEnabled
  );
  const [guidedVoiceEnabled, _setGuidedVoiceEnabled] = useState(
    () => loadSoundSettings().guidedVoiceEnabled
  );
  const [showSoundControl, setShowSoundControl] = useState(true);

  const backgroundEnabledRef = useRef(backgroundEnabled);
  const instructionsEnabledRef = useRef(instructionsEnabled);
  const guidedVoiceEnabledRef = useRef(guidedVoiceEnabled);

  const [currentMusicType, setCurrentMusicType] = useState<musicType>("4-7-8");
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const [isGuidedVoicePlaying, setIsGuidedVoicePlaying] = useState(false);

  const langRef = useRef(i18n.language);
  useEffect(() => {
    langRef.current = i18n.language;
  }, [i18n.language]);

  const audioGenRef = useRef(0);
  const cacheRef = useRef<Map<string, Howl>>(new Map());

  const activeKeysRef = useRef<{ bg?: string; instr?: string; voice?: string }>(
    {}
  );
  const seekRef = useRef<{ bg: number; instr: number; voice: number }>({
    bg: 0,
    instr: 0,
    voice: 0,
  });

  const pendingActionsRef = useRef<Array<() => void>>([]);

  const forcedMuteRef = useRef(false);

  const lastAppliedRef = useRef<
    Record<TrackKind, { key?: string; vol?: number; howl?: Howl }>
  >({
    bg: {},
    instr: {},
    voice: {},
  });

  const pruneCache = useCallback(
    (next: { bg?: string; instr?: string; voice?: string }) => {
      const keep = new Set<string>();
      if (next.bg) keep.add(next.bg);
      if (next.instr) keep.add(next.instr);
      if (next.voice) keep.add(next.voice);

      for (const [key, howl] of cacheRef.current.entries()) {
        if (keep.has(key)) continue;
        safeOffUnload(howl);
        cacheRef.current.delete(key);
      }
    },
    []
  );

  const getHowl = useCallback((kind: TrackKind): Howl | null => {
    const key = activeKeysRef.current[kind];
    if (!key) return null;
    return cacheRef.current.get(key) ?? null;
  }, []);

  const applyVolumes = useCallback(() => {
    const tracks: Array<{
      id: TrackKind;
      ref: MutableRefObject<boolean>;
      vol: number;
    }> = [
      { id: "bg", ref: backgroundEnabledRef, vol: 0.3 },
      { id: "instr", ref: instructionsEnabledRef, vol: 0.4 },
      { id: "voice", ref: guidedVoiceEnabledRef, vol: 0.4 },
    ];

    const EPS = 1e-4;

    for (const { id, ref, vol } of tracks) {
      const key = activeKeysRef.current[id];
      const instance = getHowl(id);
      if (!instance) continue;

      const targetVolume = forcedMuteRef.current ? 0 : ref.current ? vol : 0;

      const prev = lastAppliedRef.current[id];
      if (
        prev.howl === instance && 
        prev.key === key &&
        prev.vol !== undefined &&
        Math.abs(prev.vol - targetVolume) < EPS
      ) {
        continue;
      }

      instance.volume(targetVolume);
      lastAppliedRef.current[id] = { key, vol: targetVolume, howl: instance };
    }
  }, [getHowl]);

  useEffect(() => {
    applyVolumes();
  }, [backgroundEnabled, applyVolumes]);

  useEffect(() => {
    applyVolumes();
  }, [instructionsEnabled, applyVolumes]);

  useEffect(() => {
    applyVolumes();
  }, [guidedVoiceEnabled, applyVolumes]);

  const makeKey = useCallback(
    (kind: TrackKind, mt: musicType, lang: string, src: string) => {
      if (kind === "bg") return `bg|${mt}|${src}`;
      return `${kind}|${mt}|${lang}|${src}`;
    },
    []
  );

  const waitForHowlLoaded = (howl: Howl | null, timeoutMs: number) => {
    if (!howl) return Promise.resolve(true);

    try {
      if (howl.state() === "unloaded") howl.load();
    } catch {
      ignore();
    }

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
        try {
          howl.off("load", onLoad);
        } catch {
          ignore();
        }
        try {
          howl.off("loaderror", onErr);
        } catch {
          ignore();
        }
      };

      howl.once("load", onLoad);
      howl.once("loaderror", onErr);
    });
  };

  const waitForAudioLoad = useCallback(
    async (timeoutMs: number = 5000) => {
      const gen = audioGenRef.current;

      const [bgOk, instrOk, voiceOk] = await Promise.all([
        waitForHowlLoaded(getHowl("bg"), timeoutMs),
        waitForHowlLoaded(getHowl("instr"), timeoutMs),
        waitForHowlLoaded(getHowl("voice"), timeoutMs),
      ]);

      if (audioGenRef.current !== gen) return false;
      return bgOk && instrOk && voiceOk;
    },
    [getHowl]
  );

  const playWhenLoaded = useCallback(
    (howl: Howl, genAtBind: number, doPlay: () => void) => {
      const run = () => {
        if (audioGenRef.current !== genAtBind) return;
        doPlay();
      };

      const st = howl.state();
      if (st === "loaded") {
        run();
        return;
      }

      if (st === "unloaded") {
        try {
          howl.load();
        } catch {
          ignore();
        }
      }

      howl.once("load", run);
      howl.once("loaderror", () => {
        // silent in prod
      });
    },
    []
  );

  const ensureHowl = useCallback(
    (key: string, opts: HowlOptions) => {
      const existing = cacheRef.current.get(key);
      if (existing) return existing;

      const howler = Howler as unknown as {
        once?: (event: string, fn: () => void) => void;
        on?: (event: string, fn: () => void) => void;
        off?: (event: string, fn: () => void) => void;
      };

      const onUnlockOnce = (fn: () => void) => {
        try {
          if (howler.once) {
            howler.once("unlock", fn);
            return;
          }
          if (howler.on && howler.off) {
            const wrapped = () => {
              try {
                howler.off!("unlock", wrapped);
              } catch {
                ignore();
              }
              fn();
            };
            howler.on("unlock", wrapped);
          }
        } catch {
          ignore();
        }
      };

      const origOnPlay = opts.onplay;
      const origOnPlayError = opts.onplayerror;
      const origOnLoadError = opts.onloaderror;

      const howl = new Howl({
        ...opts,

        onplay(this: Howl, id: number) {
          applyVolumes();
          try {
            origOnPlay?.(id);
          } catch {
            ignore();
          }
        },

        onplayerror(this: Howl, id: number, err: unknown) {
          onUnlockOnce(() => {
            if (cacheRef.current.get(key) !== this) return;

            try {
              this.play();
            } catch {
              ignore();
            }
          });

          try {
            origOnPlayError?.(id, err);
          } catch {
            ignore();
          }
        },

        onloaderror(this: Howl, id: number, err: unknown) {
          try {
            origOnLoadError?.(id, err);
          } catch {
            ignore();
          }
        },
      });

      cacheRef.current.set(key, howl);
      const active = activeKeysRef.current;
        if (active.bg === key || active.instr === key || active.voice === key) {
          applyVolumes();
          }

      return howl;
    },
    [applyVolumes]
  );

  const ensureTracks = useCallback(
    (mt: musicType, lang: string) => {
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

      const bgKey = bgSrc ? makeKey("bg", mt, lang, bgSrc) : undefined;
      const instrKey = instrSrc
        ? makeKey("instr", mt, lang, instrSrc)
        : undefined;
      const voiceKey = voiceSrc
        ? makeKey("voice", mt, lang, voiceSrc)
        : undefined;

      const prev = activeKeysRef.current;
      const changed =
        prev.bg !== bgKey || prev.instr !== instrKey || prev.voice !== voiceKey;
      if (changed) audioGenRef.current += 1;

      activeKeysRef.current = { bg: bgKey, instr: instrKey, voice: voiceKey };
      pruneCache(activeKeysRef.current);

      if (bgKey && bgCfg) ensureHowl(bgKey, bgCfg);
      if (instrKey && instrCfg) ensureHowl(instrKey, instrCfg);
      if (voiceKey && voiceCfg) ensureHowl(voiceKey, { ...voiceCfg, loop: false });

      applyVolumes();
    },
    [applyVolumes, config, ensureHowl, hasConsented, makeKey, pruneCache]
  );

  const handleUserInteraction = useCallback(async () => {
    if (audioUnlockedRef.current) return;
    if (unlockingRef.current) return;
    unlockingRef.current = true;

    try {
      const ctx = (Howler as unknown as { ctx?: AudioContext }).ctx;

      if (ctx && ctx.state === "suspended") {
        const p = ctx.resume();
        await p;
      }

      audioUnlockedRef.current = true;
      setAudioUnlocked(true);

      const actions = pendingActionsRef.current;
      pendingActionsRef.current = [];
      actions.forEach((a) => a());
    } catch {
      // ignore
    } finally {
      unlockingRef.current = false;
    }
  }, []);

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

  const runOrQueue = useCallback((action: () => void) => {
    if (audioUnlockedRef.current) {
      action();
      return;
    }
    pendingActionsRef.current.push(action);
  }, []);

  const pauseAll = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    if (bg && bg.playing()) seekRef.current.bg = (bg.seek() as number) || 0;
    if (instr && instr.playing())
      seekRef.current.instr = (instr.seek() as number) || 0;
    if (voice && voice.playing())
      seekRef.current.voice = (voice.seek() as number) || 0;

    bg?.pause();
    instr?.pause();
    voice?.pause();

    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);
  }, [getHowl]);

  const stopAll = useCallback(
    (resetSeek: boolean = true) => {
      const bg = getHowl("bg");
      const instr = getHowl("instr");
      const voice = getHowl("voice");

      bg?.stop();
      instr?.stop();
      voice?.stop();

      if (resetSeek) {
        seekRef.current = { bg: 0, instr: 0, voice: 0 };
        inExerciseRef.current = false;
        introPendingRef.current = false;
        introConsumedRef.current = false;
      }

      setIsBackgroundMusicPlaying(false);
      setIsGuidedVoicePlaying(false);
    },
    [getHowl]
  );

  const pauseBgInstrAndStoreSyncSeek = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");

    const bgPos = bg ? ((bg.seek() as number) || 0) : 0;
    const instrPos = instr ? ((instr.seek() as number) || 0) : 0;

    const master =
      bg && bg.playing()
        ? bgPos
        : instr && instr.playing()
        ? instrPos
        : bgPos || instrPos || 0;

    if (bg) seekRef.current.bg = master;
    if (instr) seekRef.current.instr = master;

    bg?.pause();
    instr?.pause();
    setIsBackgroundMusicPlaying(false);

    return master;
  }, [getHowl]);

  const playBackgroundAndInstructions = useCallback(
    (seekSeconds?: number) => {
      const genAtBind = audioGenRef.current;

      const bg = getHowl("bg");
      const instr = getHowl("instr");
      if (!bg && !instr) return;

      applyVolumes();

      const playBg = () => {
        if (!bg) return;
        const already = bg.playing();
        const pos =
          seekSeconds ?? (seekRef.current.bg > 0 ? seekRef.current.bg : undefined);
        if (pos !== undefined && !already) {
          const d = bg.duration() || 0;
          bg.seek(d > 0 ? pos % d : pos);
          seekRef.current.bg = 0;
        }
        if (!already) bg.play();
      };

      const playInstr = () => {
        if (!instr) return;
        const already = instr.playing();
        const pos =
          seekSeconds ??
          (seekRef.current.instr > 0 ? seekRef.current.instr : undefined);
        if (pos !== undefined && !already) {
          const d = instr.duration() || 0;
          instr.seek(d > 0 ? pos % d : pos);
          seekRef.current.instr = 0;
        }
        if (!already) instr.play();
      };

      if (bg) playWhenLoaded(bg, genAtBind, playBg);
      if (instr) playWhenLoaded(instr, genAtBind, playInstr);

      if (backgroundEnabledRef.current || instructionsEnabledRef.current) {
        setIsBackgroundMusicPlaying(true);
      }
    },
    [applyVolumes, getHowl, playWhenLoaded]
  );

  const playGuidedVoice = useCallback(
    (seekSeconds?: number, onEnd?: () => void) => {
      const genAtBind = audioGenRef.current;
      const voice = getHowl("voice");
      if (!voice) return;

      applyVolumes();

      const doPlay = () => {
        const already = voice.playing();
        const pos =
          seekSeconds ??
          (seekRef.current.voice > 0 ? seekRef.current.voice : undefined);

        if (pos !== undefined && !already) {
          const d = voice.duration() || 0;
          voice.seek(d > 0 ? pos % d : pos);
          seekRef.current.voice = 0;
        }

        voice.off("end");
        voice.once("end", () => {
          setIsGuidedVoicePlaying(false);
          onEnd?.();
        });

        if (!already) voice.play();
        setIsGuidedVoicePlaying(true);
      };

      playWhenLoaded(voice, genAtBind, doPlay);
    },
    [applyVolumes, getHowl, playWhenLoaded]
  );

  const startExercise = useCallback(
    (opts?: { musicType?: musicType; startAtSeconds?: number }) => {
      const mt = opts?.musicType ?? currentMusicType;
      const lang = langRef.current;
      const startAt = opts?.startAtSeconds ?? 0;

      if (!hasConsented || mt === "none") return;

      ensureTracks(mt, lang);

      runOrQueue(() => {
        stopAll(true);

        inExerciseRef.current = true;
        introConsumedRef.current = false;
        introPendingRef.current = false;

        applyVolumes();

        const voice = getHowl("voice");

        if (voice && !guidedVoiceEnabledRef.current) {
          introPendingRef.current = true;
          try {
            if (voice.state() === "unloaded") voice.load();
          } catch {
            // ignore
          }
          playBackgroundAndInstructions(startAt);
          return;
        }

        if (!voice) {
          introPendingRef.current = true;
          introConsumedRef.current = false;
          playBackgroundAndInstructions(startAt);
          return;
        }

        introPendingRef.current = false;

        playGuidedVoice(0, () => {
          introConsumedRef.current = true;
          playBackgroundAndInstructions(startAt);
        });
      });
    },
    [
      applyVolumes,
      currentMusicType,
      ensureTracks,
      getHowl,
      hasConsented,
      playBackgroundAndInstructions,
      playGuidedVoice,
      runOrQueue,
      stopAll,
    ]
  );

  const initAudio = useCallback(
    (mt: musicType) => {
      setCurrentMusicType(mt);
      if (!hasConsented) return;
      if (mt === "none") return;
      ensureTracks(mt, langRef.current);
    },
    [ensureTracks, hasConsented]
  );

  useEffect(() => {
    if (!hasConsented) return;
    if (currentMusicType === "none") return;

    pauseAll();
    ensureTracks(currentMusicType, i18n.language);
  }, [i18n.language, currentMusicType, hasConsented, ensureTracks, pauseAll]);

  const setBackgroundEnabled = useCallback(
    (enabled: boolean) => {
      backgroundEnabledRef.current = enabled;
      _setBackgroundEnabled(enabled);

      saveSoundSettings({
        backgroundEnabled: enabled,
        instructionsEnabled: instructionsEnabledRef.current,
        guidedVoiceEnabled: guidedVoiceEnabledRef.current,
      });

      applyVolumes();
    },
    [applyVolumes, saveSoundSettings]
  );

  const setInstructionsEnabled = useCallback(
    (enabled: boolean) => {
      instructionsEnabledRef.current = enabled;
      _setInstructionsEnabled(enabled);

      saveSoundSettings({
        backgroundEnabled: backgroundEnabledRef.current,
        instructionsEnabled: enabled,
        guidedVoiceEnabled: guidedVoiceEnabledRef.current,
      });

      applyVolumes();

      if (!enabled) return;

      const instr = getHowl("instr");
      const bg = getHowl("bg");
      if (!instr) return;

      if (!instr.playing() && bg && bg.playing()) {
        const genAtBind = audioGenRef.current;

        const doPlay = () => {
          const bgPos = (bg.seek() as number) || 0;
          const d = instr.duration() || 0;
          instr.seek(d > 0 ? bgPos % d : bgPos);
          instr.play();
          setIsBackgroundMusicPlaying(true);
        };

        playWhenLoaded(instr, genAtBind, doPlay);
      }
    },
    [applyVolumes, getHowl, playWhenLoaded, saveSoundSettings]
  );

  const setGuidedVoiceEnabled = useCallback(
    (enabled: boolean) => {
      guidedVoiceEnabledRef.current = enabled;
      _setGuidedVoiceEnabled(enabled);

      saveSoundSettings({
        backgroundEnabled: backgroundEnabledRef.current,
        instructionsEnabled: instructionsEnabledRef.current,
        guidedVoiceEnabled: enabled,
      });

      applyVolumes();

      const shouldPlayIntroNow =
        enabled && inExerciseRef.current && !introConsumedRef.current;

      if (shouldPlayIntroNow) {
        runOrQueue(() => {
          if (
            !(
              guidedVoiceEnabledRef.current &&
              inExerciseRef.current &&
              !introConsumedRef.current
            )
          )
            return;

          const voice = getHowl("voice");
          if (!voice) {
            introPendingRef.current = true;
            introConsumedRef.current = false;
            return;
          }

          try {
            if (voice.state() === "unloaded") voice.load();
          } catch {
            // ignore
          }

          pauseBgInstrAndStoreSyncSeek();

          seekRef.current.voice = 0;
          try {
            voice.stop();
          } catch {
            // ignore
          }

          introPendingRef.current = true;

          playGuidedVoice(0, () => {
            introPendingRef.current = false;
            introConsumedRef.current = true;
            playBackgroundAndInstructions();
          });
        });

        return;
      }

      const voice = getHowl("voice");
      if (!voice) return;

      if (enabled && isGuidedVoicePlaying) {
        if (!voice.playing()) voice.play();
      }
    },
    [
      applyVolumes,
      getHowl,
      isGuidedVoicePlaying,
      pauseBgInstrAndStoreSyncSeek,
      playBackgroundAndInstructions,
      playGuidedVoice,
      runOrQueue,
      saveSoundSettings,
    ]
  );

  const setBackgroundMusic = useCallback(
    (play: boolean, seekSeconds?: number) => {
      runOrQueue(() => {
        if (play) playBackgroundAndInstructions(seekSeconds);
        else pauseAll();
      });
    },
    [pauseAll, playBackgroundAndInstructions, runOrQueue]
  );

  const setGuidedVoice = useCallback(
    (play: boolean, seekSeconds?: number) => {
      runOrQueue(() => {
        if (play) playGuidedVoice(seekSeconds);
        else pauseAll();
      });
    },
    [pauseAll, playGuidedVoice, runOrQueue]
  );

  const stopMusicAndInstructions = useCallback(() => {
    const bg = getHowl("bg");
    const instr = getHowl("instr");
    const voice = getHowl("voice");

    if (bg && bg.playing()) seekRef.current.bg = (bg.seek() as number) || 0;
    if (instr && instr.playing())
      seekRef.current.instr = (instr.seek() as number) || 0;
    if (voice && voice.playing())
      seekRef.current.voice = (voice.seek() as number) || 0;

    bg?.pause();
    instr?.pause();
    voice?.pause();

    setIsGuidedVoicePlaying(false);
    setIsBackgroundMusicPlaying(false);
    pendingActionsRef.current = [];

    inExerciseRef.current = false;
    introPendingRef.current = false;
    introConsumedRef.current = false;
  }, [getHowl]);

  const volumeDownMusic = useCallback(() => {
    forcedMuteRef.current = true;
    applyVolumes();

    setIsBackgroundMusicPlaying(false);
    setIsGuidedVoicePlaying(false);
    pendingActionsRef.current = [];
  }, [applyVolumes]);

  const volumeUpMusic = useCallback(() => {
    const action = () => {
      forcedMuteRef.current = false;
      applyVolumes();

      const bg = getHowl("bg");
      const instr = getHowl("instr");
      const voice = getHowl("voice");

      if (
        bg &&
        !bg.playing() &&
        (isBackgroundMusicPlaying || backgroundEnabledRef.current)
      )
        bg.play();
      if (
        instr &&
        !instr.playing() &&
        (isBackgroundMusicPlaying || instructionsEnabledRef.current)
      )
        instr.play();
      if (
        voice &&
        !voice.playing() &&
        (isGuidedVoicePlaying || guidedVoiceEnabledRef.current)
      )
        voice.play();

      setIsBackgroundMusicPlaying(
        backgroundEnabledRef.current || instructionsEnabledRef.current
      );
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

  const destroyAll = useCallback(() => {
    stopAll(true);
    for (const [, howl] of cacheRef.current.entries()) safeOffUnload(howl);
    cacheRef.current.clear();
    activeKeysRef.current = {};
    audioGenRef.current += 1;

    inExerciseRef.current = false;
    introPendingRef.current = false;
    introConsumedRef.current = false;

    lastAppliedRef.current = { bg: {}, instr: {}, voice: {} };
    forcedMuteRef.current = false;
    pendingActionsRef.current = [];
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
    destroyAll,
  };
};
