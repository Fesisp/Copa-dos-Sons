/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TEACHER_REPORT_PIN_SHA256?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
