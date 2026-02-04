const GA_CONSENT_KEY = 'rainbow-relax-ga-consent';
const GA_CONSENT_COOKIE_NAME = 'cookie1';
const CONSENT_EXPIRATION_DAYS = 150;

export function getGAConsentValue(): "true" | "false" | null {
  try {
    const stored = localStorage.getItem(GA_CONSENT_KEY);
    
    if (stored !== null) {
      const parsed = parseStoredConsent(stored);
      
      if (parsed !== null && !isConsentExpired(parsed)) {
        return parsed.value;
      }
      localStorage.removeItem(GA_CONSENT_KEY);
    }
  } catch {
    return null;
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
    const storedValue = JSON.stringify({
      value,
      expires: expirationDate.getTime(),
    });
    localStorage.setItem(GA_CONSENT_KEY, storedValue);
  } catch {
    return;
  }

  try {
    const expires = expirationDate.toUTCString();
    document.cookie = `${GA_CONSENT_COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
  } catch {
    return;
  }
}

export function hasGAConsent(): boolean {
  return getGAConsentValue() === "true";
}

function parseStoredConsent(stored: string): { value: "true" | "false"; expires?: number } | null {
  try {
    const parsed = JSON.parse(stored);
    if (parsed && (parsed.value === "true" || parsed.value === "false")) {
      return {
        value: parsed.value,
        expires: parsed.expires,
      };
    }
  } catch {
    if (stored === "true" || stored === "false") {
      return { value: stored as "true" | "false" };
    }
  }
  return null;
}

function isConsentExpired(parsed: { value: "true" | "false"; expires?: number }): boolean {
  if (!parsed.expires) {
    return false;
  }
  return Date.now() > parsed.expires;
}

function getCookieValue(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
