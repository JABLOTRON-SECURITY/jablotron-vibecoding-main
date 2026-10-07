#!/usr/bin/env node
// Přehled aplikací sestavený automaticky z chart.
//
// Projde všechny repozitáře organizace na GitHubu, v každém přečte hlavičku
// CHARTA.md a sestaví tabulku PREHLED-APLIKACI.md: úroveň, stav, vlastník,
// termín revize a otevřené aktualizace od Dependabotu. Nic se neudržuje ručně.
//
// Spouští správce provozu před čtvrtletní revizí (a kdykoli jindy):
//   node nastaveni/app-overview.mjs <organizace>
// Potřebuje GitHub CLI přihlášené účtem, který vidí repozitáře aplikací.
// Výsledek commitněte do repozitáře jablotron-vibecoding.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const organizace = process.argv[2];
if (!organizace) {
  console.error("Použití: node nastaveni/app-overview.mjs <organizace>");
  process.exit(1);
}

function gh(...argumenty) {
  return execFileSync("gh", argumenty, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 32 * 1024 * 1024,
  });
}

function nactiHlavicku(text) {
  const hlavicka = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const pole = {};
  if (!hlavicka) return pole;
  for (const radek of hlavicka[1].split(/\r?\n/)) {
    const m = radek.match(/^([a-z_]+):\s*(.*?)\s*(#.*)?$/);
    if (m) pole[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return pole;
}

const repozitare = JSON.parse(
  gh(
    "repo",
    "list",
    organizace,
    "--limit",
    "1000",
    "--no-archived",
    "--json",
    "name,isTemplate,pushedAt",
  ),
).filter((r) => !r.isTemplate && r.name !== "jablotron-vibecoding");

const dnes = new Date().toISOString().slice(0, 10);
const aplikace = [];
const bezCharty = [];

for (const repo of repozitare) {
  let charta;
  try {
    charta = gh(
      "api",
      `repos/${organizace}/${repo.name}/contents/CHARTA.md`,
      "-H",
      "Accept: application/vnd.github.raw+json",
    );
  } catch {
    bezCharty.push(repo.name);
    continue;
  }
  const pole = nactiHlavicku(charta);
  let aktualizace = [];
  try {
    aktualizace = JSON.parse(
      gh(
        "pr",
        "list",
        "--repo",
        `${organizace}/${repo.name}`,
        "--author",
        "app/dependabot",
        "--state",
        "open",
        "--json",
        "createdAt",
      ),
    );
  } catch {
    // Bez přístupu k pull requestům se počet nezobrazí.
  }
  const nejstarsi = aktualizace
    .map((pr) => pr.createdAt.slice(0, 10))
    .sort()[0];
  const dnuOtevrena = nejstarsi
    ? Math.floor((Date.parse(dnes) - Date.parse(nejstarsi)) / 86_400_000)
    : 0;

  const upozorneni = [];
  if (/DOPLNIT/.test(Object.values(pole).join(" "))) upozorneni.push("charta nevyplněná");
  if (pole.pristi_revize && pole.pristi_revize < dnes && pole.stav !== "vyrazeno") {
    upozorneni.push("revize po termínu");
  }
  if (dnuOtevrena > 14) upozorneni.push(`aktualizace čeká ${dnuOtevrena} dní`);
  if (repo.pushedAt && Date.parse(dnes) - Date.parse(repo.pushedAt) > 183 * 86_400_000) {
    upozorneni.push("6 měsíců beze změny – zvážit vyřazení");
  }

  aplikace.push({
    repo: repo.name,
    nazev: pole.nazev ?? "?",
    uroven: pole.uroven ?? "?",
    stav: pole.stav ?? "?",
    vlastnik: pole.vecny_vlastnik ?? "?",
    revize: pole.pristi_revize ?? "?",
    aktualizace: aktualizace.length,
    upozorneni,
  });
}

aplikace.sort((a, b) => b.uroven.localeCompare(a.uroven) || a.nazev.localeCompare(b.nazev, "cs"));

const radky = [
  "# Přehled aplikací",
  "",
  `Vygenerováno ${dnes} z chart v repozitářích organizace \`${organizace}\` skriptem \`nastaveni/app-overview.mjs\`. Ručně neupravujte.`,
  "",
  `Aplikací: **${aplikace.length}** · L0: ${aplikace.filter((a) => a.uroven === "L0").length} · L1: ${aplikace.filter((a) => a.uroven === "L1").length} · L2: ${aplikace.filter((a) => a.uroven === "L2").length} · L3: ${aplikace.filter((a) => a.uroven === "L3").length}`,
  "",
  "| Aplikace | Repozitář | Úroveň | Stav | Věcný vlastník | Příští revize | Otevřené aktualizace | Upozornění |",
  "|---|---|---|---|---|---|---|---|",
  ...aplikace.map(
    (a) =>
      `| ${a.nazev} | [${a.repo}](https://github.com/${organizace}/${a.repo}) | ${a.uroven} | ${a.stav} | ${a.vlastnik} | ${a.revize} | ${a.aktualizace} | ${a.upozorneni.length ? `⚠️ ${a.upozorneni.join(", ")}` : "—"} |`,
  ),
  "",
];
if (bezCharty.length > 0) {
  radky.push(
    "## Repozitáře bez charty",
    "",
    "Buď nejde o aplikaci, nebo vznikla mimo proces. Prověřte.",
    "",
    ...bezCharty.map((r) => `- ${r}`),
    "",
  );
}

writeFileSync("PREHLED-APLIKACI.md", radky.join("\n"));
console.log(`Hotovo: PREHLED-APLIKACI.md · aplikace: ${aplikace.length} · repozitáře bez charty: ${bezCharty.length}`);
