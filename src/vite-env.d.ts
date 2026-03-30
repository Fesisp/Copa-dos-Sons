/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TEACHER_REPORT_PIN?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
