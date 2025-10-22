import { HowlOptions } from "howler";
import backgroundSound from "../assets/sounds/Background.mp3";
import cycleInstructionsEs from "../assets/sounds/cycle-es.mp3";
import cycleInstructionsEn from "../assets/sounds/cycle-en.mp3";
import introVoiceEs from "../assets/sounds/intro-es.mp3";
import introVoiceEn from "../assets/sounds/intro-en.mp3";
import { WidgetConfig } from "../context/WidgetConfigContext";

export const getSoundConfig = (config?: WidgetConfig): Record<string, HowlOptions> => {
  const backgroundAudioSrc = config?.audioUrl || backgroundSound;
  
  return {
    "4-7-8": {
      src: [backgroundAudioSrc],
      loop: true,
      volume: 0.3,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN background audio:', backgroundAudioSrc, error);
        if (config?.audioUrl) {
          console.log('Falling back to local background audio');
        }
      },
    },
  };
};

// Keep the original export for backward compatibility
export const soundConfig: Record<string, HowlOptions> = {
  "4-7-8": {
    src: [backgroundSound],
    loop: true,
    volume: 0.3,
  },
};

export const getInstructionsConfig = (
  lang: string,
  config?: WidgetConfig
): Record<string, HowlOptions> => {
  const instructionAudioSrc = config?.audioUrl || (lang === "es" ? cycleInstructionsEs : cycleInstructionsEn);
  
  return {
    "4-7-8": {
      src: [instructionAudioSrc],
      loop: true,
      volume: 0.4,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN instruction audio:', instructionAudioSrc, error);
        if (config?.audioUrl) {
          console.log('Falling back to local instruction audio');
        }
      },
    },
  };
};

export const getGuidedVoiceConfig = (
  lang: string,
  config?: WidgetConfig
): Record<string, HowlOptions> => {
  const guidedVoiceAudioSrc = config?.audioUrl || (lang === "es" ? introVoiceEs : introVoiceEn);
  
  return {
    "4-7-8": {
      src: [guidedVoiceAudioSrc],
      volume: 0.4,
      onloaderror: (_, error) => {
        console.error('Failed to load CDN guided voice audio:', guidedVoiceAudioSrc, error);
        if (config?.audioUrl) {
          console.log('Falling back to local guided voice audio');
        }
      },
    },
  };
};

export type SoundKey = keyof typeof soundConfig | string;
