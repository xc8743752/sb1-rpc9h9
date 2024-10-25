const { ipcRenderer } = require('electron');

class SyncUI {
  constructor() {
    this.issyncing = false;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.getElementById('addWindow').addEventListener('click', () => {
      ipcRenderer.send('add-window');
    });

    document.getElementById('startSync').addEventListener('click', () => {
      this.issyncing = true;
      ipcRenderer.send('start-sync');
      this.updateStatus();
      this.setupKeyboardEvents();
    });

    document.getElementById('stopSync').addEventListener('click', () => {
      this.issyncing = false;
      ipcRenderer.send('stop-sync');
      this.updateStatus();
      this.removeKeyboardEvents();
    });

    ipcRenderer.on('update-windows', (event, windows) => {
      this.updateWindowList(windows);
    });
  }

  setupKeyboardEvents() {
    this.handleKeyDown = (event) => {
      ipcRenderer.send('key-event', { key: event.key.toLowerCase(), isPressed: true });
    };

    this.handleKeyUp = (event) => {
      ipcRenderer.send('key-event', { key: event.key.toLowerCase(), isPressed: false });
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  removeKeyboardEvents() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  updateStatus() {
    const status = document.getElementById('status');
    status.textContent = `Status: ${this.issyncing ? 'Active' : 'Inactive'}`;
    status.className = `status ${this.issyncing ? 'active' : 'inactive'}`;
  }

  updateWindowList(windows) {
    const windowsDiv = document.getElementById('windows');
    windowsDiv.innerHTML = windows.map(window => `
      <div class="window-item">
        <span>${window.title}</span>
        <button onclick="syncUI.removeWindow('${window.id}')">Remove</button>
      </div>
    `).join('');
  }

  removeWindow(windowId) {
    ipcRenderer.send('remove-window', windowId);
  }
}

const syncUI = new SyncUI();
window.syncUI = syncUI;