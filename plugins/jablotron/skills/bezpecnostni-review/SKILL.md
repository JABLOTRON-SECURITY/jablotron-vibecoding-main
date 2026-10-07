---
name: bezpecnostni-review
description: Použij před každým pull requestem, před spuštěním aplikace, při revizi, po opravě bezpečnostní chyby a kdykoli tvůrce chce zkontrolovat bezpečnost změn nebo celé aplikace.
argument-hint: "[celá aplikace]"
when_to_use: „zkontroluj bezpečnost“, „udělej bezpečnostní review“, „je to bezpečné?“, „projde to podle OWASP?“, „můžu vytvořit pull request?“, před vytvořením pull requestu, před nasazením, při čtvrtletní revizi.
allowed-tools:
  - Bash(git fetch*)
  - Bash(git merge-base*)
  - Bash(git rev-parse*)
  - Bash(git status*)
  - Bash(git log*)
---

# Bezpečnostní review

Pošli změny nezávislému bezpečnostnímu recenzentovi (agent `jablotron:bezpecnostni-recenzent`). Recenzent kontroluje kód podle **OWASP Top 10:2025**, **ASVS 5.0**, **CWE**, **ISO/IEC 27001:2022** a firemních pravidel. Dostane přesně připravené zadání, nikdy historii této konverzace: hodnotí výsledek, ne tvůj postup. Ty jeho zjištění vyhodnotíš a necháš opravit.

Rozsah: $ARGUMENTS

**Hlavní zásada:** kód nekontroluje jeho autor. Review nikdy nedělej sám v této konverzaci.

## Kdy

**Povinně:**
- před každým pull requestem (krok 4 skillu `dokonceni`);
- v režimu **celá aplikace** před spuštěním (skill `nasazeni`) a u aplikací v provozu při čtvrtletní revizi;
- po opravě bezpečnostní chyby (režim **kontrola opravy**).

**Užitečné navíc:** po úkolu, který mění oprávnění, import, práci se soubory nebo databázové schéma.

## 1. Připrav zadání

- **Režim:** „celá aplikace“, když to říká rozsah výše; „kontrola opravy“, když ověřuješ opravu předchozích nálezů; jinak „změny“.
- **BASE a HEAD:** `git fetch origin main --quiet`, pak `BASE=$(git merge-base origin/main HEAD)` (když `origin` není, `git merge-base main HEAD`) a `HEAD=$(git rev-parse HEAD)`. U kontroly opravy je BASE commit před opravou. Necommitnuté změny recenzent uvidí sám přes `git status`.
- **Popis změny:** dvě tři věty, co se mění z pohledu uživatele a kterých částí kódu se to týká.
- **Zadání:** cesta k plánu v `docs/plans/` a čísla kritérií (KH-n), u drobné úpravy kritéria ze `SPEC.md`, kterých se týká.
- **Úroveň aplikace** z `CHARTA.md`.
- **Podklady** (cesty předej recenzentovi):
  - `${CLAUDE_SKILL_DIR}/owasp-top10.md` – kontroly OWASP Top 10:2025 pro šablonu Next.js; u PHP aplikace na JBT Platform (má `public/app/gate.php`) místo něj `${CLAUDE_SKILL_DIR}/owasp-top10-php.md`
  - `${CLAUDE_SKILL_DIR}/firemni-pravidla.md` – firemní pravidla F1–F7
  - `${CLAUDE_SKILL_DIR}/normy.md` – mapování na ASVS, CWE, ISO 27001 a GDPR, hloubka podle úrovně
- **U kontroly opravy** navíc seznam předchozích nálezů (název, místo, závažnost).

## 2. Pošli recenzentovi

Spusť agenta `jablotron:bezpecnostni-recenzent` s tímto zadáním (doplň hodnoty):

```
Režim: <změny | celá aplikace | kontrola opravy>
BASE: <sha> · HEAD: <sha>
Popis změny: <…>
Zadání: <plán a KH-n | kritéria ze SPEC.md>
Úroveň aplikace: <L0–L3>
Podklady: <tři cesty z kroku 1>
Předchozí nálezy (jen u kontroly opravy): <seznam>
```

## 3. Vyhodnoť nálezy

Když review běží v rámci `dokonceni`, opravuj rovnou podle tabulky. Když si ho tvůrce vyžádal sám, nejdřív mu nálezy ukaž (krok 4) a navrhni opravy. Opravuj až po jeho souhlasu, jako drobnou úpravu.

| Závažnost | Co uděláš |
|---|---|
| 🔴 Kritické | Oprav hned, test napřed (skill `testy-napred`): nejdřív test, který zneužití předvede a selže, pak oprava. Pull request nevznikne, dokud tu nález zůstává. |
| 🟠 Závažné | Oprav před pull requestem, stejně s testem napřed. |
| 🟡 Drobné | Zapiš do popisu pull requestu. Opravíš později, nebo hned, když je to na pár řádků. |
| Posun úrovně rizika | Kódem se neopraví. Řekni to tvůrci: aktualizuje chartu a nechá úroveň schválit, nebo se změna vrátí. |

- **Nález ověř, než ho opravíš.** Podívej se na uvedené místo. Když recenzent nemá pravdu, nic neopravuj: napiš důvod s doložením (kód, test) a zapiš ho do popisu pull requestu („Nález X nepřijat: …“).
- **Odložené body** („Co jsem posoudil a nechal stranou“) projdi jeden po druhém a rozhodni: opravit, zapsat do pull requestu, nebo nic, s důvodem.
- **Po opravách** spusť všechny kontroly (`pnpm check`, v PHP aplikaci `php tools/check.php`) a vyžádej **kontrolu opravy** (krok 1 a 2) se seznamem nálezů. Opakuj, dokud nezůstane žádný kritický ani závažný nález.

## 4. Řekni to tvůrci

Shrň česky a bez žargonu: verdikt, kolik nálezů jaké závažnosti, co jsi opravil a jak to ohlídá test, co zůstává v pull requestu. U každého nálezu uveď v závorce místo a zařazení z recenzentovy zprávy, například „(`akce.ts:6`, OWASP A01, CWE-862)“. Tvůrce zařazení znát nemusí, ale podle něj se nález dohledá a doloží. U režimu **celá aplikace** předej celou zprávu recenzenta: skill `nasazeni` ji uloží do `docs/bezpecnost/`.

## Varovné myšlenky

| Když si říkáš | Ve skutečnosti |
|---|---|
| „Je to malá změna, review nepotřebuje.“ | Chybějící kontrola oprávnění je jeden řádek. Malá změna, velký dopad. |
| „Projdu diff sám, je to rychlejší.“ | Autor nevidí vlastní chyby a zahltí si kontext. Recenzent je nezávislý a vrátí jen nálezy. |
| „Recenzent potřebuje celou konverzaci, aby pochopil souvislosti.“ | Dostane přesné zadání: rozsah, popis, zadání, úroveň. Hodnotí výsledek, ne postup. |
| „Tohle je jen drobnost, označím ji jako drobnou.“ | Závažnost určil recenzent. Snížit ji smíš jen s doloženým důvodem v pull requestu. |
| „Opravím to bez testu, je to jasné.“ | Bez testu se bezpečnostní chyba vrátí s další změnou. Test napřed. |
| „Nález je nepříjemný, nebudu ho tvůrci zdůrazňovat.“ | Tvůrce musí vědět, co se změnilo a proč. Nález patří do shrnutí i do pull requestu. |

**Nikdy:** nepřeskakuj review, nedělej ho sám v hlavní konverzaci, neignoruj kritický nález, nepokračuj s neopraveným závažným nálezem a nehádej se s doloženým nálezem bez důkazu.
