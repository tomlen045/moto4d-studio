const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
let assetServer;

function serveBuiltApp() {
  const base = path.resolve(__dirname, '..', 'dist');
  assetServer = http.createServer((req, res) => {
    const requested = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    const candidate = path.resolve(base, `.${requested === '/' ? '/index.html' : requested}`);
    if (!candidate.startsWith(base + path.sep) && candidate !== path.join(base, 'index.html')) {
      res.writeHead(403).end('Forbidden'); return;
    }
    fs.readFile(candidate, (error, body) => {
      if (error) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(candidate)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(body);
    });
  });
  return new Promise(resolve => assetServer.listen(0, '127.0.0.1', () => resolve(assetServer.address().port)));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#12171b',
    title: 'Moto4D Studio',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  if (!app.isPackaged) win.loadURL('http://127.0.0.1:5174');
  else serveBuiltApp().then(port => win.loadURL(`http://127.0.0.1:${port}`));
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (assetServer) assetServer.close(); if (process.platform !== 'darwin') app.quit(); });
