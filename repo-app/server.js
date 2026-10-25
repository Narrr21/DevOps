const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { EventEmitter } = require("node:events");

const port = Number(process.env.PORT) || 3000;
const counterEvents = new EventEmitter();
let counter = 0;

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function incrementCounter(source) {
  counter += 1;
  counterEvents.emit("counterChanged", { counter, source });
  console.log(`Counter incremented by ${source}: ${counter}`);
}

const server = http.createServer(async (request, response) => {
  if (request.url === "/health" || request.url === "/ready") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.url === "/api/counter" && request.method === "GET") {
    sendJson(response, 200, { counter });
    return;
  }

  if (request.url === "/api/counter/increment" && request.method === "POST") {
    try {
      const body = await readBody(request);
      const command = body ? JSON.parse(body) : {};
      incrementCounter(command.source || "client");
      sendJson(response, 202, { accepted: true });
    } catch {
      sendJson(response, 400, { error: "Request body must be valid JSON" });
    }
    return;
  }

  if (request.url === "/api/events" && request.method === "GET") {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });
    response.write(`data: ${JSON.stringify({ counter })}\n\n`);

    const onCounterChanged = (event) => {
      response.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    counterEvents.on("counterChanged", onCounterChanged);
    request.on("close", () => counterEvents.off("counterChanged", onCounterChanged));
    return;
  }

  if (request.url === "/" && request.method === "GET") {
    const client = fs.readFileSync(path.join(__dirname, "client", "index.html"));
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(client);
    return;
  }

  if (request.url === "/client.js" && request.method === "GET") {
    const clientScript = fs.readFileSync(path.join(__dirname, "client", "client.js"));
    response.writeHead(200, { "Content-Type": "application/javascript" });
    response.end(clientScript);
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Counter API listening on port ${port}`);
});
