import { HowlOptions } from 'howler';

export const soundConfig: Record<string, HowlOptions> = {
  "4-7-8": {
    src: ['/sounds/Background.mp3'],
    loop: true,
    volume: 0.3,
  },
};

export type SoundKey = keyof typeof soundConfig | string;
 