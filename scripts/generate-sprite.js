import audiosprite from 'audiosprite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawAudioDir = path.resolve(__dirname, '../public/audio/raw');
const outputDir = path.resolve(__dirname, '../public/audio');

if (!fs.existsSync(rawAudioDir)) {
  fs.mkdirSync(rawAudioDir, { recursive: true });
  console.log('⚠️ Pasta "public/audio/raw" criada. Coloque seus arquivos .mp3 lá e rode novamente.');
  process.exit(0);
}

const files = fs
  .readdirSync(rawAudioDir)
  .filter((file) => file.endsWith('.mp3'))
  .map((file) => path.join(rawAudioDir, file));

if (files.length === 0) {
  console.log('❌ Nenhum arquivo .mp3 encontrado em public/audio/raw.');
  process.exit(1);
}

const opts = {
  output: path.join(outputDir, 'phonemes-sprite'),
  export: 'mp3',
  format: 'howler',
  gap: 1,
};

console.log('⚽ Gerando Audio Sprite da Copa dos Sons...');

audiosprite(files, opts, (err, obj) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  fs.writeFileSync(path.join(outputDir, 'phonemes-index.json'), JSON.stringify(obj, null, 2));

  console.log('✅ Áudio Sprite (phonemes-sprite.mp3) e Índices (phonemes-index.json) gerados com sucesso!');
});
