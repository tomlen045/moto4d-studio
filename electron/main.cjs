const { app, BrowserWindow, Menu, protocol } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8'
};

protocol.registerSchemesAsPrivileged([{
  scheme: 'moto4d',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true }
}]);

function registerAppProtocol() {
  const base = path.resolve(__dirname, '..', 'dist');
  protocol.handle('moto4d', async request => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response('Bad request', { status: 400 });
    }
    const candidate = path.resolve(base, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!candidate.startsWith(base + path.sep) && candidate !== path.join(base, 'index.html')) {
      return new Response('Forbidden', { status: 403 });
    }
    try {
      const body = await fs.promises.readFile(candidate);
      return new Response(body, {
        headers: {
          'Content-Type': mime[path.extname(candidate)] || 'application/octet-stream',
          'Cache-Control': 'no-store'
        }
      });
    } catch (error) {
      console.error(`[Moto4D] Failed to load packaged resource: ${candidate}`, error);
      return new Response('Not found', { status: 404 });
    }
  });
}

function showStartupError(win, message) {
  const escaped = String(message).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const html = `<!doctype html><meta charset="utf-8"><title>Moto4D Studio 启动失败</title>
    <style>body{margin:0;background:#11161a;color:#e7edef;font:15px -apple-system,sans-serif;display:grid;place-items:center;height:100vh}
    main{max-width:620px;padding:32px;background:#171e23;border:1px solid #344149;border-radius:12px}h1{font-size:20px;color:#ffb388}
    code{display:block;margin-top:18px;padding:12px;background:#101518;color:#ffd1b5;overflow-wrap:anywhere}</style>
    <main><h1>Moto4D Studio 没有加载完成</h1><p>关闭此窗口后重新打开应用。如果问题仍然存在，请把下面的错误信息发给维护者。</p><code>${escaped}</code></main>`;
  win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`).catch(error => {
    console.error('[Moto4D] Could not show startup error page', error);
  });
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
  else {
    win.webContents.on('did-fail-load', (_event, errorCode, description, url, isMainFrame) => {
      if (isMainFrame && errorCode !== -3) {
        console.error(`[Moto4D] App page failed to load (${errorCode}) at ${url}: ${description}`);
        showStartupError(win, `${errorCode}: ${description} (${url})`);
      }
    });
    win.loadURL('moto4d://bundle/index.html').catch(error => {
      console.error('[Moto4D] App page failed to load', error);
      showStartupError(win, error.message || error);
    });
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  if (app.isPackaged) registerAppProtocol();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
