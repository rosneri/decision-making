// One-shot: split src/frameworks/help.ts into per-framework help.ts files,
// then rewrite the central file as a thin aggregator.
//
// Run: node scripts/split-help.mjs
//
// Idempotent: re-running with the central file already aggregated is a no-op.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const HELP_FILE = path.join(ROOT, "src/frameworks/help.ts");
const FRAMEWORKS_DIR = path.join(ROOT, "src/frameworks");

const src = fs.readFileSync(HELP_FILE, "utf8");

// Pull out the FrameworkHelp interface block so we can re-export it.
const ifaceMatch = src.match(/export interface FrameworkHelp \{[\s\S]*?\n\}/);
if (!ifaceMatch) {
  console.error("FrameworkHelp interface not found — has the file already been split?");
  process.exit(0);
}
const ifaceBlock = ifaceMatch[0];

// Locate the start of the HELP record body.
const recordStart = src.indexOf("export const HELP");
if (recordStart === -1) {
  console.error("HELP record not found; nothing to split.");
  process.exit(0);
}

// Walk the record body and slice out each top-level `"id": { ... },` entry by
// counting braces. We start just after the opening `{` of HELP.
const bodyStart = src.indexOf("{", recordStart) + 1;
const bodyEnd = src.lastIndexOf("};");
const body = src.slice(bodyStart, bodyEnd);

const entries = [];
let i = 0;
while (i < body.length) {
  // Skip whitespace and commas between entries.
  while (i < body.length && /[\s,]/.test(body[i])) i++;
  if (i >= body.length) break;

  // Read the key: either "quoted" or bare-identifier, ending at ':'.
  const keyStart = i;
  if (body[i] === '"') {
    i++;
    while (i < body.length && body[i] !== '"') i++;
    i++; // closing quote
  } else {
    while (i < body.length && body[i] !== ":" && !/\s/.test(body[i])) i++;
  }
  const rawKey = body.slice(keyStart, i).trim();
  const key = rawKey.replace(/^"|"$/g, "");

  // Advance to the opening '{' of the value.
  while (i < body.length && body[i] !== "{") i++;
  if (i >= body.length) break;

  // Match braces until the value object closes.
  let depth = 0;
  const valStart = i;
  for (; i < body.length; i++) {
    const c = body[i];
    if (c === '"') {
      // Skip string literal (no escape handling needed for our content).
      i++;
      while (i < body.length && body[i] !== '"') {
        if (body[i] === "\\") i++;
        i++;
      }
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  const valBlock = body.slice(valStart, i);
  entries.push({ key, valBlock });
}

console.log(`Parsed ${entries.length} help entries.`);

// Write per-folder help.ts files.
const written = [];
const skipped = [];
for (const { key, valBlock } of entries) {
  const folder = path.join(FRAMEWORKS_DIR, key);
  if (!fs.existsSync(folder)) {
    skipped.push(key);
    continue;
  }
  const out = `import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = ${valBlock};
`;
  fs.writeFileSync(path.join(folder, "help.ts"), out);
  written.push(key);
}

console.log(`Wrote help.ts for ${written.length} framework folders.`);
if (skipped.length) {
  console.warn(`Skipped (folder missing): ${skipped.join(", ")}`);
}

// Extract the FrameworkHelp interface to its own module so the per-folder
// help.ts files can import it without pulling in the aggregator.
const helpTypesPath = path.join(FRAMEWORKS_DIR, "help-types.ts");
fs.writeFileSync(
  helpTypesPath,
  `// Type for per-framework plain-English usage guides. Lives in its own
// module so each framework folder can import the type without depending on
// the aggregator.

${ifaceBlock}
`,
);
console.log(`Wrote ${path.relative(ROOT, helpTypesPath)}.`);

// Rewrite the central help.ts as an aggregator that re-imports each folder.
const importLines = written
  .map((key) => `import { help as ${toCamel(key)}Help } from "./${key}/help";`)
  .join("\n");

const recordLines = written
  .map((key) => `  ${needsQuotes(key) ? `"${key}"` : key}: ${toCamel(key)}Help,`)
  .join("\n");

const aggregator = `// Aggregator for per-framework help guides. The actual content lives next
// to each framework in src/frameworks/<id>/help.ts. Kept here as a single
// lookup so the result screen can render the guide for any framework.

export type { FrameworkHelp } from "./help-types";
import type { FrameworkHelp } from "./help-types";

${importLines}

export const HELP: Record<string, FrameworkHelp> = {
${recordLines}
};
`;

fs.writeFileSync(HELP_FILE, aggregator);
console.log(`Rewrote ${path.relative(ROOT, HELP_FILE)} as aggregator.`);

function toCamel(id) {
  return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function needsQuotes(id) {
  return !/^[a-zA-Z_$][\w$]*$/.test(id);
}
