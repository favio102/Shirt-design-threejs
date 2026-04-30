# server/

This is the **standalone Express version** of the image-generation API.

## Why this folder still exists

Production uses a **Vercel Function** at [`client/api/image.js`](../client/api/image.js)
deployed alongside the frontend. That's the path of least friction (zero
extra accounts, no CORS, no cold-start sleep on the Hobby plan).

This Express server is kept as a **fallback** for hosts that don't run
serverless functions — Render, Fly.io, Railway, a self-hosted VM, etc. If
you ever outgrow Vercel's limits or want to move the API somewhere with
a long-running process, this version is ready to deploy as-is.

## Two implementations of the same proxy

Both endpoints take `{ prompt: string }`, fetch from pollinations.ai, and
return `{ photo: <base64> }`. **Keep them in sync** if you change the
request/response shape.

| | Vercel Function | Express server |
|---|---|---|
| File | `client/api/image.js` | `server/routes/image.routes.js` |
| Path | `/api/image` | `/api/v1/image` |
| Rate limit | none (add Upstash if needed) | `express-rate-limit` (in-process) |
| CORS | not needed (same origin) | configured via `CORS_ORIGIN` env |
| Logs | Vercel dashboard | `pino` + `pino-http` |

## Why a proxy at all

pollinations.ai is keyless and free, but it rejects browser-origin requests
with a Cloudflare Turnstile challenge. Server-side calls (no `Origin`
header from a browser) pass through. Either implementation acts as that
server-side hop.

## Running locally

```bash
cd server
npm install        # first time only
npm run dev        # nodemon, auto-reloads on file changes
```

Listens on `http://localhost:8080`. CORS is permissive for any
`http://localhost:*` and `http://127.0.0.1:*` in dev mode.

To point the client at this server instead of the Vercel Function:

```bash
# client/.env.local
VITE_BACKEND_URL=http://localhost:8080/api/v1/image
```

Restart the Vite dev server after creating that file.

## Deploying as a standalone service

The server is a plain Node + Express app with no build step. Any host
that runs `npm install && npm start` will work.

### Required env vars

| Var | Required? | Purpose |
|---|---|---|
| `CORS_ORIGIN` | yes (production) | Comma-separated list of allowed frontend origins, e.g. `https://d3design.vercel.app`. Without this in production, all cross-origin requests are denied by design. |
| `TRUST_PROXY` | yes (behind a proxy) | Set to `1` on Render/Heroku/Fly/Cloudflare so the rate limiter sees the real client IP, not the proxy IP. |
| `NODE_ENV` | yes (production) | `production` engages the production CORS branch. |
| `PORT` | no | Defaults to `8080`. Most hosts inject this automatically. |
| `RATE_LIMIT_WINDOW_MS` | no | Defaults to `60000` (1 minute). |
| `RATE_LIMIT_MAX` | no | Defaults to `5` requests per window per IP. |

### Wiring the frontend to a standalone backend

On the Vercel project (or whatever hosts the client), set:

```
VITE_BACKEND_URL=https://your-api-host.example.com/api/v1/image
```

Then redeploy the client — Vite reads env vars at build time, so the
change only takes effect on the next build.

## Endpoints

- `GET  /` — hello (sanity check)
- `GET  /healthz` — `{ status: "ok", uptimeSec }`
- `GET  /api/v1/image` — hello
- `POST /api/v1/image` — `{ prompt }` → `{ photo: <base64> }`
