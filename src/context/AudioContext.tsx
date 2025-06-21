import { createContext } from 'react';

export interface AudioContextType {
  setBackgroundMusic: (play: boolean) => void;
  stopBackgroundMusic: () => void;
  isBackgroundMusicPlaying: boolean;
  handleUserInteraction: () => void;
  audioUnlocked: boolean;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

export type musicType = "none" | "4-7-8";

export const AudioContext = createContext<AudioContextType>({
  setBackgroundMusic: () => {},
  stopBackgroundMusic: () => {},
  isBackgroundMusicPlaying: false,
  handleUserInteraction: () => {},
  audioUnlocked: false,
  isSoundEnabled: false,
  setIsSoundEnabled: () => {},
});