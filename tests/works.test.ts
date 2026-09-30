import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { countByStatus, createWork, filterWorks, normalizeWorks, parseStoredWorks, parseTools, setWorkStatus, statusClass } from "../lib/works.ts";

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
