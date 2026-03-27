import confetti from 'canvas-confetti';

export const celebrationService = {
  goalExplosion(): void {
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#22c55e', '#0ea5e9', '#facc15', '#ffffff'],
    });
  },
};
