import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("dist");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain" };
createServer(async (request, response) => {
  try {
    let file = resolve(root, "." + decodeURIComponent(new URL(request.url, "http://localhost").pathname));
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    try { if ((await stat(file)).isDirectory()) file = resolve(file, "index.html"); } catch {}
    let bytes;
    try { bytes = await readFile(file); } catch { file = resolve(root, "404.html"); bytes = await readFile(file); response.statusCode = 404; }
    response.setHeader("Content-Type", types[extname(file)] || "application/octet-stream");
    response.end(bytes);
  } catch { response.writeHead(400).end("Bad request"); }
}).listen(4322, "127.0.0.1", () => console.log("Production build served at http://127.0.0.1:4322"));
