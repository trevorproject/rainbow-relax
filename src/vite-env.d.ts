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
