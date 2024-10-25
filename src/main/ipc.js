const { ipcMain } = require('electron');
const activeWin = require('active-win');
const robot = require('robotjs');
const { WindowManager } = require('./windowManager');

function setupIPC(mainWindow) {
  const windowManager = new WindowManager();

  ipcMain.on('start-sync', async () => {
    windowManager.startSync(robot);
  });

  ipcMain.on('stop-sync', () => {
    windowManager.stopSync();
  });

  ipcMain.on('key-event', (event, { key, isPressed }) => {
    windowManager.handleKeyEvent(key, isPressed);
  });

  ipcMain.on('add-window', async () => {
    const activeWindow = await activeWin();
    if (activeWindow) {
      windowManager.addWindow(activeWindow);
      mainWindow.webContents.send('update-windows', windowManager.getWindows());
    }
  });

  ipcMain.on('remove-window', (event, windowId) => {
    windowManager.removeWindow(windowId);
    mainWindow.webContents.send('update-windows', windowManager.getWindows());
  });
}

module.exports = { setupIPC };