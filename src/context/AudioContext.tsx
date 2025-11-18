import { createContext } from "react";

export interface AudioContextType {
  setBackgroundMusic: (play: boolean) => void;
  setGuidedVoice: (play: boolean) => void;
  volumeDownMusic: () => void;
  volumeUpMusic: () => void;
  stopMusicAndInstructions: () => void;
  isBackgroundMusicPlaying: boolean;
  isGuidedVoicePlaying: boolean;
  handleUserInteraction: () => void;
  audioUnlocked: boolean;
  backgroundEnabled: boolean;
  setBackgroundEnabled: (enabled: boolean) => void;
  instructionsEnabled: boolean;
  setInstructionsEnabled: (enabled: boolean) => void;
  guidedVoiceEnabled: boolean;
  setGuidedVoiceEnabled: (enabled: boolean) => void;
  initAudio: (musicType: musicType) => void;
  showSoundControl: boolean;
  setShowSoundControl: (show: boolean) => void;
}

export type musicType = "none" | "4-7-8";

export const AudioContext = createContext<AudioContextType>({
  setBackgroundMusic: () => {},
  setGuidedVoice: () => {},
  volumeDownMusic: () => {},
  volumeUpMusic: () => {},
  stopMusicAndInstructions: () => {},
  isBackgroundMusicPlaying: false,
  isGuidedVoicePlaying: false,
  handleUserInteraction: () => {},
  audioUnlocked: false,
  backgroundEnabled: true,
  setBackgroundEnabled: () => {},
  instructionsEnabled: true,
  setInstructionsEnabled: () => {},
  guidedVoiceEnabled: true,
  setGuidedVoiceEnabled: () => {},
  initAudio: () => {},
  showSoundControl: true,
  setShowSoundControl: () => {},
});
