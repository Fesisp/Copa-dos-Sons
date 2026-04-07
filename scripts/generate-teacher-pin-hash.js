import { createHash } from 'node:crypto';

const pin = process.argv[2]?.trim();

if (!pin || !/^\d{4,8}$/.test(pin)) {
  console.error('Uso: npm run teacher:pin-hash -- <PIN de 4 a 8 dígitos>');
  process.exit(1);
}

const hash = createHash('sha256').update(pin, 'utf8').digest('hex');
console.log(`VITE_TEACHER_REPORT_PIN_SHA256=${hash}`);
