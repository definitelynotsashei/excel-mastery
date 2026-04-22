import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const projectRoot = resolve(__dirname, "..");
const distRoot = join(projectRoot, "dist");
const host = "127.0.0.1";
const port = 4173;
const launchUrl = `http://${host}:${port}/`;

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

function openBrowser(url) {
  spawn("cmd.exe", ["/c", "start", "", url], {
    cwd: projectRoot,
    detached: true,
    stdio: "ignore",
  }).unref();
}

function getContentType(filePath) {
  return mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

async function resolveFilePath(requestUrl) {
  const rawPath = requestUrl === "/" ? "/index.html" : requestUrl;
  const cleanPath = rawPath.split("?")[0];
  const normalizedPath = normalize(cleanPath).replace(/^([/\\])+/, "");
  let candidate = join(distRoot, normalizedPath);

  if (!candidate.startsWith(distRoot)) {
    return null;
  }

  if (!existsSync(candidate)) {
    candidate = join(distRoot, "index.html");
  } else {
    const candidateStats = await stat(candidate);
    if (candidateStats.isDirectory()) {
      candidate = join(candidate, "index.html");
    }
  }

  return candidate;
}

if (!existsSync(distRoot)) {
  console.error("The dist folder does not exist. Run a build before launching the app.");
  process.exit(1);
}

const server = createServer(async (request, response) => {
  try {
    const filePath = await resolveFilePath(request.url ?? "/");

    if (!filePath || !existsSync(filePath)) {
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

server.on("error", (error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
    openBrowser(launchUrl);
    process.exit(0);
  }

  console.error(error);
  process.exit(1);
});

server.listen(port, host, () => {
  openBrowser(launchUrl);
});
