#!/usr/bin/env node
// Hook PostToolUse: po každé úpravě souboru ho zformátuje a opraví bezpečné
// nálezy lintu (Biome), aby kontroly v CI nepadaly na formátování.
// U souborů PHP (šablona pro JBT Platform) ověří syntaxi přes php -l.
// Zbývající nálezy předá agentovi. Nikdy nic neblokuje.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join, relative } from "node:path";

const PRIPONY = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc", ".css"]);

function konec() {
  process.exit(0);
}

let vstup = {};
try {
  vstup = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  konec();
}

const projekt = process.env.CLAUDE_PROJECT_DIR || vstup.cwd || process.cwd();
const soubor = vstup.tool_input?.file_path;
const pripona = extname(soubor || "").toLowerCase();
if (!soubor || (!PRIPONY.has(pripona) && pripona !== ".php")) konec();

const cesta = isAbsolute(soubor) ? soubor : join(projekt, soubor);
const vRamciProjektu = relative(projekt, cesta);
if (!existsSync(cesta) || vRamciProjektu.startsWith("..") || isAbsolute(vRamciProjektu)) konec();

function predejAgentovi(text) {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: text } }),
  );
}

// PHP: syntaxe hned po úpravě (formátovač šablona PHP nemá).
if (pripona === ".php") {
  const lint = spawnSync("php", ["-l", cesta], { cwd: projekt, encoding: "utf8", timeout: 20000 });
  if (!lint.error && lint.status !== 0) {
    const vypis = `${lint.stdout || ""}${lint.stderr || ""}`.trim().split(/\r?\n/).slice(0, 10).join("\n");
    predejAgentovi(`Soubor ${vRamciProjektu} obsahuje chybu syntaxe PHP, oprav ji (jinak neprojde žádná kontrola):\n${vypis}`);
  }
  konec();
}

// Jen v projektech ze šablony: Biome je nainstalovaný a nastavený.
const biome = join(projekt, "node_modules", "@biomejs", "biome", "bin", "biome");
if (!existsSync(join(projekt, "biome.json")) || !existsSync(biome)) konec();

const vysledek = spawnSync(
  process.execPath,
  [biome, "check", "--write", "--no-errors-on-unmatched", "--colors=off", "--max-diagnostics=10", cesta],
  { cwd: projekt, encoding: "utf8", timeout: 25000 },
);

if (vysledek.status !== 0 && !vysledek.error) {
  const vypis = `${vysledek.stdout || ""}${vysledek.stderr || ""}`.trim().split(/\r?\n/).slice(0, 40).join("\n");
  predejAgentovi(
    `Biome po automatickém formátování hlásí v souboru ${vRamciProjektu} problémy, které je potřeba opravit (jinak neprojde kontrola v CI):\n${vypis}`,
  );
}
konec();
