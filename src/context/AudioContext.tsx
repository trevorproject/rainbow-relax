import { createContext } from "react";

export type musicType = "none" | "4-7-8" | "box-breathing" | "equal-breathing";

export interface AudioContextType {
  setBackgroundMusic: (play: boolean, seekPosition?: number) => void;
  setGuidedVoice: (play: boolean, seekPosition?: number) => void;
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
  waitForAudioLoad: (timeoutMs?: number) => Promise<boolean>;
}

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
  waitForAudioLoad: async () => false,
});
