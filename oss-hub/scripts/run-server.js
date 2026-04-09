import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootPath = path.resolve(__dirname, '..');
const wranglerBin = path.join(rootPath, 'node_modules', 'wrangler', 'bin', 'wrangler.js');

console.log('Starting OSS Hub via Wrangler...');

// wrangler dev を起動
const child = spawn('node', [wranglerBin, 'dev'], {
  cwd: rootPath,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
