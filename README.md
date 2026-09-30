# Design Specs — star atlas

A browser-local catalogue of visual work: each work has a title, a region
(type), the tools used, and a review status (Draft / In review / Approved).

## Features
- Plot a new work (Enter submits), change status inline, remove, and search
  by title, type, tool, or status. Visitor edits stay in `localStorage`.
- The published seed catalogue lives in `data/works.json` and is validated by
  the unit tests; corrupt saved data is repaired instead of crashing.
- `/api/mcp` JSON-RPC tools: `get_all`, `get_by_id`, `search` over the
  published catalogue (browser-local additions are never sent to the server).

## Limitations
- Local only: no accounts, sync, or image uploads.

## Run
```bash
npm ci
npm run dev
```

## Checks (same as CI)
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Honesty
Portfolio demo. Not multi-tenant SaaS. Prefer local-only state over fake production claims.
