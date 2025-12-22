/**
 * Configuration constants for the consent flow.
 * 
 * These values control when the consent prompt is shown to users
 * based on their network connection quality.
 */

/**
 * Network connection types considered "slow" that should trigger
 * the consent prompt. These are based on the Network Information API's
 * effectiveType property.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
 */
export const SLOW_CONNECTION_TYPES = ["slow-2g", "2g", "3g"] as const;

/**
 * Type guard to check if an effectiveType is considered a slow connection.
 * 
 * @param effectiveType - The effectiveType from NetworkInformation API
 * @returns true if the connection type is considered slow
 */
export function isSlowConnectionType(
  effectiveType: "slow-2g" | "2g" | "3g" | "4g" | undefined
): boolean {
  if (!effectiveType) {
    return false;
  }
  return (SLOW_CONNECTION_TYPES as readonly string[]).includes(effectiveType);
}

/**
 * Minimum downlink speed (in Mbps) considered acceptable.
 * Connections below this threshold will trigger the consent prompt.
 * 
 * 3G connections typically have speeds < 1.5 Mbps, so this threshold
 * helps identify slower connections even when effectiveType is unavailable.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/downlink
 */
export const MIN_DOWNLINK_MBPS = 1.5;

/**
 * Fallback app size value used when app-size.json cannot be loaded.
 * This is an approximate value that may need adjustment as the application grows.
 * 
 * Format: Human-readable string representation of the app size.
 */
export const FALLBACK_APP_SIZE_FORMATTED = "~3 MB";

/**
 * Fallback app size in bytes (0 indicates unknown/fallback value).
 */
export const FALLBACK_APP_SIZE_BYTES = 0;

