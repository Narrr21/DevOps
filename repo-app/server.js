const http = require("node:http");

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (request.url === "/" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>DevOps Learning App</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 42rem; padding: 0 1rem; }
            code { background: #f1f1f1; border-radius: 4px; padding: 0.2rem 0.4rem; }
          </style>
        </head>
        <body>
          <h1>Hello from Docker!</h1>
          <p>This small app is running inside a container.</p>
          <p>Check <a href="/health"><code>/health</code></a> for its health status.</p>
        </body>
      </html>
    `);
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`DevOps learning app listening on port ${port}`);
});
