class WindowManager {
  constructor() {
    this.syncedWindows = [];
    this.isSync = false;
    this.keyStates = new Map();
  }

  async startSync(robot) {
    this.isSync = true;
    while (this.isSync) {
      for (const window of this.syncedWindows) {
        try {
          // Sync mouse position
          const mouse = robot.getMousePos();
          robot.moveMouse(mouse.x, mouse.y);

          // Process queued keyboard events
          this.processKeyboardEvents(robot);
          
          await new Promise(resolve => setTimeout(resolve, 16));
        } catch (error) {
          console.error('Sync error:', error);
        }
      }
    }
  }

  processKeyboardEvents(robot) {
    for (const [key, isPressed] of this.keyStates) {
      if (isPressed) {
        robot.keyToggle(key, 'down');
      } else {
        robot.keyToggle(key, 'up');
        this.keyStates.delete(key);
      }
    }
  }

  handleKeyEvent(key, isPressed) {
    if (this.isSync) {
      this.keyStates.set(key, isPressed);
    }
  }

  stopSync() {
    this.isSync = false;
    this.keyStates.clear();
  }

  addWindow(window) {
    this.syncedWindows.push({
      id: window.id,
      title: window.title
    });
  }

  removeWindow(windowId) {
    this.syncedWindows = this.syncedWindows.filter(w => w.id !== windowId);
  }

  getWindows() {
    return this.syncedWindows;
  }
}

module.exports = { WindowManager };