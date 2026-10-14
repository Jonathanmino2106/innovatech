// Servidor HTTP estático local sin dependencias (Node.js >= 18)
// Uso: node server.js  →  http://localhost:3000
//
// IMPORTANTE: soporta Range requests (206 Partial Content). Sin eso,
// Safari/iOS NO reproduce video y Chrome tampoco puede hacer streaming.
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

  // Fallback de favicon: si piden /favicon.ico y no existe uno en la raíz,
  // servimos el logo corporativo en PNG (evita el 404 en la consola del navegador).
  if (urlPath === "/favicon.ico" && !fs.existsSync(filePath)) {
    filePath = path.join(ROOT, "assets", "innovatech.png");
  }

  // Bloquear accesos fuera del directorio raíz
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stat) => {
    if (statErr || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 Not Found</h1>");
      return;
    }

    const contentType = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";

    // Caché para estáticos: evita volver a bajar el video/imágenes en cada
    // recarga (el splash usa preload="auto", así que si no hay caché el
    // navegador pide el .mp4 aunque el splash ya no se vaya a mostrar).
    const isHtml = filePath.endsWith(".html");
    const cacheControl = isHtml
      ? "no-cache"
      : "public, max-age=3600";

    // ---- HEAD: sólo las cabeceras ----
    if (req.method === "HEAD") {
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        "Accept-Ranges": "bytes",
        "Content-Length": stat.size,
      });
      res.end();
      return;
    }

    // ---- Range request (obligatorio para video) ----
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      let start, end;

      if (!match) {
        // Sintaxis no soportada: respondemos 416 según la RFC
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        res.end();
        return;
      }

      if (match[1] === "") {
        // Sufijo: "bytes=-500" → los últimos 500 bytes
        const suffix = parseInt(match[2], 10);
        if (!suffix) {
          res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
          res.end();
          return;
        }
        start = Math.max(stat.size - suffix, 0);
        end = stat.size - 1;
      } else {
        start = parseInt(match[1], 10);
        end = match[2] === "" ? stat.size - 1 : parseInt(match[2], 10);
      }

      if (isNaN(start) || isNaN(end) || start > end || start >= stat.size) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        res.end();
        return;
      }
      end = Math.min(end, stat.size - 1);

      res.writeHead(206, {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": end - start + 1,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    // ---- Respuesta completa ----
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
      "Accept-Ranges": "bytes",
      "Content-Length": stat.size,
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en  http://localhost:${PORT}`);
  console.log("Presiona Ctrl+C para detenerlo.");
});
