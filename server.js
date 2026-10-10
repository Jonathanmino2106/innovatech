// Servidor HTTP estático local sin dependencias (Node.js >= 18)
// Uso: node server.js  →  http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const server = http.createServer((req, res) => {
  // Quitar query string y decodificar la URL
  const urlPath = decodeURIComponent(req.url.split("?")[0]);

  // Redirigir rutas sin extensión a .html (clean URLs estilo Vercel)
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath += ".html";
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // Bloquear accesos fuera del directorio raíz
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("403 Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 Not Found</h1>");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en  http://localhost:${PORT}`);
  console.log("Presiona Ctrl+C para detenerlo.");
});
