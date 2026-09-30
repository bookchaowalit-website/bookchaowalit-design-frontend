/** Design-work catalogue model (pure, unit-tested). */

export const TYPES = ["Branding", "UI/UX", "Editorial", "Art direction", "Research"] as const;
export const STATUSES = ["Draft", "In review", "Approved"] as const;
export type Status = (typeof STATUSES)[number];

export interface Work {
  id: string;
  title: string;
  type: string;
  tools: string[];
  status: Status;
}

export const STORAGE_KEY = "design-v1";
export const MAX_TITLE = 80;
export const MAX_TOOLS = 8;

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

/** Split a comma list into unique, trimmed tool names (case-insensitive). */
export function parseTools(raw: string): string[] {
  const seen = new Set<string>();
  const tools: string[] = [];
  for (const part of raw.split(",")) {
    const tool = part.trim().slice(0, 40);
    if (!tool || seen.has(tool.toLowerCase())) continue;
    seen.add(tool.toLowerCase());
    tools.push(tool);
  }
  return tools.slice(0, MAX_TOOLS);
}

function toWork(entry: unknown): Work | null {
  if (typeof entry !== "object" || entry === null) return null;
  const { id, title, type, tools, status } = entry as Record<string, unknown>;
  if (typeof id !== "string" || !id || typeof title !== "string" || !title.trim()) return null;
  return {
    id,
    title: title.trim().slice(0, MAX_TITLE),
    type: typeof type === "string" && type.trim() ? type.trim() : "Research",
    tools: Array.isArray(tools) ? parseTools(tools.filter((tool) => typeof tool === "string").join(",")) : [],
    status: isStatus(status) ? status : "Draft",
  };
}

/** Normalise any list of raw works (seed JSON or saved data), dropping bad or duplicate ids. */
export function normalizeWorks(raw: unknown): Work[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const works: Work[] = [];
  for (const entry of raw) {
    const work = toWork(entry);
    if (!work || seen.has(work.id)) continue;
    seen.add(work.id);
    works.push(work);
  }
  return works;
}

/** Parse saved JSON; null means "nothing usable saved, keep the seed". */
export function parseStoredWorks(raw: string | null): Work[] | null {
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? normalizeWorks(parsed) : null;
  } catch {
    return null;
  }
}

export type WorkDraft = { title: string; type: string; tools: string; status: Status };

export function createWork(draft: WorkDraft, id: string): { work: Work } | { error: string } {
  const title = draft.title.trim();
  if (!title) return { error: "Give the work a title." };
  if (title.length > MAX_TITLE) return { error: `Keep the title under ${MAX_TITLE} characters.` };
  return { work: { id, title, type: draft.type, tools: parseTools(draft.tools), status: draft.status } };
}

export function filterWorks(works: readonly Work[], query: string): Work[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...works];
  return works.filter((work) => `${work.title} ${work.type} ${work.tools.join(" ")} ${work.status}`.toLowerCase().includes(needle));
}

export function setWorkStatus(works: readonly Work[], id: string, status: Status): Work[] {
  return works.map((work) => (work.id === id ? { ...work, status } : work));
}

export function countByStatus(works: readonly Work[], status: Status): number {
  return works.filter((work) => work.status === status).length;
}

export function statusClass(status: string): string {
  return `status-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export const EXPORT_VERSION = 1;

/** Serialise the catalogue for a JSON backup file. */
export function exportWorks(works: readonly Work[]): string {
  return JSON.stringify({ app: "design", version: EXPORT_VERSION, works }, null, 2) + "\n";
}

export type ImportResult = { works: Work[]; added: number; skipped: number } | { error: string };

/**
 * Merge a JSON backup into the catalogue. Accepts the export envelope or a bare
 * array; entries are normalised like saved data and existing ids are kept.
 */
export function importWorks(current: readonly Work[], raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { error: "That file is not valid JSON." };
  }
  const list = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "object" && parsed !== null && Array.isArray((parsed as { works?: unknown }).works)
      ? (parsed as { works: unknown[] }).works
      : null;
  if (!list) return { error: "Expected a design catalogue export (an object with a works list)." };
  const known = new Set(current.map((work) => work.id));
  const fresh = normalizeWorks(list).filter((work) => !known.has(work.id));
  return { works: [...current, ...fresh], added: fresh.length, skipped: list.length - fresh.length };
}
