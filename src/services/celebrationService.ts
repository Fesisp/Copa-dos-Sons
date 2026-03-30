import confetti from 'canvas-confetti';

export const celebrationService = {
  goalExplosion(): void {
    confetti({
      particleCount: 260,
      spread: 110,
      startVelocity: 52,
      origin: { y: 0.62 },
      colors: ['#009C3B', '#002776', '#FFDF00', '#FFFFFF'],
    });

    confetti({
      particleCount: 120,
      spread: 75,
      startVelocity: 40,
      origin: { x: 0.2, y: 0.65 },
      colors: ['#FFDF00', '#FFFFFF', '#009C3B'],
    });

    confetti({
      particleCount: 120,
      spread: 75,
      startVelocity: 40,
      origin: { x: 0.8, y: 0.65 },
      colors: ['#FFDF00', '#FFFFFF', '#002776'],
    });
  },
};
