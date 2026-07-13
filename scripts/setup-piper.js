import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const binDir = path.join(rootDir, 'bin');
const piperDir = path.join(binDir, 'piper');
const modelsDir = path.join(binDir, 'models');

const PIPER_VERSION = '2023.11.14-2';

const URLS = {
    windows: `https://github.com/rhasspy/piper/releases/download/${PIPER_VERSION}/piper_windows_amd64.zip`,
    linux: `https://github.com/rhasspy/piper/releases/download/${PIPER_VERSION}/piper_linux_x86_64.tar.gz`
};

async function downloadFile(url, destPath, attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        console.log(`Downloading: ${url} -> ${destPath}${attempt > 1 ? ` (attempt ${attempt}/${attempts})` : ''}`);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for URL: ${url}`);
            const fileStream = fs.createWriteStream(destPath);
            await finished(Readable.fromWeb(res.body).pipe(fileStream));
            return;
        } catch (err) {
            if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
            if (attempt === attempts) throw err;
            console.warn(`Download failed (${err.message}), retrying in ${attempt * 5}s...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 5000));
        }
    }
}

function extractZipWindows(archivePath, destDir) {
    console.log(`Extracting ZIP on Windows: ${archivePath}`);
    const tempExtract = path.join(binDir, 'temp_extract');
    if (fs.existsSync(tempExtract)) {
        fs.rmSync(tempExtract, { recursive: true, force: true });
    }
    fs.mkdirSync(tempExtract, { recursive: true });

    // Use PowerShell to extract
    execSync(`powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${tempExtract}' -Force"`);

    // Move files from nested 'piper' directory if it exists
    const nestedPiper = path.join(tempExtract, 'piper');
    if (fs.existsSync(nestedPiper)) {
        if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true, force: true });
        }
        fs.renameSync(nestedPiper, destDir);
    } else {
        if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true, force: true });
        }
        fs.renameSync(tempExtract, destDir);
    }

    // Clean up
    if (fs.existsSync(tempExtract)) {
        fs.rmSync(tempExtract, { recursive: true, force: true });
    }
    fs.unlinkSync(archivePath);
}

function extractTarLinux(archivePath, destDir) {
    console.log(`Extracting TAR on Linux: ${archivePath}`);
    fs.mkdirSync(destDir, { recursive: true });
    // Use native tar command
    execSync(`tar -xzf "${archivePath}" -C "${binDir}"`);
    fs.unlinkSync(archivePath);
}

async function setup() {
    try {
        if (!fs.existsSync(binDir)) fs.mkdirSync(binDir, { recursive: true });
        if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

        // Load config
        const configPath = path.join(rootDir, 'piper-config.json');
        if (!fs.existsSync(configPath)) {
            throw new Error('piper-config.json missing in root directory!');
        }
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        const isWin = process.platform === 'win32';
        const piperExecName = isWin ? 'piper.exe' : 'piper';
        const piperExecPath = path.join(piperDir, piperExecName);

        // 1. Setup Piper Binary
        if (!fs.existsSync(piperExecPath)) {
            console.log('Piper binary not found. Downloading...');
            if (isWin) {
                const archivePath = path.join(binDir, 'piper.zip');
                await downloadFile(URLS.windows, archivePath);
                extractZipWindows(archivePath, piperDir);
            } else {
                const archivePath = path.join(binDir, 'piper.tar.gz');
                await downloadFile(URLS.linux, archivePath);
                extractTarLinux(archivePath, piperDir);
                // Make sure binary is executable on Linux
                try {
                    fs.chmodSync(piperExecPath, 0o755);
                    console.log('Chmod 755 applied to linux piper binary');
                } catch (err) {
                    console.warn('Could not set executable permissions via Node, attempting chmod command:', err.message);
                    execSync(`chmod +x "${piperExecPath}"`);
                }
            }
            console.log('Piper binary setup completed successfully.');
        } else {
            console.log('Piper binary already exists. Skipping download.');
        }

        // 2. Setup Voice Models from config
        const modelFiles = [
            { name: `${config.voices.tr.id}.onnx`, url: config.voices.tr.onnxUrl },
            { name: `${config.voices.tr.id}.onnx.json`, url: config.voices.tr.jsonUrl },
            { name: `${config.voices.en.id}.onnx`, url: config.voices.en.onnxUrl },
            { name: `${config.voices.en.id}.onnx.json`, url: config.voices.en.jsonUrl }
        ];

        // Clean up old model files that are no longer configured to save space
        const allowedFiles = new Set(modelFiles.map(f => f.name));
        const currentFiles = fs.readdirSync(modelsDir);
        for (const file of currentFiles) {
            if (!allowedFiles.has(file)) {
                console.log(`Cleaning up old model file: ${file}`);
                fs.unlinkSync(path.join(modelsDir, file));
            }
        }

        for (const file of modelFiles) {
            const destPath = path.join(modelsDir, file.name);
            if (!fs.existsSync(destPath)) {
                console.log(`${file.name} not found. Downloading...`);
                await downloadFile(file.url, destPath);
            } else {
                console.log(`${file.name} already exists. Skipping download.`);
            }
        }

        console.log('Piper TTS setup completed successfully!');
    } catch (error) {
        console.error('Error setting up Piper TTS:', error);
        process.exit(1);
    }
}

setup();
