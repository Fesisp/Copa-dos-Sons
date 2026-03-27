import audiosprite from 'audiosprite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { spawnSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawAudioDir = path.resolve(__dirname, '../public/audio/raw');
const outputDir = path.resolve(__dirname, '../public/audio');
const audioExtensions = new Set(['.mp3', '.m4a', '.wav']);

const requiredKeys = [
  'p', 'b', 'm', 't', 'd', 'n', 'k', 'g',
  'f', 'v', 's', 'z', 'r', 'l',
  'ch', 'j', 'x', 'nh', 'lh', 'rr',
  'e', 'o', 'an', 'on',
  'acerto', 'erro', 'gol',
];

const aliasMap = {
  e: ['e', 'eh', 'é', 'ê'],
  o: ['o', 'oh', 'ó', 'ô'],
  an: ['an', 'am', 'ã'],
  on: ['on', 'om', 'õ'],
  rr: ['rr', 'r2'],
  r: ['r'],
  gol: ['gol', 'completar'],
  acerto: ['acerto'],
  erro: ['erro'],
};

const directAliasLookup = Object.fromEntries(
  Object.entries(aliasMap).flatMap(([canonical, aliases]) =>
    aliases.map((alias) => [alias.toLowerCase().replace(/\s+/g, ''), canonical])
  )
);

function normalizeKey(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function toCanonicalKey(rawKey) {
  const lowered = rawKey.toLowerCase().replace(/\s+/g, '');
  if (directAliasLookup[lowered]) {
    return directAliasLookup[lowered];
  }

  const normalized = normalizeKey(lowered);
  if (directAliasLookup[normalized]) {
    return directAliasLookup[normalized];
  }

  return normalized;
}

if (ffmpegPath) {
  const ffmpegDir = path.dirname(ffmpegPath);
  process.env.PATH = `${ffmpegDir}${path.delimiter}${process.env.PATH ?? ''}`;
}

if (!fs.existsSync(rawAudioDir)) {
  fs.mkdirSync(rawAudioDir, { recursive: true });
  console.log('⚠️ Pasta "public/audio/raw" criada. Coloque seus arquivos .mp3 lá e rode novamente.');
  process.exit(0);
}

const sourceEntries = fs
  .readdirSync(rawAudioDir)
  .filter((file) => audioExtensions.has(path.extname(file).toLowerCase()))
  .map((file) => {
    const key = path.basename(file, path.extname(file));
    return {
      file,
      key,
      filePath: path.join(rawAudioDir, file),
    };
  });

if (sourceEntries.length === 0) {
  console.log('❌ Nenhum arquivo de áudio encontrado em public/audio/raw (aceitos: .mp3, .m4a).');
  process.exit(1);
}

const groups = sourceEntries.reduce((acc, entry) => {
  const canonicalKey = toCanonicalKey(entry.key);
  if (!acc[canonicalKey]) {
    acc[canonicalKey] = [];
  }
  acc[canonicalKey].push(entry);
  return acc;
}, {});

const resolvedEntries = [];
const duplicateWarnings = [];

for (const [canonicalKey, entries] of Object.entries(groups)) {
  const best =
    entries.find((entry) => normalizeKey(entry.key) === canonicalKey) ??
    entries.find((entry) => path.extname(entry.file).toLowerCase() === '.mp3') ??
    entries[0];

  resolvedEntries.push({ canonicalKey, entry: best });

  if (entries.length > 1) {
    duplicateWarnings.push({ canonicalKey, files: entries.map((item) => item.file), selected: best.file });
  }
}

if (duplicateWarnings.length > 0) {
  console.log('⚠️ Encontradas chaves duplicadas após normalização. Foi escolhido automaticamente um arquivo por chave:');
  duplicateWarnings.forEach((warn) => {
    console.log(`   - ${warn.canonicalKey}: [${warn.files.join(', ')}] -> usando ${warn.selected}`);
  });
}

const availableCanonical = new Set(resolvedEntries.map((item) => item.canonicalKey));
const missingRequired = requiredKeys.filter((key) => !availableCanonical.has(key));

if (missingRequired.length > 0) {
  console.log('⚠️ Faltam chaves obrigatórias para cobertura completa de áudio:');
  console.log(`   ${missingRequired.join(', ')}`);
  console.log('   O sprite será gerado com as chaves disponíveis.');
}

const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
if (ffmpegCheck.status !== 0) {
  console.error('❌ FFmpeg não encontrado no PATH.');
  console.error('   O script tentou usar ffmpeg-static automaticamente, mas não conseguiu iniciar o binário.');
  process.exit(1);
}

const tempInputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'copa-sprite-'));

const files = resolvedEntries
  .sort((a, b) => a.canonicalKey.localeCompare(b.canonicalKey))
  .map(({ canonicalKey, entry }) => {
    const ext = path.extname(entry.file).toLowerCase();
    const tempPath = path.join(tempInputDir, `${canonicalKey}${ext}`);
    fs.copyFileSync(entry.filePath, tempPath);
    return tempPath;
  });

const opts = {
  output: path.join(outputDir, 'phonemes-sprite'),
  export: 'mp3',
  format: 'howler',
  gap: 1,
  channels: 1,
  samplerate: 44100,
};

console.log('⚽ Gerando Audio Sprite da Copa dos Sons...');

audiosprite(files, opts, (err, obj) => {
  fs.rmSync(tempInputDir, { recursive: true, force: true });

  if (err) {
    console.error(err);
    process.exit(1);
  }

  const normalizedIndex = {};

  if (obj?.sprite) {
    Object.entries(obj.sprite).forEach(([key, value]) => {
      const tuple = Array.isArray(value) ? value : [];
      normalizedIndex[key] = {
        start: Math.round(Number(tuple[0] ?? 0)),
        duration: Math.max(0, Math.round(Number(tuple[1] ?? 0))),
      };
    });
  } else if (obj?.spritemap) {
    Object.entries(obj.spritemap).forEach(([key, value]) => {
      normalizedIndex[key] = {
        start: Math.round(value.start * 1000),
        duration: Math.max(0, Math.round((value.end - value.start) * 1000)),
      };
    });
  } else {
    console.error('❌ Retorno inesperado do audiosprite. Índice não pôde ser gerado.');
    process.exit(1);
  }

  fs.writeFileSync(path.join(outputDir, 'phonemes-index.json'), JSON.stringify(normalizedIndex, null, 2));

  console.log('✅ Áudio Sprite (phonemes-sprite.mp3) e Índices (phonemes-index.json) gerados com sucesso!');
});
