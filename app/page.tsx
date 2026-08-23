"use client";

import { useEffect, useMemo, useState } from "react";

type Work = { id: string; title: string; type: string; tools: string[]; status: string };
const SEED: Work[] = [
  { id: "1", title: "Brand Identity", type: "Branding", tools: ["Figma", "Illustrator"], status: "Approved" },
  { id: "2", title: "UI Design", type: "UI/UX", tools: ["Figma", "Sketch"], status: "In review" },
];
function useLocalStorage<T>(key: string, initial: T) { const [value, setValue] = useState(initial); const [ready, setReady] = useState(false); useEffect(() => { try { const raw = localStorage.getItem(key); if (raw) setValue(JSON.parse(raw)); } catch { /* keep seed */ } setReady(true); }, [key]); useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]); return [value, setValue] as const; }

export default function Home() {
  const [works, setWorks] = useLocalStorage<Work[]>("design-v1", SEED);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState({ title: "", type: "UI/UX", tools: "", status: "Draft" });
  const filtered = useMemo(() => works.filter((work) => `${work.title} ${work.type} ${work.tools.join(" ")} ${work.status}`.toLowerCase().includes(query.toLowerCase())), [works, query]);
  const addWork = () => { if (!draft.title.trim()) return; setWorks((current) => [{ id: crypto.randomUUID(), title: draft.title, type: draft.type, tools: draft.tools.split(",").map((tool) => tool.trim()).filter(Boolean), status: draft.status }, ...current]); setDraft({ title: "", type: "UI/UX", tools: "", status: "Draft" }); };
  const approved = works.filter((work) => work.status === "Approved").length;

  return (
    <main className="atlas-shell">
      <header className="atlas-header"><div className="atlas-legend"><span className="legend-dot dot-amber" /><span className="legend-dot dot-cyan" /><span className="legend-dot dot-red" /><small>FIELD<br />NOTES</small></div><div><p className="atlas-kicker">DESIGN SPECS / STAR ATLAS</p><h1>Read the<br /><em>work in constellations.</em></h1><p className="atlas-deck">A small index of visual work, its medium, and the tools that hold it together. Search the field or add another point of reference.</p></div><div className="atlas-coordinates"><span>RA 05h 34m</span><strong>02</strong><span>DEC −05° 27′</span></div></header>

      <section className="atlas-sky" aria-labelledby="sky-title"><div className="sky-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="sky-copy"><p className="atlas-kicker">OBSERVATION FIELD</p><h2 id="sky-title">{filtered.length} points in view</h2><p>Each project is a star: the title is the signal, the type is its region, and the tools are the nearby bodies.</p></div><div className="constellation" aria-hidden="true"><span className="star star-1" /><span className="star star-2" /><span className="star star-3" /><span className="star star-4" /><span className="line line-1" /><span className="line line-2" /><span className="line line-3" /></div><div className="atlas-count"><b>{approved}</b><span>approved<br />signals</span></div></section>

      <section className="atlas-instrument" aria-labelledby="instrument-title"><div className="instrument-label"><span className="crosshair" /><p className="atlas-kicker">LOG A NEW POINT</p><h2 id="instrument-title">Add to the atlas</h2><p>Keep the record specific enough to revisit.</p></div><div className="instrument-form"><label><span>Work title</span><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Editorial system" /></label><label><span>Region / type</span><select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}><option>Branding</option><option>UI/UX</option><option>Editorial</option><option>Art direction</option><option>Research</option></select></label><label><span>Tools, comma-separated</span><input value={draft.tools} onChange={(event) => setDraft({ ...draft, tools: event.target.value })} placeholder="Figma, Illustrator" /></label><button onClick={addWork}>Plot point <b>↗</b></button></div></section>

      <section className="atlas-library" aria-labelledby="library-title"><div className="library-top"><div><p className="atlas-kicker">THE CATALOGUE</p><h2 id="library-title">Known work</h2></div><label className="atlas-search"><span>Search by name, region, tool</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="find a signal" /></label></div>{filtered.length === 0 ? <p className="atlas-empty">No points match this search. Try another coordinate or plot a new point.</p> : <ol className="work-list">{filtered.map((work, index) => <li key={work.id} className="work-row"><span className="work-number">{String(index + 1).padStart(2, "0")}</span><div className="work-title"><h3>{work.title}</h3><span>{work.type}</span></div><div className="tool-orbit">{work.tools.map((tool) => <code key={tool}>{tool}</code>)}</div><span className={`work-status status-${work.status.toLowerCase().replaceAll(" ", "-")}`}>{work.status}</span><button className="erase-work" onClick={() => setWorks((current) => current.filter((item) => item.id !== work.id))} aria-label={`Remove ${work.title}`}>×</button></li>)}</ol>}</section>
      <footer className="atlas-footer"><span>DESIGN SPECS / 2026</span><span>Local catalogue · data stays in this browser</span></footer>
    </main>
  );
}
