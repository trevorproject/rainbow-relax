import { createContext, useContext } from "react";

export interface WidgetConfig {
  logoUrl: string | null;
  backgroundUrl: string | null;
  instructionsUrl: string | null;
  guidedVoiceUrl: string | null;
  donationUrl: string | null;
  helpUrl: string | null;
  homeUrl: string | null;
}

export interface WidgetConfigContextType {
  config: WidgetConfig;
  isLogoOverridden: boolean;
  isAudioOverridden: boolean;
  language: 'es' | 'en';
}

export const WidgetConfigContext = createContext<WidgetConfigContextType | undefined>(undefined);

export const useWidgetConfig = (): WidgetConfigContextType => {
  const context = useContext(WidgetConfigContext);
  if (context === undefined) {
    throw new Error("useWidgetConfig must be used within a WidgetConfigProvider");
  }
  return context;
};

