import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, 'run-server.js');

const isWin = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';

async function main() {
  let Service;

  // OSに応じて動的にインポートする
  if (isWin) {
    const { Service: WinService } = await import('node-windows');
    Service = WinService;
  } else if (isMac) {
    const { Service: MacService } = await import('node-mac');
    Service = MacService;
  } else {
    console.error('Unsupported platform:', os.platform());
    process.exit(1);
  }

  // サービスの設定
  const svc = new Service({
    name: 'VoiceDeck-OSS-Hub',
    description: 'Mutsuna Voice Deck Hub (OSS version)',
    script: scriptPath,
    env: [
      { name: 'NODE_ENV', value: 'production' }
    ]
  });

  const action = process.argv[2];

  svc.on('install', () => {
    console.log('Service installed successfully.');
    console.log('Starting service...');
    svc.start();
  });

  svc.on('alreadyinstalled', () => {
    console.log('Service is already installed.');
    console.log('Starting service...');
    svc.start();
  });

  svc.on('uninstall', () => {
    console.log('Service uninstalled successfully.');
  });

  svc.on('start', () => {
    console.log('VoiceDeck-OSS-Hub service started.');
  });

  svc.on('error', (err) => {
    console.error('Service Error:', err);
  });

  // 引数に基づいた実行
  if (action === 'install') {
    console.log('Installing VoiceDeck-OSS-Hub service...');
    svc.install();
  } else if (action === 'uninstall') {
    console.log('Uninstalling VoiceDeck-OSS-Hub service...');
    svc.uninstall();
  } else if (action === 'start') {
    svc.start();
  } else if (action === 'stop') {
    svc.stop();
  } else {
    console.log('Usage: node scripts/service-manage.js [install|uninstall|start|stop]');
  }
}

main().catch(err => {
  console.error('Manager Error:', err);
});
