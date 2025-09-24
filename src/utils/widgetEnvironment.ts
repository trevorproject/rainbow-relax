export interface WidgetRuntimeConfig {
  showQuickExit?: boolean;
  donateURL?: string;
  getHelpURL?: string;
  GTAG?: string;
  showConsentBanner?: boolean;
  width?: string;
  height?: string;
  containerId?: string;
  cdnBase?: string;
  assetBase?: string;
  audioBase?: string;
  audioEnabled?: boolean;
  debug?: boolean;
}

const WIDGET_SCRIPT_ID = 'rainbow-relax';

export const ensureTrailingSlash = (value: string): string => {
  if (!value) {
    return '';
  }
  return value.endsWith('/') ? value : `${value}/`;
};

const resolveUrl = (value: string, base: string): string => {
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
};

export const detectWidgetMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const win = window as typeof window & { myWidgetConfig?: WidgetRuntimeConfig };
  if (win.myWidgetConfig) {
    return true;
  }

  if (typeof document !== 'undefined' && document.getElementById('rainbow-relax-container')) {
    return true;
  }

  return window.location.pathname.includes('widget');
};

export const getExecutingScript = (): HTMLScriptElement | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const current = document.currentScript as HTMLScriptElement | null;
  if (current && (current.id === WIDGET_SCRIPT_ID || current.src.includes('rainbowRelax'))) {
    return current;
  }

  const byId = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;
  if (byId) {
    return byId;
  }

  const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'));
  return scripts.find(script => script.src.includes('rainbowRelax.js')) ?? null;
};

export const getScriptBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return './';
  }

  const script = getExecutingScript();
  if (script?.src) {
    const url = new URL(script.src, window.location.href);
    url.pathname = url.pathname.replace(/[^/]*$/, '');
    return ensureTrailingSlash(url.toString());
  }

  return ensureTrailingSlash(new URL('.', window.location.href).toString());
};

export const normalizeWidgetConfig = (incoming: WidgetRuntimeConfig = {}): WidgetRuntimeConfig => {
  if (typeof window === 'undefined') {
    return { ...incoming };
  }

  const win = window as typeof window & { myWidgetConfig?: WidgetRuntimeConfig };
  const existing = win.myWidgetConfig || {};
  const scriptBase = getScriptBaseUrl();

  const cdnCandidate = incoming.cdnBase ?? existing.cdnBase ?? scriptBase;
  const cdnBase = ensureTrailingSlash(resolveUrl(cdnCandidate, scriptBase));

  const assetCandidate = incoming.assetBase ?? existing.assetBase ?? cdnBase;
  const assetBase = ensureTrailingSlash(resolveUrl(assetCandidate, cdnBase));

  const audioCandidate = incoming.audioBase ?? existing.audioBase ?? `${assetBase}sounds/`;
  const audioBase = ensureTrailingSlash(resolveUrl(audioCandidate, assetBase));

  const merged: WidgetRuntimeConfig = {
    ...existing,
    ...incoming,
    cdnBase,
    assetBase,
    audioBase,
  };

  win.myWidgetConfig = merged;
  return merged;
};
