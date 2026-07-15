import { cpSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const wwwDir = resolve(__dirname, 'www');
if (!existsSync(wwwDir)) mkdirSync(wwwDir);

const files = [
    'index.html',
    'error.html',
    'script.js',
    'style.css',
    'aac.css',
    'aac-data.js',
    'db-client.js',
    'avatar.png',
    'avatar3d.js',
    'bear_avatar.glb',
];

for (const file of files) {
    cpSync(resolve(__dirname, file), resolve(wwwDir, file));
    console.log(`  copied: ${file}`);
}

cpSync(resolve(__dirname, 'models', 'objects'), resolve(wwwDir, 'models', 'objects'), { recursive: true });
console.log('  copied: models/objects/');

for (const dir of ['aac-assets', 'map-assets']) {
    cpSync(resolve(__dirname, dir), resolve(wwwDir, dir), {
        recursive: true,
        filter: (src) => !src.endsWith('.png') && !src.endsWith('PROMPTS.md'),
    });
    console.log(`  copied: ${dir}/`);
}

console.log('\nBuild tamamlandi -> www/');
