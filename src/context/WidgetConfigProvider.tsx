import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { WidgetConfigContext, WidgetConfig } from "./WidgetConfigContext";
import TrevorLogoEn from '../assets/TrevorLogo-en.svg';
import TrevorLogoEs from '../assets/TrevorLogo-es.svg';

interface WidgetConfigProviderProps {
  children: React.ReactNode;
}

const parseQueryParameters = (): WidgetConfig => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    logoUrl: urlParams.get('logoUrl'),
    backgroundUrl: urlParams.get('backgroundUrl'),
    instructionsUrl: urlParams.get('instructionsUrl'),
    guidedVoiceUrl: urlParams.get('guidedVoiceUrl'),
    endingVoiceUrl: urlParams.get('endingVoiceUrl'),
    audioUrl: urlParams.get('audioUrl'),

    donationUrl: urlParams.get('donationUrl'),
    helpUrl: urlParams.get('helpUrl'),
    homeUrl: urlParams.get('homeUrl'),
  };
};

export const WidgetConfigProvider: React.FC<WidgetConfigProviderProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const rawConfig = useMemo(() => parseQueryParameters(), []);
  
  const defaults = useMemo(() => ({
    donationUrl: t("donate-url"),
    helpUrl: t("help-url"),
    homeUrl: t("homepage-url"),
  }), [t]);
  
  const config = useMemo(() => ({
    logoUrl: rawConfig.logoUrl,
    backgroundUrl: rawConfig.backgroundUrl,
    instructionsUrl: rawConfig.instructionsUrl,
    guidedVoiceUrl: rawConfig.guidedVoiceUrl,
    endingVoiceUrl: rawConfig.endingVoiceUrl,
    audioUrl: rawConfig.audioUrl,
    donationUrl: rawConfig.donationUrl === 'no' ? null : (rawConfig.donationUrl || defaults.donationUrl),
    helpUrl: rawConfig.helpUrl === 'no' ? null : (rawConfig.helpUrl || defaults.helpUrl),
    homeUrl: rawConfig.homeUrl === 'no' ? null : (rawConfig.homeUrl || defaults.homeUrl),
  }), [rawConfig, defaults]);
  
  const isLogoOverridden = Boolean(config.logoUrl);
  const isAudioOverridden = Boolean(config.audioUrl);
  
  const defaultLogoSrc = useMemo(() => {
    return i18n.language === 'es' ? TrevorLogoEs : TrevorLogoEn;
  }, [i18n.language]);
  
  const logoSrc = useMemo(() => {
    return config.logoUrl || defaultLogoSrc;
  }, [config.logoUrl, defaultLogoSrc]);
  
  const contextValue = useMemo(() => ({
    config,
    isLogoOverridden,
    isAudioOverridden,
    language: i18n.language as 'es' | 'en',
    logoSrc,
  }), [config, isLogoOverridden, isAudioOverridden, i18n.language, logoSrc]);

  return (
    <WidgetConfigContext.Provider value={contextValue}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

