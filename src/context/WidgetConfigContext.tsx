import { createContext, useContext } from "react";

export interface WidgetConfig {
  logoUrl: string | null;
  audioUrl: string | null;
  donationUrl: string | null;
  helpUrl: string | null;
  homeUrl: string | null;
}

export interface WidgetConfigContextType {
  config: WidgetConfig;
  isLogoOverridden: boolean;
  isAudioOverridden: boolean;
}

const WidgetConfigContext = createContext<WidgetConfigContextType | undefined>(undefined);

export const useWidgetConfig = (): WidgetConfigContextType => {
  const context = useContext(WidgetConfigContext);
  if (context === undefined) {
    throw new Error("useWidgetConfig must be used within a WidgetConfigProvider");
  }
  return context;
};

export { WidgetConfigContext };

