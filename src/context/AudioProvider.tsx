import type { ReactNode } from "react";
import { useAudio } from '../hooks/useAudio';
import { AudioContext } from './AudioContext';

export const AudioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioHook = useAudio();

  return (
    <AudioContext.Provider value={audioHook}>
      {children}
    </AudioContext.Provider>
  );
};
