const normalizePin = (value: string | undefined): string | null => {
	if (!value) return null;
	const normalized = value.trim();
	if (!/^\d{4,8}$/.test(normalized)) return null;
	return normalized;
};

export const TEACHER_REPORT_PIN = normalizePin(import.meta.env.VITE_TEACHER_REPORT_PIN) ?? '2026';
export const TEACHER_REPORT_SESSION_KEY = 'copa_dos_sons_teacher_access';
