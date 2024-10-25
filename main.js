const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const activeWin = require('active-win');
const robot = require('robotjs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle window synchronization
let syncedWindows = [];
let isSync = false;

ipcMain.on('start-sync', async () => {
  isSync = true;
  while (isSync) {
    for (const window of syncedWindows) {
      try {
        // Get mouse position
        const mouse = robot.getMousePos();
        
        // Move mouse to each window
        robot.moveMouse(mouse.x, mouse.y);
        
        await new Promise(resolve => setTimeout(resolve, 16)); // ~60fps
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
  }
});

ipcMain.on('stop-sync', () => {
  isSync = false;
});

ipcMain.on('add-window', async () => {
  const activeWindow = await activeWin();
  if (activeWindow) {
    syncedWindows.push({
      id: activeWindow.id,
      title: activeWindow.title
    });
    mainWindow.webContents.send('update-windows', syncedWindows);
  }
});

ipcMain.on('remove-window', (event, windowId) => {
  syncedWindows = syncedWindows.filter(w => w.id !== windowId);
  mainWindow.webContents.send('update-windows', syncedWindows);
});