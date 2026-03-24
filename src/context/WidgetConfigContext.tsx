import React, { createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import TrevorLogoEn from "../assets/TrevorLogo-en.svg";
import TrevorLogoEs from "../assets/TrevorLogo-es.svg";

/**
 * Only allow http/https URLs to prevent javascript: and data: injection.
 * Returns null for anything that doesn't pass.
 */
function sanitizeUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

export interface WidgetConfig {
  logoUrl: string | null;
  backgroundUrl: string | null;
  instructionsUrl: string | null;
  guidedVoiceUrl: string | null;
  endingVoiceUrl: string | null;
  audioUrl: string | null;
  donationUrl: string | null;
  helpUrl: string | null;
  homeUrl: string | null;
}

export interface WidgetConfigContextType {
  config: WidgetConfig;
  isLogoOverridden: boolean;
  isAudioOverridden: boolean;
  language: 'es' | 'en';
  logoSrc: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WidgetConfigContext = createContext<WidgetConfigContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useWidgetConfig = (): WidgetConfigContextType => {
  const context = useContext(WidgetConfigContext);
  if (context === undefined) throw new Error("useWidgetConfig must be used within a WidgetConfigProvider");
  return context;
};

const parseQueryParameters = (): WidgetConfig => {
  const urlParams = new URLSearchParams(window.location.search);
  const raw = (key: string) => urlParams.get(key);
  const url  = (key: string) => sanitizeUrl(urlParams.get(key));
  return {
    logoUrl:          url("logoUrl"),
    backgroundUrl:    url("backgroundUrl"),
    instructionsUrl:  url("instructionsUrl"),
    guidedVoiceUrl:   url("guidedVoiceUrl"),
    endingVoiceUrl:   url("endingVoiceUrl"),
    audioUrl:         url("audioUrl"),
    // "no" is a valid sentinel value — preserve it, but sanitize actual URLs
    donationUrl:      raw("donationUrl") === "no" ? "no" : url("donationUrl"),
    helpUrl:          raw("helpUrl")     === "no" ? "no" : url("helpUrl"),
    homeUrl:          raw("homeUrl")     === "no" ? "no" : url("homeUrl"),
  };
};

export const WidgetConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const rawConfig = useMemo(() => parseQueryParameters(), []);

  const defaults = useMemo(
    () => ({ donationUrl: t("donate-url"), helpUrl: t("help-url"), homeUrl: t("homepage-url") }),
    [t]
  );

  const config = useMemo<WidgetConfig>(() => ({
    logoUrl:         rawConfig.logoUrl,
    backgroundUrl:   rawConfig.backgroundUrl,
    instructionsUrl: rawConfig.instructionsUrl,
    guidedVoiceUrl:  rawConfig.guidedVoiceUrl,
    endingVoiceUrl:  rawConfig.endingVoiceUrl,
    audioUrl:        rawConfig.audioUrl,
    donationUrl:     rawConfig.donationUrl === "no" ? null : (rawConfig.donationUrl || defaults.donationUrl),
    helpUrl:         rawConfig.helpUrl === "no"     ? null : (rawConfig.helpUrl     || defaults.helpUrl),
    homeUrl:         rawConfig.homeUrl === "no"     ? null : (rawConfig.homeUrl     || defaults.homeUrl),
  }), [rawConfig, defaults]);

  const defaultLogoSrc = useMemo(
    () => (i18n.language === "es" ? TrevorLogoEs : TrevorLogoEn),
    [i18n.language]
  );

  const contextValue = useMemo(() => ({
    config,
    isLogoOverridden:  Boolean(config.logoUrl),
    isAudioOverridden: Boolean(config.audioUrl),
    language:          i18n.language as "es" | "en",
    logoSrc:           config.logoUrl || defaultLogoSrc,
  }), [config, i18n.language, defaultLogoSrc]);

  return (
    <WidgetConfigContext.Provider value={contextValue}>
      {children}
    </WidgetConfigContext.Provider>
  );
};

