import React, { useMemo } from "react";
import { WidgetConfigContext, WidgetConfig } from "./WidgetConfigContext";

interface WidgetConfigProviderProps {
  children: React.ReactNode;
}

const parseQueryParameters = (): WidgetConfig => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    logoUrl: urlParams.get('logoUrl'),
    audioUrl: urlParams.get('audioUrl'),
    donationUrl: urlParams.get('donationUrl'),
    helpUrl: urlParams.get('helpUrl'),
    homeUrl: urlParams.get('homeUrl'),
  };
};

export const WidgetConfigProvider: React.FC<WidgetConfigProviderProps> = ({ children }) => {
  const config = useMemo(() => parseQueryParameters(), []);
  
  const isLogoOverridden = Boolean(config.logoUrl);
  const isAudioOverridden = Boolean(config.audioUrl);
  
  const contextValue = useMemo(() => ({
    config,
    isLogoOverridden,
    isAudioOverridden,
  }), [config, isLogoOverridden, isAudioOverridden]);

  return (
    <WidgetConfigContext.Provider value={contextValue}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

