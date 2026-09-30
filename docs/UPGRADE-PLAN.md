# Upgrade plan

## Current state: 7/10 (was 4/10)

Catalogue CRUD now works fully (status can be set and changed), data is
validated, MCP serves the real seed catalogue, and CI runs strict checks.

## Backlog

### P0
- (none open)

### P1
- Confirm canonical domain; set `NEXT_PUBLIC_SITE_URL`.
- Split the long single-line JSX in `app/page.tsx` into components.

### P2
- Optional thumbnail per work (URL, validated) with provenance note.
- Drop unused `lucide-react` and Geist font variables if not needed.

## Done in this pass
- `lib/works.ts` (unit-tested): tool parsing/dedupe, storage validation,
  create/filter/status helpers; seed moved to `data/works.json` (was an
  unused duplicate of the page seed).
- Status could never be set (every new work was Draft, approved count was
  frozen); now selectable on create and editable per row. Coordinates count
  reflects the catalogue instead of a hard-coded "02".
- Add form is a real `<form>` (Enter submits, errors announced).
- `next.config.ts`: removed `ignoreBuildErrors` and unsupported `eslint` key;
  fixed lint errors.
- Replaced the echoing stub `/api/mcp` with real catalogue tools.
- Metadata description matched to the product; canonical; robots/sitemap; CI.

## Done in this pass (pass 2)
- JSON backup: Export downloads the catalogue (`exportWorks`), Import merges a file (`importWorks`: export envelope or bare array, normalised like saved data, existing ids kept) with a visible `role="status"` result. Tested in `tests/works.test.ts`.
- Checked cross-repo consistency: sitemap/robots already generated from `lib/site.ts` + `NEXT_PUBLIC_SITE_URL`; no stale static files.

## Done in this pass (pass 3)
- Edge-case pass on `lib/works.ts` (regression tests in `tests/works.test.ts`):
  - JSON import and saved data failed on a leading UTF-8 BOM ("not valid JSON").
  - Tool de-duplication compared `toLowerCase()` only: `figma​` and
    full-width `ＦＩＧＭＡ` were kept as separate tools and a zero-width-only
    entry became a blank chip. Now invisible characters are stripped and keys
    compare after NFKC; full-width / ideographic commas also split the list.
  - Invisible-only titles were accepted; clipping could cut an emoji in half.
