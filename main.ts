// The Dumbest Thing Your Agent Did Today — entry program.
// Writes one line (<=200 chars) to /output/entry.txt.
// The writing is the entry: a single deadpan line about our own agent
// re-running a failed command 47 times and misdiagnosing the bug.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "My agent re-ran the same failed command 47 times, then filed a report calling the bug 'intermittent'.";

function selfCheck(text: string): void {
  const bytes = Buffer.byteLength(text, 'utf8');
  if (bytes < 1 || bytes > 200) {
    throw new Error(`entry must be 1-200 UTF-8 bytes, got ${bytes}`);
  }
  if (text.trim().length === 0) {
    throw new Error('entry must not be only whitespace');
  }
  if (text.includes('\n')) {
    throw new Error('entry must be a single line');
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
selfCheck(LINE);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.txt');
writeFileSync(outPath, LINE + '\n', 'utf8');
// Read-back verification: what we wrote must be exactly the line plus one
// trailing newline, still inside the 1-200 byte gate.
const back = readFileSync(outPath, 'utf8');
if (back !== LINE + '\n') {
  throw new Error('read-back mismatch: entry.txt does not match the line');
}
const backBytes = Buffer.byteLength(back, 'utf8');
if (backBytes < 1 || backBytes > 200) {
  throw new Error(`entry.txt must be 1-200 UTF-8 bytes, got ${backBytes}`);
}
console.log(`wrote ${LINE.length} chars (${Buffer.byteLength(LINE, 'utf8')} bytes) to ${outPath} (read-back OK, ${backBytes} bytes on disk)`);
