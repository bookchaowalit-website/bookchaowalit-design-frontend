"use client";

import { useEffect, useMemo, useState } from "react";
import { SEED_WORKS } from "@/lib/catalogue";
import { STATUSES, STORAGE_KEY, TYPES, countByStatus, createWork, exportWorks, filterWorks, importWorks, parseStoredWorks, setWorkStatus, statusClass } from "@/lib/works";
import type { Status, Work, WorkDraft } from "@/lib/works";

const EMPTY_DRAFT: WorkDraft = { title: "", type: "UI/UX", tools: "", status: "Draft" };

function useWorks() {
  const [works, setWorks] = useState<Work[]>(SEED_WORKS);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = parseStoredWorks(localStorage.getItem(STORAGE_KEY));
      // Hydrate browser-local entries after the server-rendered seed.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setWorks(saved);
    } catch { /* storage blocked: keep seed */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(works)); } catch { /* storage full or blocked */ }
  }, [works, ready]);
  return [works, setWorks] as const;
}

export default function Home() {
  const [works, setWorks] = useWorks();
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<WorkDraft>(EMPTY_DRAFT);
  const [formError, setFormError] = useState("");
  const filtered = useMemo(() => filterWorks(works, query), [works, query]);
  const addWork = () => {
    const result = createWork(draft, crypto.randomUUID());
    if ("error" in result) { setFormError(result.error); return; }
    setWorks((current) => [result.work, ...current]);
    setDraft(EMPTY_DRAFT);
    setFormError("");
  };
  const approved = countByStatus(works, "Approved");
  const [backupNotice, setBackupNotice] = useState("");
  const exportJson = () => {
    const href = URL.createObjectURL(new Blob([exportWorks(works)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "design-catalogue.json";
    anchor.click();
    URL.revokeObjectURL(href);
    setBackupNotice(`Exported ${works.length} ${works.length === 1 ? "work" : "works"}.`);
  };
  const importJson = async (file: File | undefined) => {
    if (!file) return;
    const result = importWorks(works, await file.text());
    if ("error" in result) { setBackupNotice(result.error); return; }
    setWorks(result.works);
    setBackupNotice(`Imported ${result.added} new ${result.added === 1 ? "work" : "works"}${result.skipped ? `, skipped ${result.skipped} (already here or invalid)` : ""}.`);
  };

  return (
    <main className="atlas-shell">
      <header className="atlas-header"><div className="atlas-legend"><span className="legend-dot dot-amber" /><span className="legend-dot dot-cyan" /><span className="legend-dot dot-red" /><small>FIELD<br />NOTES</small></div><div><p className="atlas-kicker">DESIGN SPECS / STAR ATLAS</p><h1>Read the<br /><em>work in constellations.</em></h1><p className="atlas-deck">A small index of visual work, its medium, and the tools that hold it together. Search the field or add another point of reference.</p></div><div className="atlas-coordinates"><span>RA 05h 34m</span><strong>{String(works.length).padStart(2, "0")}</strong><span className="sr-only"> works catalogued</span><span>DEC −05° 27′</span></div></header>

      <section className="atlas-sky" aria-labelledby="sky-title"><div className="sky-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="sky-copy"><p className="atlas-kicker">OBSERVATION FIELD</p><h2 id="sky-title" aria-live="polite">{filtered.length} {filtered.length === 1 ? "point" : "points"} in view</h2><p>Each project is a star: the title is the signal, the type is its region, and the tools are the nearby bodies.</p></div><div className="constellation" aria-hidden="true"><span className="star star-1" /><span className="star star-2" /><span className="star star-3" /><span className="star star-4" /><span className="line line-1" /><span className="line line-2" /><span className="line line-3" /></div><div className="atlas-count"><b>{approved}</b><span>approved<br />signals</span></div></section>

      <section className="atlas-instrument" aria-labelledby="instrument-title"><div className="instrument-label"><span className="crosshair" /><p className="atlas-kicker">LOG A NEW POINT</p><h2 id="instrument-title">Add to the atlas</h2><p>Keep the record specific enough to revisit.</p></div><form className="instrument-form" noValidate onSubmit={(event) => { event.preventDefault(); addWork(); }}><label><span>Work title</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Editorial system" required aria-invalid={formError ? true : undefined} aria-describedby={formError ? "work-form-error" : undefined} /></label><label><span>Region / type</span><select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>{TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><label><span>Tools, comma-separated</span><input value={draft.tools} onChange={(event) => setDraft({ ...draft, tools: event.target.value })} placeholder="Figma, Illustrator" /></label><label><span>Status</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Status })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><button type="submit">Plot point <b aria-hidden="true">↗</b></button>{formError ? <p id="work-form-error" className="instrument-error" role="alert">{formError}</p> : null}</form></section>

      <section className="atlas-library" aria-labelledby="library-title"><div className="library-top"><div><p className="atlas-kicker">THE CATALOGUE</p><h2 id="library-title">Known work</h2></div><label className="atlas-search"><span>Search by name, region, tool</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="find a signal" /></label></div><div className="atlas-backup"><button type="button" onClick={exportJson}>Export JSON</button><label><span>Import JSON</span><input type="file" accept="application/json,.json" onChange={(event) => { void importJson(event.target.files?.[0]); event.target.value = ""; }} /></label><p role="status">{backupNotice}</p></div>{filtered.length === 0 ? <p className="atlas-empty">No points match this search. Try another coordinate or plot a new point.</p> : <ol className="work-list">{filtered.map((work, index) => <li key={work.id} className="work-row"><span className="work-number">{String(index + 1).padStart(2, "0")}</span><div className="work-title"><h3>{work.title}</h3><span>{work.type}</span></div><div className="tool-orbit">{work.tools.map((tool) => <code key={tool}>{tool}</code>)}</div><label className={`work-status ${statusClass(work.status)}`}><span className="sr-only">Status for {work.title}</span><select value={work.status} onChange={(event) => setWorks((current) => setWorkStatus(current, work.id, event.target.value as Status))}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label><button type="button" className="erase-work" onClick={() => setWorks((current) => current.filter((item) => item.id !== work.id))} aria-label={`Remove ${work.title}`}>×</button></li>)}</ol>}</section>
      <footer className="atlas-footer"><span>DESIGN SPECS / 2026</span><span>Local catalogue · data stays in this browser</span></footer>
    </main>
  );
}
