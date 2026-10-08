# Kinvo Admin Panel

React + Vite + TypeScript admin panel for the Kinvo REST API. Every screen reads and writes live data; there are no mocks.

- Production: https://kinvo-admin-panel-six.vercel.app
- API docs: https://dm9o5kgscmnxv.cloudfront.net/api/v1/docs
- Integration status and open API issues: [docs/integration-report.md](docs/integration-report.md)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Production CORS refuses `localhost`, so `.env.example` points `VITE_API_BASE_URL` at `/api/v1` and Vite's dev server proxies it to the deployed API (`VITE_API_PROXY_TARGET`). To use a local backend instead, set `VITE_API_BASE_URL=http://localhost:3000/api/v1` and remove the proxy target.

Sign in with a staff account. Accounts are promoted to admin in the backend repo (`scripts/make-admin.ts`); there is no endpoint that creates one.

Anything prefixed `VITE_` ships to the browser. Never put a secret in one.

## Scripts

- `npm run dev` — dev server with the API proxy
- `npm run build` — type-check and production build into `dist`
- `npm run lint` — ESLint

## Where things live

- `src/api/client.ts` — the only code that calls `fetch`. Unwraps the `{ success, data, meta }` envelope, throws `ApiError` (`code`, `message`, `details`), sends the bearer token, and refreshes once on `AUTH_TOKEN_EXPIRED` behind a single in-flight promise (refresh tokens rotate; a replayed one revokes the session).
- `src/api/session.ts` — token storage (localStorage with "Remember me", otherwise sessionStorage).
- `src/store/auth.store.ts` — login, `/admin/me` on boot, sign-out, password reset.
- `src/features/auth/hooks/usePermissions.ts` — hides screens and disables actions from `/admin/me` permissions and read-only mode. Presentation only; the API enforces everything.
- `src/shared/hooks/useCursorPages.ts` — opaque-cursor pagination behind Previous / Next.
- `src/features/*/` — one folder per screen; data hooks use TanStack Query.

## Deploy

Vercel project `kinvo-admin-panel`, Git-linked: pushing `main` deploys production. `VITE_API_BASE_URL` is set in the Production environment. `vercel.json` rewrites deep links to `index.html`. Preview deployments fail CORS by design (the API allows only the production origin).
