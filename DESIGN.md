---
name: Design Specs Star Atlas
description: A celestial catalogue for visual work, regions, and tools.
colors:
  sky: "#0d1933"
  sky-line: "#30476f"
  paper: "#f3f0e6"
  muted: "#9eacc4"
  amber: "#f0bc67"
  cyan: "#83d4d0"
  red: "#ee796f"
typography:
  display:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(59px, 9vw, 125px)"
    fontWeight: 400
    lineHeight: 0.8
  body:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "16px"
    lineHeight: 1.55
  label:
    fontFamily: "ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.17em"
rounded:
  none: "0"
spacing:
  section: "38px 0"
  row: "20px 0"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.sky}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  tool-chip:
    backgroundColor: "transparent"
    textColor: "{colors.cyan}"
    rounded: "{rounded.none}"
    padding: "5px 7px"
---

# Design System: Design Specs Star Atlas

## Overview

**Creative North Star: "A celestial star atlas."**

Design work is indexed as an observation field. Projects become stars, types become regions, and tools orbit each record. The navy sky gives the catalogue room to breathe while the constellation lines create a navigable visual thesis without inventing a live data visualization.

**Key Characteristics:**
- Abyssal navy and paper-white type.
- Amber primary stars, cyan coordinates, red secondary signal.
- Thin chart lines, circles, and tabular labels.

## Colors

The sky is stable and dark; paper is the readable field. Amber marks primary observations, cyan labels coordinates and tools, and red is a rare secondary point.

### Primary
- **Atlas amber** (#f0bc67): headline emphasis, primary action, and approved count.

### Secondary
- **Coordinate cyan** (#83d4d0): labels, tool chips, and active signal.
- **Signal red** (#ee796f): secondary constellation point.

### Neutral
- **Abyssal sky** (#0d1933): page ground.
- **Chart line** (#30476f): grid, rules, and constellation geometry.
- **Paper** (#f3f0e6): primary type.
- **Quiet coordinate** (#9eacc4): secondary copy.

## Typography

**Display Font:** Georgia, Times New Roman, serif
**Body Font:** Georgia, Times New Roman, serif
**Label/Mono Font:** ui-monospace, monospace

**Character:** A literary serif chart title is paired with exact monospace coordinates and compact observatory labels.

### Hierarchy
- **Display** (400, clamp 59–125px, .8): atlas thesis.
- **Headline** (400, clamp 36–65px, .9): field and catalogue anchors.
- **Body** (400, 13–16px, 1.5): interpretation and operating context.
- **Label** (700, 10px, .17em, uppercase): coordinates and section metadata.

## Layout

The 1260px atlas shell begins with a legend, thesis, and coordinates. The observation field is a fixed-height chart band; the instrument below it uses a labeled rail and horizontal controls. Catalogue rows preserve a title/type column, tool orbit, and status, then stack under 760px.

## Elevation & Depth

No shadows. Depth comes from sky tonal contrast, large empty field, ringed chart geometry, and a small luminous dot treatment in the constellation.

## Shapes

Square controls and tool chips. Circles and rings belong to stars, chart orbits, and crosshairs only. Hairline rules keep the field technical.

## Components

### Buttons
- **Shape:** square (`0` radius).
- **Primary:** amber background with sky text.
- **Hover / Focus:** lighter amber on hover; amber focus outline.

### Chips
- **Style:** transparent outlined tool chips in cyan.
- **State:** chips identify tools; they are not filters or fake status controls.

### Inputs / Fields
- **Style:** transparent sky fields with chart-line baselines.
- **Focus:** baseline shifts to amber.

### Signature Component
- **Observation field:** chart arcs, grid lines, four colored stars, and route lines give the catalogue its first-view memory.

## Do's and Don'ts

### Do:
- **Do** keep the work title and tool orbit readable in the catalogue.
- **Do** use chart geometry as orientation, not decoration detached from the catalogue.
- **Do** let amber communicate primary observation/approval.

### Don't:
- **Don't** flatten the atlas into a generic admin table.
- **Don't** claim the constellation is a live spatial data model; it is a visual index around a local catalogue.
- **Don't** canonize the generic serif fallback or decorative star shape as the final asset/font system.
