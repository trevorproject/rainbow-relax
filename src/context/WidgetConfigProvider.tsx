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

const getDefaultUrls = () => {
  // These would typically come from i18n or environment config
  return {
    donationUrl: "https://give.thetrevorproject.org/campaign/716635/donate",
    helpUrl: "https://www.thetrevorproject.org/get-help", 
    homeUrl: "https://www.thetrevorproject.org/",
  };
};


export const WidgetConfigProvider: React.FC<WidgetConfigProviderProps> = ({ children }) => {
  const rawConfig = useMemo(() => parseQueryParameters(), []);
  const defaults = useMemo(() => getDefaultUrls(), []);
  
  const config = useMemo(() => ({
    logoUrl: rawConfig.logoUrl,
    audioUrl: rawConfig.audioUrl,
    donationUrl: rawConfig.donationUrl === 'no' ? null : (rawConfig.donationUrl || defaults.donationUrl),
    helpUrl: rawConfig.helpUrl === 'no' ? null : (rawConfig.helpUrl || defaults.helpUrl),
    homeUrl: rawConfig.homeUrl === 'no' ? null : (rawConfig.homeUrl || defaults.homeUrl),
  }), [rawConfig, defaults]);
  
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

