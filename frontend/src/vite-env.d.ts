/// <reference types="vite/client" />
declare module '*.ts'
declare module '*.xlsx'
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
