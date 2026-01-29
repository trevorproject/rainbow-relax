/**
 * GA Consent Management Utility
 * 
 * Manages Google Analytics consent using localStorage for cross-origin iframe compatibility.
 * Provides backward compatibility with cookie-based consent storage.
 */

const GA_CONSENT_KEY = 'rainbow-relax-ga-consent';
const GA_CONSENT_COOKIE_NAME = 'cookie1';
const CONSENT_EXPIRATION_DAYS = 150;

/**
 * Gets the GA consent value from localStorage or cookies (for backward compatibility).
 * 
 * Priority: localStorage (primary, works in cross-origin iframes) -> cookies (fallback, same-origin only)
 * If cookie value exists, it's migrated to localStorage for future cross-origin compatibility.
 * 
 * @returns "true" if consent was granted, "false" if declined, null if not set
 */
export function getGAConsentValue(): "true" | "false" | null {
  // Try localStorage first (works in cross-origin iframes)
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
    // localStorage not available
  }

  // Fallback to cookies (for backward compatibility, same-origin scenarios)
  // Migrate cookie value to localStorage if found
  try {
    const cookieValue = getCookieValue(GA_CONSENT_COOKIE_NAME);
    
    if (cookieValue === "true" || cookieValue === "false") {
      setGAConsentValue(cookieValue as "true" | "false");
      return cookieValue as "true" | "false";
    }
  } catch {
    // Cookie access failed (expected in cross-origin iframes)
  }

  return null;
}

/**
 * Sets the GA consent value in both localStorage and cookies (dual-write for compatibility).
 * 
 * Note: In cross-origin iframes, cookies will fail silently (third-party cookies are blocked),
 * but localStorage will work. This dual-write ensures compatibility with both same-origin
 * and cross-origin embedding scenarios.
 * 
 * @param value - "true" for accepted, "false" for declined
 */
export function setGAConsentValue(value: "true" | "false"): void {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + CONSENT_EXPIRATION_DAYS);
  
  // Primary storage: localStorage (works in cross-origin iframes)
  try {
    const storedValue = JSON.stringify({
      value,
      expires: expirationDate.getTime(),
    });
    localStorage.setItem(GA_CONSENT_KEY, storedValue);
  } catch {
    // localStorage not available (rare, e.g., private browsing mode)
  }

  // Secondary storage: cookies (for same-origin scenarios, fails silently in cross-origin)
  try {
    const expires = expirationDate.toUTCString();
    document.cookie = `${GA_CONSENT_COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
  } catch {
    // Cookie write failed (expected in cross-origin iframes where third-party cookies are blocked)
  }
}

/**
 * Checks if the user has granted GA consent.
 * 
 * @returns true if consent was granted, false otherwise
 */
export function hasGAConsent(): boolean {
  return getGAConsentValue() === "true";
}

/**
 * Parses stored consent value from localStorage.
 * Handles both old format (plain string) and new format (JSON with expiration).
 */
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

/**
 * Checks if consent has expired based on stored expiration timestamp.
 */
function isConsentExpired(parsed: { value: "true" | "false"; expires?: number }): boolean {
  if (!parsed.expires) {
    return false;
  }
  return Date.now() > parsed.expires;
}

/**
 * Gets a cookie value by name.
 */
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
