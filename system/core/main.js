/**
 * 0RB SYSTEM - MAIN ENTRY POINT
 * The consciousness console initializer
 */

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const { ORBBootloader } = require('../../boot/init.js');
const { AgentManager } = require('../agents/AgentManager.js');
const { CopaSystem } = require('../copa/CopaCore.js');
const { CryptoEngine } = require('../crypto/CryptoEngine.js');
const { GameLauncher } = require('../games/GameLauncher.js');

class ORBSystem {
  constructor() {
    this.mainWindow = null;
    this.bootloader = new ORBBootloader();
    this.agentManager = null;
    this.copaSystem = null;
    this.cryptoEngine = null;
    this.gameLauncher = null;
    this.systemStatus = null;
  }

  async initialize() {
    console.log('\n[0RB SYSTEM] Initializing...\n');

    // Boot the system
    const bootSuccess = await this.bootloader.initialize();
    if (!bootSuccess) {
      throw new Error('Boot sequence failed');
    }

    this.systemStatus = this.bootloader.getSystemStatus();

    // Initialize subsystems
    this.agentManager = new AgentManager(this.systemStatus.agents);
    this.copaSystem = new CopaSystem(this.systemStatus.copa);
    this.cryptoEngine = new CryptoEngine(this.systemStatus.crypto);
    this.gameLauncher = new GameLauncher(this.systemStatus.games);

    return true;
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      minWidth: 1280,
      minHeight: 720,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      icon: path.join(__dirname, '../../assets/visuals/orb-icon.png'),
      title: '0RB SYSTEM'
    });

    // Load the main interface
    this.mainWindow.loadFile(path.join(__dirname, '../../web/public/index.html'));

    // Remove menu bar
    Menu.setApplicationMenu(null);

    // Handle window events
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
      this.mainWindow.webContents.openDevTools();
    }
  }

  setupIPC() {
    // System status
    ipcMain.handle('system:status', () => this.systemStatus);

    // Agent operations
    ipcMain.handle('agent:list', () => this.agentManager.listAgents());
    ipcMain.handle('agent:spawn', (event, agentType) => this.agentManager.spawnAgent(agentType));
    ipcMain.handle('agent:task', (event, { agentId, task }) => this.agentManager.assignTask(agentId, task));

    // Copa operations
    ipcMain.handle('copa:init', (event, config) => this.copaSystem.initializeCopa(config));
    ipcMain.handle('copa:assist', (event, { copaId, request }) => this.copaSystem.requestAssistance(copaId, request));
    ipcMain.handle('copa:verticals', () => this.copaSystem.getVerticals());

    // Crypto operations
    ipcMain.handle('crypto:connect', (event, config) => this.cryptoEngine.connectWallet(config));
    ipcMain.handle('crypto:balance', () => this.cryptoEngine.getBalance());
    ipcMain.handle('crypto:rent', (event, { agentId, duration }) => this.cryptoEngine.rentAgent(agentId, duration));
    ipcMain.handle('crypto:list', (event, { agentId, price }) => this.cryptoEngine.listForRental(agentId, price));

    // Game operations
    ipcMain.handle('game:list', () => this.gameLauncher.listGames());
    ipcMain.handle('game:launch', (event, gameId) => this.gameLauncher.launchGame(gameId));
    ipcMain.handle('game:save', (event, { gameId, data }) => this.gameLauncher.saveProgress(gameId, data));

    // Window controls
    ipcMain.on('window:minimize', () => this.mainWindow?.minimize());
    ipcMain.on('window:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });
    ipcMain.on('window:close', () => this.mainWindow?.close());
  }
}

// ═══════════════════════════════════════════════════════════════
// APPLICATION LIFECYCLE
// ═══════════════════════════════════════════════════════════════

const orbSystem = new ORBSystem();

app.whenReady().then(async () => {
  try {
    await orbSystem.initialize();
    orbSystem.createWindow();
    orbSystem.setupIPC();

    console.log('\n[0RB SYSTEM] Ready\n');
  } catch (error) {
    console.error('[0RB SYSTEM] Fatal error:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    orbSystem.createWindow();
  }
});

module.exports = { ORBSystem };
