const { app, BrowserWindow, dialog } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const distEntry = path.join(projectRoot, "dist", "index.html");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1120,
    minHeight: 760,
    backgroundColor: "#040914",
    title: "Excel Mastery",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      devTools: true,
    },
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  if (!fs.existsSync(distEntry)) {
    dialog.showErrorBox(
      "Excel Mastery Build Missing",
      "The desktop app could not find dist/index.html. Run a build first or use Open Excel Mastery Desktop.vbs.",
    );
    app.quit();
    return;
  }

  mainWindow.loadFile(distEntry);
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
