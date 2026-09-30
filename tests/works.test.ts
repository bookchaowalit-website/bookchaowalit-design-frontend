import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { countByStatus, createWork, exportWorks, filterWorks, importWorks, normalizeWorks, parseStoredWorks, parseTools, setWorkStatus, statusClass } from "../lib/works.ts";

describe("design works model", () => {
  it("parses a comma list of unique tools", () => {
    assert.deepEqual(parseTools(" Figma, figma ,Sketch,, Illustrator "), ["Figma", "Sketch", "Illustrator"]);
  });

  it("normalises seed and saved data, dropping invalid entries", () => {
    const works = normalizeWorks([
      { id: "a", title: "Brand", type: "Branding", tools: ["Figma", 3, "Figma"], status: "Approved" },
      { id: "a", title: "Dup" },
      { id: "b", title: "  ", tools: [] },
      { id: "c", title: "Old", status: "Shipped" },
    ]);
    assert.deepEqual(works.map((w) => w.id), ["a", "c"]);
    assert.deepEqual(works[0].tools, ["Figma"]);
    assert.equal(works[1].status, "Draft");
    assert.equal(parseStoredWorks("not json"), null);
    assert.equal(parseStoredWorks('{"a":1}'), null);
    assert.deepEqual(parseStoredWorks("[]"), []);
  });

  it("creates works with validation", () => {
    const result = createWork({ title: " Poster ", type: "Editorial", tools: "InDesign", status: "In review" }, "x1");
    assert.deepEqual(result, { work: { id: "x1", title: "Poster", type: "Editorial", tools: ["InDesign"], status: "In review" } });
    assert.ok("error" in createWork({ title: "", type: "Editorial", tools: "", status: "Draft" }, "x2"));
  });

  it("filters, updates status, and counts", () => {
    const works = normalizeWorks([
      { id: "a", title: "Brand", type: "Branding", tools: ["Figma"], status: "Approved" },
      { id: "b", title: "App", type: "UI/UX", tools: ["Sketch"], status: "Draft" },
    ]);
    assert.deepEqual(filterWorks(works, "sketch").map((w) => w.id), ["b"]);
    const updated = setWorkStatus(works, "b", "Approved");
    assert.equal(countByStatus(updated, "Approved"), 2);
    assert.equal(countByStatus(works, "Approved"), 1);
    assert.equal(statusClass("In review"), "status-in-review");
  });

  it("ships a seed catalogue that is fully valid", () => {
    const seed = JSON.parse(readFileSync(new URL("../data/works.json", import.meta.url), "utf8")) as { works: unknown[] };
    assert.equal(normalizeWorks(seed.works).length, seed.works.length);
  });
});

describe("export / import", () => {
  const base = normalizeWorks([{ id: "w1", title: "Identity", type: "Branding", tools: ["Figma"], status: "Approved" }]);

  it("round-trips an export without duplicates", () => {
    const result = importWorks(base, exportWorks(base));
    assert.ok(!("error" in result));
    assert.deepEqual(result.works, base);
    assert.equal(result.added, 0);
    assert.equal(result.skipped, 1);
  });

  it("adds normalised new works and skips malformed ones", () => {
    const result = importWorks(base, JSON.stringify([{ id: "w2", title: "  Grid study ", tools: ["Figma", "figma", 3], status: "Bogus" }, { id: "", title: "x" }]));
    assert.ok(!("error" in result));
    assert.equal(result.added, 1);
    assert.equal(result.skipped, 1);
    assert.deepEqual(result.works[1], { id: "w2", title: "Grid study", type: "Research", tools: ["Figma"], status: "Draft" });
  });

  it("explains invalid files", () => {
    assert.deepEqual(importWorks(base, "not json"), { error: "That file is not valid JSON." });
    assert.ok("error" in importWorks(base, JSON.stringify({ channels: [] })));
  });
});

describe("edge cases", () => {
  it("imports a backup saved with a UTF-8 BOM", () => {
    const raw = `﻿${exportWorks([{ id: "w9", title: "Mark", type: "Branding", tools: [], status: "Draft" }])}`;
    const result = importWorks([], raw);
    assert.ok("works" in result, "BOM-prefixed export should import");
    assert.equal(result.added, 1);
    assert.equal(parseStoredWorks(`﻿[]`)?.length, 0);
  });

  it("treats zero-width, full-width and case variants of a tool as duplicates", () => {
    assert.deepEqual(parseTools("Figma, figma​, ＦＩＧＭＡ， Sketch、​"), ["Figma", "Sketch"]);
  });

  it("rejects invisible-only titles and never clips an emoji in half", () => {
    assert.deepEqual(createWork({ title: "​﻿", type: "Branding", tools: "", status: "Draft" }, "w1"), { error: "Give the work a title." });
    const [work] = normalizeWorks([{ id: "w1", title: `${"x".repeat(79)}😀` }]);
    assert.equal(work.title, "x".repeat(79));
  });
});
