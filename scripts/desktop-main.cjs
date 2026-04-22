const { app, BrowserWindow, dialog } = require("electron");
const { createReadStream } = require("node:fs");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const distEntry = path.join(projectRoot, "dist", "index.html");
const distRoot = path.join(projectRoot, "dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

let previewServer = null;

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function resolveAssetPath(requestUrl) {
  const rawPath = requestUrl === "/" ? "/index.html" : requestUrl;
  const cleanPath = rawPath.split("?")[0];
  const relativePath = path.normalize(cleanPath).replace(/^([/\\])+/, "");
  let candidate = path.join(distRoot, relativePath);

  if (!candidate.startsWith(distRoot)) {
    return null;
  }

  if (!fs.existsSync(candidate)) {
    candidate = distEntry;
  } else {
    const stats = fs.statSync(candidate);
    if (stats.isDirectory()) {
      candidate = path.join(candidate, "index.html");
    }
  }

  return candidate;
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      try {
        const filePath = resolveAssetPath(request.url ?? "/");

        if (!filePath || !fs.existsSync(filePath)) {
          response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Not found");
          return;
        }

        response.writeHead(200, {
          "Content-Type": getContentType(filePath),
          "Cache-Control": "no-store",
        });
        createReadStream(filePath).pipe(response);
      } catch (error) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end(`Server error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function createMainWindow(previewUrl) {
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
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    dialog.showErrorBox(
      "Excel Mastery Failed To Load",
      `The desktop shell could not load the app.\n\nCode: ${errorCode}\nReason: ${errorDescription}`,
    );
  });

  if (!fs.existsSync(distEntry)) {
    dialog.showErrorBox(
      "Excel Mastery Build Missing",
      "The desktop app could not find dist/index.html. Run a build first or use Open Excel Mastery Desktop.vbs.",
    );
    app.quit();
    return;
  }

  mainWindow.loadURL(previewUrl);
}

app.whenReady().then(async () => {
  previewServer = await startPreviewServer();
  const address = previewServer.address();
  const previewUrl = `http://127.0.0.1:${address.port}/?app=excel-mastery-desktop`;
  createMainWindow(previewUrl);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(previewUrl);
    }
  });
});

app.on("window-all-closed", () => {
  if (previewServer) {
    previewServer.close();
    previewServer = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
