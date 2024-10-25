const { app } = require('electron');
const { createWindow } = require('./window');
const { setupIPC } = require('./ipc');

let mainWindow;

app.whenReady().then(() => {
  mainWindow = createWindow();
  setupIPC(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
    setupIPC(mainWindow);
  }
});