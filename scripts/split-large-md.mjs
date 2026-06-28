#!/usr/bin/env node
/**
 * Split markdown files larger than 32KB into sequential parts at heading boundaries.
 * Replaces the original with an index that links to all parts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 32 * 1024; // 32KB
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".expo",
]);

function shouldScanDir(name) {
  return !SKIP_DIRS.has(name);
}

function collectMdFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (shouldScanDir(entry.name)) {
        collectMdFiles(path.join(dir, entry.name), files);
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.includes(".part-")) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function byteLength(text) {
  return Buffer.byteLength(text, "utf8");
}

function splitIntoSections(content) {
  const lines = content.split("\n");
  const sections = [];
  let current = { heading: null, lines: [] };

  for (const line of lines) {
    const isHeading = /^#{1,2} /.test(line);
    if (isHeading && current.lines.length > 0) {
      sections.push(current);
      current = { heading: line, lines: [line] };
    } else {
      if (current.lines.length === 0 && isHeading) {
        current.heading = line;
      }
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0) {
    sections.push(current);
  }
  return sections.map((s) => s.lines.join("\n"));
}

function groupSectionsIntoParts(sections, maxBytes) {
  const parts = [];
  let current = "";
  let currentBytes = 0;

  for (const section of sections) {
    const sectionBytes = byteLength(section);
    const separator = current ? "\n\n" : "";
    const addedBytes = byteLength(separator) + sectionBytes;

    if (current && currentBytes + addedBytes > maxBytes) {
      parts.push(current);
      current = section;
      currentBytes = sectionBytes;
    } else {
      current = current ? current + separator + section : section;
      currentBytes += current === section ? sectionBytes : addedBytes;
    }
  }

  if (current) {
    parts.push(current);
  }
  return parts;
}

function partFilename(originalPath, index, total) {
  const dir = path.dirname(originalPath);
  const base = path.basename(originalPath, ".md");
  const num = String(index).padStart(2, "0");
  return path.join(dir, `${base}.part-${num}.md`);
}

function buildPartNav(originalBase, partIndex, totalParts, relDir = ".") {
  const num = String(partIndex).padStart(2, "0");
  const prev =
    partIndex > 1
      ? `[← Part ${partIndex - 1}](${relDir}/${originalBase}.part-${String(partIndex - 1).padStart(2, "0")}.md)`
      : `[↑ Index](${relDir}/${originalBase}.md)`;
  const next =
    partIndex < totalParts
      ? `[Part ${partIndex + 1} →](${relDir}/${originalBase}.part-${String(partIndex + 1).padStart(2, "0")}.md)`
      : `[↑ Index](${relDir}/${originalBase}.md)`;

  return (
    `\n\n---\n\n**Navigation:** ${prev} · **Part ${partIndex} of ${totalParts}** · ${next}\n`
  );
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : path.basename(content, ".md");
}

function buildIndex(originalPath, parts, originalSize) {
  const base = path.basename(originalPath, ".md");
  const title = extractTitle(parts[0]);
  const rows = parts
    .map((part, i) => {
      const num = i + 1;
      const sizeKb = (byteLength(part) / 1024).toFixed(1);
      const firstHeading =
        part.match(/^#{1,2}\s+(.+)$/m)?.[1]?.trim() ?? `Section ${num}`;
      return `| [Part ${num}](./${base}.part-${String(num).padStart(2, "0")}.md) | ${sizeKb} KB | ${firstHeading} |`;
    })
    .join("\n");

  return `# ${title}

> **Split for context limits.** Original size: ${(originalSize / 1024).toFixed(1)} KB (>${MAX_BYTES / 1024} KB).
> Read parts in order — each part is under 32 KB.

| Part | Size | Starts with |
|------|------|-------------|
${rows}

**Start reading:** [Part 1 →](./${base}.part-01.md)
`;
}

function splitFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const size = byteLength(content);

  if (size <= MAX_BYTES) {
    return { filePath, split: false, size };
  }

  const sections = splitIntoSections(content);
  const parts = groupSectionsIntoParts(sections, MAX_BYTES);

  if (parts.length <= 1) {
    console.warn(`  Could not split ${filePath} — single section exceeds limit`);
    return { filePath, split: false, size };
  }

  const base = path.basename(filePath, ".md");
  const written = [];

  for (let i = 0; i < parts.length; i++) {
    const partPath = partFilename(filePath, i + 1, parts.length);
    const nav = buildPartNav(base, i + 1, parts.length);
    const body = i === 0 ? parts[i] : `\n> _Continued from [${base}.md](./${base}.md) — Part ${i}._\n\n${parts[i]}`;
    fs.writeFileSync(partPath, body + nav, "utf8");
    written.push({ path: partPath, size: byteLength(body + nav) });
  }

  const index = buildIndex(filePath, parts, size);
  fs.writeFileSync(filePath, index, "utf8");

  return { filePath, split: true, size, parts: written.length, partSizes: written };
}

// Scan project dirs (include dot dirs like .continue and .cursor)
function collectAllMdFiles() {
  const files = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      collectMdFiles(path.join(ROOT, entry.name), files);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(path.join(ROOT, entry.name));
    }
  }
  return files;
}

const files = collectAllMdFiles();
const results = [];

console.log(`Scanning ${files.length} markdown files (limit: ${MAX_BYTES} bytes)...\n`);

for (const file of files.sort()) {
  const rel = path.relative(ROOT, file);
  const result = splitFile(file);
  results.push({ ...result, rel });

  if (result.split) {
    console.log(`✓ SPLIT  ${rel} (${(result.size / 1024).toFixed(1)} KB → ${result.parts} parts)`);
    for (const p of result.partSizes) {
      console.log(`         ${path.relative(ROOT, p.path)} (${(p.size / 1024).toFixed(1)} KB)`);
    }
  }
}

const splitCount = results.filter((r) => r.split).length;
const largeUnsplit = results.filter((r) => !r.split && r.size > MAX_BYTES);

console.log(`\nDone: ${splitCount} file(s) split.`);

if (largeUnsplit.length) {
  console.log("\nStill over limit (not split):");
  for (const r of largeUnsplit) {
    console.log(`  ${r.rel} (${(r.size / 1024).toFixed(1)} KB)`);
  }
}
