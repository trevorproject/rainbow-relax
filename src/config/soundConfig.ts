import { HowlOptions } from "howler";
import backgroundSound from "../assets/sounds/Background.mp3?url";
import cycleInstructionsEs from "../assets/sounds/cycle-es.mp3?url";
import cycleInstructionsEn from "../assets/sounds/cycle-en.mp3?url";
import introVoiceEs from "../assets/sounds/intro-es.mp3?url";
import introVoiceEn from "../assets/sounds/intro-en.mp3?url";
import { WidgetConfig } from "../context/WidgetConfigContext";
import type { musicType } from "../context/AudioContext";

const EXERCISE_SOUNDS = {
  "4-7-8": {
    background: backgroundSound,
    instructions: { en: cycleInstructionsEn, es: cycleInstructionsEs },
    guidedVoice: { en: introVoiceEn, es: introVoiceEs },
  },
  "box-breathing": {
    background: backgroundSound, // reuse 4-7-8 background
    instructions: { en: cycleInstructionsEn, es: cycleInstructionsEs }, // fallback to 4-7-8
    guidedVoice: { en: introVoiceEn, es: introVoiceEs }, // fallback to 4-7-8
  },
  "equal-breathing": {
    background: backgroundSound, // reuse 4-7-8 background
    instructions: { en: cycleInstructionsEn, es: cycleInstructionsEs }, // fallback to 4-7-8
    guidedVoice: { en: introVoiceEn, es: introVoiceEs }, // fallback to 4-7-8
  },
} as const;

const getLangKey = (lang?: string) => (lang?.startsWith("es") ? "es" : "en");

export const getSoundConfig = (
  config?: WidgetConfig,
  exerciseType: musicType = "4-7-8"
): Record<musicType, HowlOptions> => {
  const exerciseSounds =
    EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] ??
    EXERCISE_SOUNDS["4-7-8"];

  const backgroundAudioSrc = config?.backgroundUrl || exerciseSounds.background;

  return {
    [exerciseType]: {
      src: [backgroundAudioSrc],
      loop: true,
      volume: 0.3,
      onloaderror: (_soundId: number, error: unknown) => {
        console.error("Failed to load background audio:", backgroundAudioSrc, error);
      },
    },
  } as Record<musicType, HowlOptions>;
};

export const getInstructionsConfig = (
  lang: string,
  config?: WidgetConfig,
  exerciseType: musicType = "4-7-8"
): Record<musicType, HowlOptions> => {
  const langKey = getLangKey(lang);

  const exerciseSounds =
    EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] ??
    EXERCISE_SOUNDS["4-7-8"];

  const instructionAudioSrc =
    config?.instructionsUrl || exerciseSounds.instructions[langKey];

  return {
    [exerciseType]: {
      src: [instructionAudioSrc],
      loop: true,
      volume: 0.4,
      onloaderror: (_soundId: number, error: unknown) => {
        console.error("Failed to load instruction audio:", instructionAudioSrc, error);
      },
    },
  } as Record<musicType, HowlOptions>;
};

export const getGuidedVoiceConfig = (
  lang: string,
  config?: WidgetConfig,
  exerciseType: musicType = "4-7-8"
): Record<musicType, HowlOptions> => {
  const langKey = getLangKey(lang);

  const exerciseSounds =
    EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] ??
    EXERCISE_SOUNDS["4-7-8"];

  const guidedVoiceAudioSrc =
    config?.guidedVoiceUrl || exerciseSounds.guidedVoice[langKey];

  return {
    [exerciseType]: {
      src: [guidedVoiceAudioSrc],
      volume: 0.4,
      onloaderror: (_soundId: number, error: unknown) => {
        console.error("Failed to load guided voice audio:", guidedVoiceAudioSrc, error);
      },
    },
  } as Record<musicType, HowlOptions>;
};
