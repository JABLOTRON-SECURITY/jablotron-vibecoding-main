#!/usr/bin/env node
// Hook SessionStart: na začátku každé relace předá agentovi firemní pravidla
// a stav aplikace (charta, úroveň, větev). Nikdy relaci neblokuje.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

function gitKonfigurace(adresar, klic) {
  try {
    return execFileSync("git", ["config", "--get", klic], {
      cwd: adresar,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 3000,
    }).trim();
  } catch {
    return "";
  }
}

/** Velmi jednoduché čtení hlavičky charty: řádky „klic: hodnota“. */
function nactiChartu(adresar) {
  const cesta = join(adresar, "CHARTA.md");
  if (!existsSync(cesta)) return null;
  const text = readFileSync(cesta, "utf8");
  const hlavicka = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const pole = {};
  if (hlavicka) {
    for (const radek of hlavicka[1].split(/\r?\n/)) {
      const m = radek.match(/^([a-z_]+):\s*(.*?)\s*(#.*)?$/);
      if (m) pole[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return { pole, nevyplneno: /DOPLNIT/.test(hlavicka ? hlavicka[1] : text) };
}

/** Rozpracované plány v docs/plans/ (nezaškrtnuté kroky, nebo chybí závěrečná kontrola větve), nejnovější první. */
function rozpracovanePlany(adresar) {
  const slozka = join(adresar, "docs", "plans");
  if (!existsSync(slozka)) return [];
  let soubory = [];
  try {
    soubory = readdirSync(slozka).filter((s) => s.endsWith(".md") && s.toLowerCase() !== "readme.md");
  } catch {
    return [];
  }
  const vysledek = [];
  for (const soubor of soubory.sort().reverse()) {
    try {
      // Vzory v HTML komentářích (šablona plánu) se nepočítají.
      const text = readFileSync(join(slozka, soubor), "utf8").replace(/<!--[\s\S]*?-->/g, "");
      const hotovo = (text.match(/^\s*- \[[xX]\]/gm) || []).length;
      const zbyva = (text.match(/^\s*- \[ \]/gm) || []).length;
      const schvaleny = /Plán schválen tvůrcem: \d{4}-\d{2}-\d{2}/.test(text);
      const zkontrolovany = /^\s*- Závěrečná kontrola:/m.test(text);
      if (zbyva > 0 || (hotovo > 0 && !zkontrolovany)) vysledek.push({ soubor: `docs/plans/${soubor}`, hotovo, celkem: hotovo + zbyva, schvaleny });
    } catch {
      // nečitelný soubor přeskočíme
    }
    if (vysledek.length >= 2) break;
  }
  return vysledek;
}

const vstup = nactiVstup();
const adresar = process.env.CLAUDE_PROJECT_DIR || vstup.cwd || process.cwd();
const korenPluginu = process.env.CLAUDE_PLUGIN_ROOT;

const casti = [];

// 1. Firemní pravidla platí v každé relaci.
try {
  const pravidla = readFileSync(join(korenPluginu, "reference", "pravidla-prace.md"), "utf8");
  casti.push(
    "# Firemní pravidla Jablotron pro vývoj s agentem (závazná)",
    pravidla.replace(/^# .*\r?\n/, "").trim(),
    `Podrobnosti: úrovně rizika ${join(korenPluginu, "reference", "urovne-rizika.md")}, třídy dat ${join(korenPluginu, "reference", "tridy-dat.md")}, incident ${join(korenPluginu, "reference", "incident.md")}.`,
  );
} catch {
  // Bez pravidel pokračujeme; základ je i v CLAUDE.md šablony.
}

// 2. Postup práce a pravidlo pro používání skills.
try {
  const postup = readFileSync(join(korenPluginu, "reference", "postup-prace.md"), "utf8");
  casti.push(postup.trim());
} catch {
  // Bez mapy postupu pokračujeme; skills se načítají podle svých popisů.
}

// 3. Stav aplikace, jen pokud jde o aplikaci ze šablony (má CHARTA.md).
const charta = nactiChartu(adresar);
if (charta) {
  const { pole, nevyplneno } = charta;
  const stav = ["# Stav této aplikace"];
  stav.push(
    `Aplikace: ${pole.nazev || "?"} · úroveň: ${pole.uroven || "?"} · stav: ${pole.stav || "?"}`,
  );
  const php = (existsSync(join(adresar, "public", "app", "gate.php")) || existsSync(join(adresar, "public", "app", "brana.php")));
  if (php) {
    stav.push(
      `Aplikace je z PHP šablony pro JBT Platform (\`jablotron-app-php-template\`). Skills a agenti uvádějí příkazy, cesty a vzory šablony Next.js (\`pnpm …\`, \`tests/e2e/\`, \`src/\`, \`vyzadujRoli\`). Tady platí jejich obdoby z oddílů Příkazy a Vzory v \`CLAUDE.md\` a z přehledu ${join(korenPluginu || "", "reference", "sablony.md")}. Agentům, které spouštíš, to vždy napiš do zadání.`,
    );
  }
  if (nevyplneno) {
    stav.push(
      "⚠️ CHARTA.md není vyplněná (obsahuje DOPLNIT). Než začneš psát jakýkoli kód, řekni to tvůrci a nabídni mu skill /jablotron:specifikace. Bez charty a specifikace se nevyvíjí.",
    );
  }
  if (/^L[123]$/.test(pole.uroven || "") && /není potřeba|neni potreba/i.test(pole.schvaleni || "")) {
    stav.push(
      `⚠️ Aplikace je na úrovni ${pole.uroven}, ale v chartě nemá schválení (pole schvaleni). Od L1 se vyvíjí jen se schváleným nápadem. Řekni to tvůrci a pomoz mu nápad podat (/jablotron:specifikace).`,
    );
  }
  if (/^L[23]$/.test(pole.uroven || "")) {
    stav.push(
      `Aplikace je na úrovni ${pole.uroven}: vyvíjí se jen s fiktivními daty a platí přísnější kontroly (odborné code review${pole.uroven === "L3" ? ", před spuštěním bezpečnostní test a posouzení vlivu na ochranu osobních údajů" : ", souhlas vlastníka dat, posouzení ochrany osobních údajů"}). Vývoj není omezený, jen je víc kontrol.`,
    );
  }
  if (existsSync(join(adresar, "tools", "pre-commit.php")) && !existsSync(join(adresar, ".git", "hooks", "pre-commit"))) {
    stav.push(
      "⚠️ Kontrola před commitem (hesla, klíče, data) není aktivní, protože v projektu ještě neproběhla příprava. Než cokoli commitneš, spusť `php tools/setup.php`.",
    );
  }
  if (existsSync(join(adresar, ".husky")) && !gitKonfigurace(adresar, "core.hooksPath")) {
    stav.push(
      "⚠️ Kontrola před commitem (hesla, klíče, data) není aktivní, protože v projektu ještě neproběhlo `pnpm install`. Než cokoli commitneš, spusť `pnpm bootstrap` (nebo aspoň `pnpm install`).",
    );
  }
  for (const plan of rozpracovanePlany(adresar)) {
    stav.push(
      plan.schvaleny
        ? `Rozpracovaný plán: \`${plan.soubor}\` (hotovo ${plan.hotovo} z ${plan.celkem} kroků${plan.hotovo === plan.celkem ? "; zbývá kontrola s tvůrcem nebo závěrečná kontrola větve" : ""}). Když chce tvůrce pokračovat, použij /jablotron:implementace; co je hotové, říká oddíl Průběh.`
        : `Plán \`${plan.soubor}\` čeká na schválení tvůrcem (v Průběhu chybí řádek „Plán schválen tvůrcem“). Než začneš stavět, ukaž tvůrci část „Pro tvůrce“ a počkej na souhlas.`,
    );
  }
  const vetev = aktualniVetev(adresar);
  if (vetev === "main" || vetev === "master") {
    stav.push(
      `Jsi na hlavní větvi \`${vetev}\`. Než začneš měnit soubory, založ novou větev (např. \`git switch -c feature/<short-name>\`). Commit ani push do \`${vetev}\` není dovolený.`,
    );
  } else if (vetev) {
    stav.push(`Aktuální větev: \`${vetev}\`.`);
  }
  casti.push(stav.join("\n"));
}

// 4. Po zhuštění konverzace se skills nemusí zachovat celé.
if (vstup.source === "compact") {
  casti.push(
    "Konverzace byla právě zhuštěna. Pokud jsi pracoval podle některého skillu pluginu `jablotron` (například `/jablotron:implementace`), načti ho znovu. Stav práce ověř v souborech (plán a jeho Průběh, `git log`), ne jen ve shrnutí, a hotové kroky neopakuj.",
  );
}

if (casti.length > 0) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: casti.join("\n\n"),
      },
    }),
  );
}
process.exit(0);
