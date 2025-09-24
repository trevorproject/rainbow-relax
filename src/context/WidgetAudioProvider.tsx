import { useSimpleWidgetAudio } from '../hooks/useSimpleWidgetAudio';
import { AudioContext } from './AudioContext';

export const WidgetAudioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioHook = useSimpleWidgetAudio();

  return (
    <AudioContext.Provider value={audioHook}>
      {children}
    </AudioContext.Provider>
  );
};


