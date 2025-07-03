import { HowlOptions } from 'howler';
import backgroundSound from '../assets/sounds/Background.mp3';

export const soundConfig: Record<string, HowlOptions> = {
  "4-7-8": {
    src: [backgroundSound],
    loop: true,
    volume: 0.3,
  },
};

export type SoundKey = keyof typeof soundConfig | string;
 