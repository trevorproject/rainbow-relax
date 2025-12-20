/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.mp3?url" {
  const src: string;
  export default src;
}

/**
 * Type definitions for the Network Information API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */
interface NetworkInformation extends EventTarget {
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
}

interface Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}
