import { createContext } from "react";

export interface AudioContextType {
  setBackgroundMusic: (play: boolean) => void;
  setGuidedVoice: (play: boolean, duration?: number) => void;
  volumeDownMusic: () => void;
  volumeUpMusic: () => void;
  stopMusicAndInstructions: () => void;
  isBackgroundMusicPlaying: boolean;
  handleUserInteraction: () => void;
  audioUnlocked: boolean;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  initAudio: (musicType: musicType) => void;
}

export type musicType = "none" | "4-7-8";

export const AudioContext = createContext<AudioContextType>({
  setBackgroundMusic: () => {},
  setGuidedVoice: () => {},
  volumeDownMusic: () => {},
  volumeUpMusic: () => {},
  stopMusicAndInstructions: () => {},
  isBackgroundMusicPlaying: false,
  handleUserInteraction: () => {},
  audioUnlocked: false,
  isSoundEnabled: false,
  setIsSoundEnabled: () => {},
  initAudio: () => {},
});
