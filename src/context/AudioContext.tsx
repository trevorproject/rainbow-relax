export type musicType = "none" | "4-7-8";

export interface AudioContextType {
  setBackgroundMusic: (play: boolean, seekPosition?: number) => void;
  setGuidedVoice: (play: boolean, seekPosition?: number) => void;
  setEndingVoice:(play: boolean, seekPosition?: number) => void;
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
  setEndingEnabled:(enabled: boolean) => void;
  endingVoiceEnabled: boolean;
  playEndingVoice: () => void;
  initAudio: (musicType: musicType) => void;
  showSoundControl: boolean;
  setShowSoundControl: (show: boolean) => void;
  waitForAudioLoad: (timeoutMs?: number) => Promise<boolean>;
}
