#!/usr/bin/env node
// Nahradí zástupný název GitHub organizace „jablotron-org“ skutečným názvem
// ve všech souborech předávacího balíčku.
//
// Použití (ze složky, kde leží jablotron-vibecoding/ a jablotron-app-next-template/ vedle sebe):
//   node jablotron-vibecoding/nastaveni/rename-org.mjs <nazev-organizace>

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ZASTUPNY = "jablotron-org";
const nazev = process.argv[2];

if (!nazev || !/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(nazev)) {
  console.error("Použití: node jablotron-vibecoding/nastaveni/rename-org.mjs <nazev-organizace>");
  console.error("Název organizace je část adresy https://github.com/<nazev-organizace>.");
  process.exit(1);
}

const slozkaSkriptu = dirname(fileURLToPath(import.meta.url));
const koren = resolve(slozkaSkriptu, "..", "..");
const repozitare = ["jablotron-vibecoding", "jablotron-app-next-template", "jablotron-app-php-template", "demo-evidence-skoleni", "demo-evidence-skoleni-php"]
  .map((r) => join(koren, r))
  .filter((cesta) => existsSync(cesta));
const PRESKOCIT = new Set(["node_modules", ".git", ".next", ".data", ".tools"]);
const VYNECHAT = new Set(["NAVOD-PRO-ADMINA.md"]);
const TEXTOVE = /\.(md|json|ya?ml|ts|tsx|mjs|js|txt|php)$|(^|[/\\])CODEOWNERS$/;

let pocet = 0;
function projdi(slozka) {
  for (const polozka of readdirSync(slozka)) {
    if (PRESKOCIT.has(polozka)) continue;
    const cesta = join(slozka, polozka);
    if (statSync(cesta).isDirectory()) {
      projdi(cesta);
    } else if (TEXTOVE.test(cesta) && !VYNECHAT.has(polozka) && cesta !== fileURLToPath(import.meta.url)) {
      const obsah = readFileSync(cesta, "utf8");
      if (obsah.includes(ZASTUPNY)) {
        writeFileSync(cesta, obsah.replaceAll(ZASTUPNY, nazev));
        console.log(`upraveno: ${cesta.slice(koren.length + 1)}`);
        pocet++;
      }
    }
  }
}

for (const repozitar of repozitare) projdi(repozitar);
console.log(`\nNahrazeno v ${pocet} souborech.`);

console.log("\nZměny commitněte v každém repozitáři: git commit -am \"Název organizace\"");
