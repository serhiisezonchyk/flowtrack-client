/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
