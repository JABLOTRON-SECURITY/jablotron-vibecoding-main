#!/usr/bin/env node
// Hook PreToolUse pro příkazy v terminálu: zablokuje akce, které porušují
// pravidla práce (commit do main, force push, obcházení kontrol, npm/npx),
// a u nevratných akcí si vyžádá potvrzení od člověka.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function nactiVstup() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}

function aktualniVetev(adresar) {
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: adresar,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 3000,
    }).trim();
  } catch {
    return null;
  }
}

function rozhodnuti(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

const vstup = nactiVstup();
const puvodni = String(vstup?.tool_input?.command ?? "");
if (!puvodni) process.exit(0);

// Tělo heredocu, které je jen text (zpráva commitu, popis pull requestu,
// obsah souboru), se do kontroly nepočítá. Heredoc pro shell nebo jiný
// interpret se kontroluje celý, protože se spustí.
const DATOVE_PRIKAZY = /\b(git\s+commit|git\s+tag|gh\s+\S+|cat|tee)\b/;
const INTERPRETY = /\b(bash|sh|zsh|dash|node|python3?|ruby|perl|pwsh|powershell|eval|source)\b/;
const bezHeredocu = puvodni.replace(
  /^([^\n]*?)<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2([^\n]*)\n[\s\S]*?\n[ \t]*\3[ \t]*(?=\n|$)/gm,
  (cely, pred, _uvozovka, _znacka, za) =>
    DATOVE_PRIKAZY.test(pred) && !INTERPRETY.test(pred + za) ? `${pred}<<TEXT${za}` : cely,
);

// Text v uvozovkách (zprávy commitů, řetězce) se do kontroly nepočítá.
const prikaz = bezHeredocu.replace(/"(?:\\.|[^"\\])*"|'[^']*'/g, '""');

const adresar = vstup.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const GIT = String.raw`\bgit(?:\s+-C\s+\S+)?\s+`;
const ARGUMENTY = String.raw`[^\n;&|]*`;

// --- Zakázané akce ---------------------------------------------------------

if (new RegExp(`${GIT}push\\b${ARGUMENTY}(\\s--force(-with-lease)?\\b|\\s-[a-zA-Z]*f[a-zA-Z]*\\b|\\s\\+\\S)`).test(prikaz)) {
  rozhodnuti(
    "deny",
    "Force push je zakázaný (pravidlo 3: práce ve vlastní větvi). Přepisuje historii a může zničit práci ostatních. Pokud se něco pokazilo, navrhněte opravu novým commitem.",
  );
}

if (
  new RegExp(`${GIT}(commit|push|merge|rebase)\\b${ARGUMENTY}\\s--no-verify\\b`).test(prikaz) ||
  new RegExp(`${GIT}commit\\b${ARGUMENTY}\\s-[a-zA-Z]*n[a-zA-Z]*\\b`).test(prikaz) ||
  /\bHUSKY=0\b/.test(prikaz) ||
  /core\.hooksPath/i.test(prikaz) ||
  /\bgit\s+-c\s/.test(prikaz)
) {
  rozhodnuti(
    "deny",
    "Obcházení kontrol je zakázané (--no-verify, HUSKY=0, změna core.hooksPath, git -c). Kontrola před commitem hlídá hesla, klíče a data. Pokud selhala, opravte příčinu.",
  );
}

const adresarProjektu = vstup.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const phpAplikace = ["gate.php", "brana.php"].some((f) => existsSync(join(process.env.CLAUDE_PROJECT_DIR || adresarProjektu, "public", "app", f)));
const PHP_KNIHOVNY =
  "PHP aplikace pro JBT Platform nepoužívá npm ani pnpm. Knihovny se přidávají jen přes Composer (`composer require <dodavatel/balik>`) a jen se souhlasem tvůrce a se zdůvodněním v pull requestu.";
const COMPOSER_BEZPECNE =
  "Composer v aplikaci pro JBT Platform slouží jen k přidání, instalaci a aktualizaci knihoven (`composer require`, `install`, `update`, `remove`). Globální instalace, create-project, spouštění skriptů a změny nastavení pluginů, skriptů nebo repozitářů nejsou povolené (pluginy a skripty Composeru jsou zakázané, hlídá to i kontrola Závislosti v GitHubu).";

if (/(^|[\s;&|(])(npm\s+(install|i|ci|add|exec)\b|npx\s|yarn(\s|$)|bun\s+(add|install|x)\b|bunx\s)/.test(prikaz)) {
  rozhodnuti(
    "deny",
    phpAplikace
      ? PHP_KNIHOVNY
      : "V projektech se používá výhradně pnpm (bezpečnější výchozí nastavení: nespouští instalační skripty závislostí a odmítá čerstvě vydané balíčky). Použijte `pnpm install`, `pnpm add <balicek>` nebo `pnpm dlx <nastroj>`.",
  );
}

if (phpAplikace && /(^|[\s;&|(])pnpm\s+(add|install|i)\b/.test(prikaz)) {
  rozhodnuti("deny", PHP_KNIHOVNY);
}

// Composer smí přidávat a instalovat knihovny. Pluginy a skripty zakazuje composer.json
// (allow-plugins je prázdné) a kontrola Závislosti; globální instalace a cizí repozitáře ne.
const COMPOSER = /(^|[\s;&|(])(composer(\.phar)?|php\s+\S*composer\.phar)\s+/;
if (
  COMPOSER.test(prikaz) &&
  /\s(create-project|global|config\s+\S*(repositories|allow-plugins|scripts)|run-script|run|exec)\b/.test(prikaz)
) {
  rozhodnuti("deny", COMPOSER_BEZPECNE);
}

const JINA_DATABAZE =
  /(^|[\s;&|(])pnpm\s+(add|install|i)\b[^\n;&|]*\s(pg|postgres|@electric-sql\/pglite|@neondatabase\/\S+|mongodb|mongoose|firebase|firebase-admin|@supabase\/\S+|better-sqlite3|sqlite3|@libsql\/\S+|redis|ioredis|@prisma\/client|prisma|typeorm|sequelize|knex)(@\S*)?(?=\s|$)/;
if (JINA_DATABAZE.test(prikaz)) {
  rozhodnuti(
    "deny",
    "Firemní standard je relační databáze MySQL, kterou šablona už má (Drizzle, src/lib/db/). Knihovna pro jinou databázi nebo úložiště se nepřidává. Data ulož do MySQL přes schéma v src/lib/db/schema.ts.",
  );
}

if (new RegExp(`${GIT}(commit|push)\\b`).test(prikaz)) {
  const vetev = aktualniVetev(adresar);
  const pushDoMain = new RegExp(`${GIT}push\\b${ARGUMENTY}[\\s:](main|master)(?=\\s|$)`).test(prikaz);
  if (vetev === "main" || vetev === "master" || pushDoMain) {
    rozhodnuti(
      "deny",
      "Do hlavní větve se necommituje ani nepushuje (pravidlo 3). Založte novou větev: `git switch -c feature/<short-name>` a změnu pošlete přes pull request.",
    );
  }
}

// --- Nevratné akce: potvrdí člověk -------------------------------------------

if (new RegExp(`${GIT}branch\\s+-D\\b`).test(prikaz)) {
  rozhodnuti(
    "ask",
    "Nevratná akce v gitu: smaže se větev i commity, které nejsou v jiné větvi. Potvrďte jen tehdy, když víte, co se zahodí.",
  );
}

if (new RegExp(`${GIT}(reset\\s+--hard|clean\\s+-[a-z]*f|checkout\\s+--\\s|restore\\s+\\.)`).test(prikaz)) {
  rozhodnuti(
    "ask",
    "Nevratná akce v gitu: neuložené změny se ztratí. Potvrďte jen tehdy, když víte, co se zahodí.",
  );
}

if (/\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r|Remove-Item\b[^\n]*-Recurse/i.test(prikaz)) {
  rozhodnuti(
    "ask",
    "Hromadné mazání souborů. Potvrďte jen tehdy, když víte, co se smaže.",
  );
}

process.exit(0);
