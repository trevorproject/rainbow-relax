// ─── GA4 Event Tracking ──────────────────────────────────────────────────────

import ReactGA from "react-ga4";

export const screenMap: Record<string, string> = {
  "/": "welcome",
  "/index.html": "welcome",
  "/breathing": "breathing",
  "/thank-you": "thank_you",
};

export const EVENTS = {
  APP_OPENED:                "app_opened",
  SCREEN_VIEW:               "screen_view",
  CONSENT_SHOWN:             "consent_shown",
  CONSENT_ACCEPTED:          "consent_accepted",
  CONSENT_DECLINED:          "consent_declined",
  WELCOME_VIEWED:            "welcome_viewed",
  QUICKSTART_PRESET_SELECTED:"quickstart_preset_selected",
  BREATHING_STARTED:         "breathing_started",
  BREATHING_COMPLETED:       "breathing_completed",
  BREATHING_PAUSED_TOGGLED:  "breathing_paused_toggled",
  BREATHING_BACK_CLICK:      "breathing_back_click",
  SOUND_TOGGLED:             "sound_toggled",
  THANK_YOU_VIEWED:          "thank_you_viewed",
  TRY_AGAIN_CLICK:           "try_again_click",
  GET_HELP_CLICK:            "get_help_click",
  DONATE_CLICK:              "donate_click",
  LOGO_CLICK:                "logo_click",
  SURVEY_INVITE_SHOWN:       "survey_invite_shown",
  SURVEY_STARTED:            "survey_started",
  SURVEY_INVITE_SKIPPED:     "survey_invite_skipped",
  SURVEY_SUBMITTED:          "survey_submitted",
  EXERCISE_INFO_TOGGLED:     "exercise_info_toggled",
  LANGUAGE_CHANGED:          "language_changed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

type GAParamValue = string | number | boolean;
export type GAParams = Record<string, GAParamValue>;
export type GAParamsInput = Record<string, GAParamValue | null | undefined>;

const GA_DEBUG = import.meta.env.VITE_GA_DEBUG === "true";

type QueuedEvent = { name: EventName; params: GAParams };
const eventQueue: QueuedEvent[] = [];
let isGA4Ready = false;

function cleanParams(params: GAParamsInput): GAParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
  ) as GAParams;
}

function sendEvent(name: EventName, params: GAParams = {}) {
  ReactGA.gtag("event", name, {
    ...params,
    transport_type: "beacon",
    ...(GA_DEBUG ? { debug_mode: true } : {}),
    ...(GA_DEBUG ? { event_callback: () => console.log("📨 GA4 ACK:", name) } : {}),
  });
}

export function setGA4Ready(ready: boolean) {
  isGA4Ready = ready;
  if (isGA4Ready && eventQueue.length > 0) {
    for (const { name, params } of eventQueue) sendEvent(name, params);
    eventQueue.length = 0;
  }
}

export function track(name: EventName, params: GAParamsInput = {}) {
  const cleanedParams = cleanParams(params);
  if (!isGA4Ready) {
    eventQueue.push({ name, params: cleanedParams });
    return;
  }
  sendEvent(name, cleanedParams);
}

// ─── GA Consent ──────────────────────────────────────────────────────────────

const GA_CONSENT_KEY = "rainbow-relax-ga-consent";
const GA_CONSENT_COOKIE_NAME = "cookie1";
const CONSENT_EXPIRATION_DAYS = 150;

export function getGAConsentValue(): "true" | "false" | null {
  try {
    const stored = localStorage.getItem(GA_CONSENT_KEY);
    if (stored !== null) {
      const parsed = parseStoredConsent(stored);
      if (parsed !== null && !isConsentExpired(parsed)) return parsed.value;
      localStorage.removeItem(GA_CONSENT_KEY);
    }
  } catch {
    // fall through to cookie
  }
  try {
    const cookieValue = getCookieValue(GA_CONSENT_COOKIE_NAME);
    if (cookieValue === "true" || cookieValue === "false") {
      setGAConsentValue(cookieValue as "true" | "false");
      return cookieValue as "true" | "false";
    }
  } catch {
    return null;
  }
  return null;
}

export function setGAConsentValue(value: "true" | "false"): void {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + CONSENT_EXPIRATION_DAYS);
  try {
    localStorage.setItem(GA_CONSENT_KEY, JSON.stringify({ value, expires: expirationDate.getTime() }));
  } catch { /* ignore */ }
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${GA_CONSENT_COOKIE_NAME}=${value}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax${secure}`;
  } catch { /* ignore */ }
}

export function hasGAConsent(): boolean {
  return getGAConsentValue() === "true";
}

function parseStoredConsent(stored: string): { value: "true" | "false"; expires?: number } | null {
  try {
    const parsed = JSON.parse(stored);
    if (parsed && (parsed.value === "true" || parsed.value === "false")) {
      return { value: parsed.value, expires: parsed.expires };
    }
  } catch {
    if (stored === "true" || stored === "false") return { value: stored as "true" | "false" };
  }
  return null;
}

function isConsentExpired(parsed: { value: "true" | "false"; expires?: number }): boolean {
  if (!parsed.expires) return false;
  return Date.now() > parsed.expires;
}

function getCookieValue(name: string): string | null {
  for (const cookie of document.cookie.split("; ")) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return decodeURIComponent(cookieValue);
  }
  return null;
}
