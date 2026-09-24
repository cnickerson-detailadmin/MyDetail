import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const HOST = "127.0.0.1";
const PORT = Number(process.env.MYSERVICE_BRIDGE_PORT || 4317);
const TOKEN = process.env.MYSERVICE_BRIDGE_TOKEN || "";
const WORKSPACE = path.resolve(process.env.MYSERVICE_WORKSPACE || process.cwd());

// Intentionally small. Expand only with explicit developer approval.
const ALLOWED_ACTIONS = new Set(["health", "list_files", "read_text"]);
const BLOCKED_NAMES = /(^|\/)(\.env($|\.)|\.git|node_modules|.*(?:secret|credential|password|token|key).*)/i;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function safeEqual(a, b) {
  if (!a || !b) return false;
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

function resolveAllowed(relative = ".") {
  const clean = String(relative).replaceAll("\\", "/");
  if (BLOCKED_NAMES.test(clean)) throw new Error("Blocked path");
  const resolved = path.resolve(WORKSPACE, clean);
  const prefix = WORKSPACE.endsWith(path.sep) ? WORKSPACE : WORKSPACE + path.sep;
  if (resolved !== WORKSPACE && !resolved.startsWith(prefix)) throw new Error("Outside workspace");
  return resolved;
}

async function readBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 64_000) throw new Error("Request too large");
  }
  return raw ? JSON.parse(raw) : {};
}

async function execute(action, args = {}) {
  if (!ALLOWED_ACTIONS.has(action)) throw new Error("Action is not allowlisted");

  if (action === "health") {
    return { ok: true, bridge: "myservice-gemini-local", workspace: path.basename(WORKSPACE), actions: [...ALLOWED_ACTIONS] };
  }

  if (action === "list_files") {
    const dir = resolveAllowed(args.path || ".");
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.slice(0, 200).filter((entry) => !BLOCKED_NAMES.test(entry.name)).map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? "directory" : "file"
    }));
  }

  if (action === "read_text") {
    const file = resolveAllowed(args.path);
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new Error("Not a file");
    if (stat.size > 512_000) throw new Error("File too large");
    return { path: String(args.path), content: await fs.readFile(file, "utf8") };
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "POST" || req.url !== "/tool") return json(res, 404, { error: "Not found" });
    if (!TOKEN) return json(res, 503, { error: "Bridge token is not configured" });

    const supplied = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!safeEqual(supplied, TOKEN)) return json(res, 401, { error: "Unauthorized" });

    const body = await readBody(req);
    const action = String(body.action || "");
    const result = await execute(action, body.args || {});
    return json(res, 200, { ok: true, action, result });
  } catch (error) {
    console.error("bridge request failed", error instanceof Error ? error.message : error);
    return json(res, 400, { ok: false, error: error instanceof Error ? error.message : "Request failed" });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`MyService Gemini bridge listening on http://${HOST}:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}`);
  console.log(`Allowed actions: ${[...ALLOWED_ACTIONS].join(", ")}`);
});
