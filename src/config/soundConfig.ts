import { HowlOptions } from "howler";
import backgroundSound from "../assets/sounds/Background.mp3?url";
import cycleInstructionsEs from "../assets/sounds/cycle-es.mp3?url";
import cycleInstructionsEn from "../assets/sounds/cycle-en.mp3?url";
import introVoiceEs from "../assets/sounds/intro-es.mp3?url";
import introVoiceEn from "../assets/sounds/intro-en.mp3?url";
import { WidgetConfig } from "../context/WidgetConfigContext";

// Exercise sound mappings - easy to extend with new exercises
const EXERCISE_SOUNDS = {
  "4-7-8": {
    background: backgroundSound,
    instructions: {
      en: cycleInstructionsEn,
      es: cycleInstructionsEs,
    },
    guidedVoice: {
      en: introVoiceEn,
      es: introVoiceEs,
    },
  },
  // To add a new exercise, just add a new entry here:
  // "new-exercise": {
  //   background: newBackgroundSound,
  //   instructions: { en: newInstructionsEn, es: newInstructionsEs },
  //   guidedVoice: { en: newVoiceEn, es: newVoiceEs },
  // },
} as const;

export const getSoundConfig = (config?: WidgetConfig, exerciseType: string = "4-7-8"): Record<string, HowlOptions> => {
  const exerciseSounds = EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] || EXERCISE_SOUNDS["4-7-8"];
  const backgroundAudioSrc = config?.backgroundUrl || exerciseSounds.background;
  
  return {
    [exerciseType]: {
      src: [backgroundAudioSrc],
      loop: true,
      volume: 0.3,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN background audio:', backgroundAudioSrc, error);
        if (config?.backgroundUrl) {
          console.log('Falling back to local background audio');
        }
      },
    },
  };
};

export const soundConfig: Record<string, HowlOptions> = {
  "4-7-8": {
    src: [backgroundSound],
    loop: true,
    volume: 0.3,
  },
};

export const getInstructionsConfig = (
  lang: string,
  config?: WidgetConfig,
  exerciseType: string = "4-7-8"
): Record<string, HowlOptions> => {
  const langKey = lang === "es" ? "es" : "en";
  const exerciseSounds = EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] || EXERCISE_SOUNDS["4-7-8"];
  const instructionAudioSrc = config?.instructionsUrl || exerciseSounds.instructions[langKey];
  
  return {
    [exerciseType]: {
      src: [instructionAudioSrc],
      loop: true,
      volume: 0.4,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN instruction audio:', instructionAudioSrc, error);
        if (config?.instructionsUrl) {
          console.log('Falling back to local instruction audio');
        }
      },
    },
  };
};

export const getGuidedVoiceConfig = (
  lang: string,
  config?: WidgetConfig,
  exerciseType: string = "4-7-8"
): Record<string, HowlOptions> => {
  const langKey = lang === "es" ? "es" : "en";
  const exerciseSounds = EXERCISE_SOUNDS[exerciseType as keyof typeof EXERCISE_SOUNDS] || EXERCISE_SOUNDS["4-7-8"];
  const guidedVoiceAudioSrc = config?.guidedVoiceUrl || exerciseSounds.guidedVoice[langKey];
  
  return {
    [exerciseType]: {
      src: [guidedVoiceAudioSrc],
      volume: 0.4,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN guided voice audio:', guidedVoiceAudioSrc, error);
        if (config?.guidedVoiceUrl) {
          console.log('Falling back to local guided voice audio');
        }
      },
    },
  };
};

export type SoundKey = keyof typeof soundConfig | string;
