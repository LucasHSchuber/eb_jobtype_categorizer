/// <reference types="vite/client" />
// vite-env.d.ts
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.mp4' {
  const content: any;
  export default content;
}

// env.d.ts
declare module '*.js' {
  const content: any;
  export default content;
}

// env.d.ts
declare module '*.ts' {
  const content: any;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TOKEN: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// // Extend ImportMeta interface for environment variables
// interface ImportMetaEnv {
//   VITE_API_KEY: string;
//   VITE_SPOTIFY_CLIENT_ID: string;
//   VITE_SPOTIFY_CLIENT_SECRET: string;
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }