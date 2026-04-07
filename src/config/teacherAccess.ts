const normalizeSha256Hex = (value: string | undefined): string | null => {
	if (!value) return null;
	const normalized = value.trim().toLowerCase();
	if (!/^[a-f0-9]{64}$/.test(normalized)) return null;
	return normalized;
};

export const TEACHER_REPORT_PIN_SHA256 = normalizeSha256Hex(import.meta.env.VITE_TEACHER_REPORT_PIN_SHA256);
export const TEACHER_REPORT_SESSION_KEY = 'copa_dos_sons_teacher_access';
export const IS_TEACHER_REPORT_PIN_CONFIGURED = TEACHER_REPORT_PIN_SHA256 !== null;
