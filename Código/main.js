const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let serverProcess;
let win;
let retryCount = 0;
let serverStarted = false;

const isDev = !app.isPackaged;

function createWindow() {
  const iconPath = isDev
    ? path.join(__dirname, 'public', 'img', 'logo.ico')
    : path.join(process.resourcesPath, 'app', 'logo.ico');

  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: iconPath,
    autoHideMenuBar: true,
  });

  win.loadURL('http://localhost:3000/formulario-autenticacao/');

  if (isDev) win.webContents.openDevTools();

  win.on('closed', () => {
    if (serverProcess) serverProcess.kill();
    app.quit();
  });

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && (input.key.toLowerCase() === '+' || input.key.toLowerCase() === '=')) {
      const currentZoom = win.webContents.getZoomFactor();
      win.webContents.setZoomFactor(currentZoom + 0.1);
      event.preventDefault();
    } else if (input.control && input.key.toLowerCase() === '-') {
      const currentZoom = win.webContents.getZoomFactor();
      win.webContents.setZoomFactor(Math.max(currentZoom - 0.1, 0.5));
      event.preventDefault();
    } else if (input.control && input.key.toLowerCase() === '0') {
      win.webContents.setZoomFactor(1);
      event.preventDefault();
    }
  });

  win.webContents.on('zoom-changed', (event, zoomDirection) => {
    let currentZoom = win.webContents.getZoomFactor();
    if (zoomDirection === 'in') currentZoom += 0.1;
    else if (zoomDirection === 'out') currentZoom -= 0.1;
    win.webContents.setZoomFactor(currentZoom);
  });
}

function waitForServer(url, callback) {
  const tryConnect = () => {
    if (retryCount > 50) {
      console.error('Servidor não respondeu.');
      if (serverProcess) serverProcess.kill();
      app.quit();
      return;
    }

    http
      .get(url, () => {
        serverStarted = true;
        callback();
      })
      .on('error', () => {
        retryCount++;
        setTimeout(tryConnect, 500);
      });
  };
  tryConnect();
}

app.whenReady().then(() => {
  const serverScript = path.join(__dirname, 'index.js');

  if (isDev) {
    // CORREÇÃO: usa process.execPath (funciona com espaços no caminho)
    serverProcess = spawn(process.execPath, [serverScript], { cwd: __dirname });

    serverProcess.stdout.on('data', (data) => console.log(`SERVER: ${data}`));
    serverProcess.stderr.on('data', (data) => console.error(`SERVER ERROR: ${data}`));
    serverProcess.on('exit', (code) => {
      if (!serverStarted) console.error(`Servidor saiu com código ${code}`);
    });

    waitForServer('http://localhost:3000/formulario-autenticacao/', createWindow);
  } else {
    require(serverScript);
    waitForServer('http://localhost:3000/formulario-autenticacao/', createWindow);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});
