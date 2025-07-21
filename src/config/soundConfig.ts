import { HowlOptions } from "howler";
import backgroundSound from "../assets/sounds/Background.mp3";
import cycleInstructionsEs from "../assets/sounds/cycle-es.mp3";
import cycleInstructionsEn from "../assets/sounds/cycle-en.mp3";

export const soundConfig: Record<string, HowlOptions> = {
  "4-7-8": {
    src: [backgroundSound],
    loop: true,
    volume: 0.3,
  },
};

export const getInstructionsConfig = (
  lang: string
): Record<string, HowlOptions> => ({
  "4-7-8": {
    src: lang === "es" ? [cycleInstructionsEs] : [cycleInstructionsEn],
    loop: true,
    volume: 0.4,
  },
});

export type SoundKey = keyof typeof soundConfig | string;
