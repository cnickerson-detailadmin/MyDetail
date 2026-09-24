# MyService Gemini Local Tool Bridge

This bridge gives Seth/Gemini a deliberately small local capability surface. It binds only to `127.0.0.1` and starts read-only.

## Current allowlist

- `health`
- `list_files`
- `read_text`

It does **not** currently allow command execution, file writes/deletes, browser control, deployment, secrets, credentials, or access outside the configured MyService workspace.

## Chromebook / Linux setup

Prerequisite: ChromeOS Linux development environment with Node.js 18+ installed.

From the MyDetail repository directory, generate a fresh local-only token and start the bridge:

```bash
export MYSERVICE_WORKSPACE="$PWD"
export MYSERVICE_BRIDGE_TOKEN="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
node tools/gemini-local-bridge/server.mjs
```

Do not commit or paste `MYSERVICE_BRIDGE_TOKEN` into source code, chat, screenshots, or logs.

The bridge should report that it is listening on `127.0.0.1:4317`.

## Local health test

Open a second Linux terminal in the same session where the token is available, or export the same token there through a secure local method, then run:

```bash
curl -s http://127.0.0.1:4317/tool \
  -H "Authorization: Bearer $MYSERVICE_BRIDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"health","args":{}}'
```

A successful response has `"ok":true` and lists only the current allowlisted actions.

## Security model

The bridge is the enforcement boundary. Model instructions are not treated as authorization. New actions must be explicitly implemented and allowlisted. Sensitive paths such as `.env`, `.git`, `node_modules`, and names containing secret/credential/password/token/key are blocked. Path traversal outside the configured workspace is rejected.

Remote Gemini API calls cannot directly reach a service bound to localhost. A later connection layer must authenticate requests without publicly exposing this bridge or embedding its token in frontend code.
