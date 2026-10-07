---
name: nasazeni
description: Použij, když tvůrce chce aplikaci zpřístupnit kolegům, nasadit ji nebo vydat novou verzi do provozu.
when_to_use: „chci to zpřístupnit kolegům“, „nasaď to“, „můžou to už používat kolegové?“, „nová verze do provozu“, „je to připravené do provozu?“.
disable-model-invocation: true
---

# Nasazení

Aplikace jde do provozu, **až když jsou splněné podmínky spuštění** a správce provozu je potvrdí. Tvým úkolem je připravit podklad, ne nasazovat na vlastní pěst.

> **Aplikace ze šablony Next.js:** cílové provozní prostředí zatím není rozhodnuté. Dokud ho Jablotron nestanoví, aplikace se nenasazuje mimo počítač tvůrce. Skill připraví vše ostatní a podklad předá správci provozu. Až bude prostředí rozhodnuté, doplní se sem postup nasazení.
>
> **PHP aplikace pro JBT Platform** (má `public/app/gate.php`) se nasazuje na hosting rozcestníku workflow `Nasazení` (`.github/workflows/deploy.yml`) po úspěšných kontrolách v `main`, ale jen když je charta ve stavu `pilot` nebo `provoz`. Změnu stavu na `pilot` proto udělej až v kroku 4, po potvrzení správce provozu.

## 1. Úroveň a požadavky

Přečti `CHARTA.md`. Podle úrovně urči, co platí (viz [úrovně rizika](${CLAUDE_PLUGIN_ROOT}/reference/urovne-rizika.md)):

- **L0:** nenasazuje se, aplikace je jen pro autora. Řekni to tvůrci a skonči.
- **L1:** podmínky spuštění, nezávislá kontrola větve a bezpečnostní review, potvrzení správce provozu.
- **L2:** navíc odborné code review bez nevyřešených nálezů, test oprávnění (každá role vidí a smí jen své), souhlas vlastníka zdrojových dat, posouzení ochrany osobních údajů, zálohy s ověřenou obnovou; spuštění schvaluje i schvalovatel.
- **L3:** navíc bezpečnostní test před spuštěním (nezávislý odborník), posouzení vlivu na ochranu osobních údajů (DPIA), plán řešení incidentů a dohodnutý garantovaný provoz.

Body, které agent sám nesplní (posouzení, test, souhlasy), zapiš do `docs/podminky-spusteni.md` jako ⏳ s tím, kdo je dodá. Tvůrci řekni, za kým má jít.

## 2. Projdi podmínky spuštění

Pracuj ve větvi `deploy/<RRRR-MM-DD>` (založ ji z aktuálního `main`). Záznam podmínek, zprávu z review i případné opravy na konci pošli přes `/jablotron:dokonceni`, ať jsou v `main` dřív, než na ně žádost odkáže.

Pro každý bod [podmínek spuštění](${CLAUDE_PLUGIN_ROOT}/reference/podminky-spusteni.md) zjisti stav z repozitáře a zapiš ho do `docs/podminky-spusteni.md` (✅ splněno / ❌ nesplněno / ⏳ ověří správce provozu). U každého bodu uveď důkaz: odkaz, soubor, výsledek příkazu.

Ověř přitom:

- `pnpm check` projde bez chyb (lint, typy, testy, build; v PHP aplikaci `php tools/check.php`);
- poslední pull request do `main` má zelené všechny kontroly a vyřešené všechny komentáře z review;
- `CHARTA.md` nemá prázdná pole a úroveň potvrdil schvalovatel;
- v kódu nejsou ladicí ani dočasné funkce a vývojové přihlášení je v produkci vypnuté (`src/lib/auth.ts`; v PHP aplikaci je jen v `tools/dev/`, které se na hosting nenahrává);
- README odpovídá skutečnosti (případně nejdřív spusť skill `predani-projektu`).

Pro závěrečnou kontrolu spusť `/jablotron:bezpecnostni-review celá aplikace` – projde celou aplikaci podle OWASP Top 10:2025, ASVS a firemních pravidel, ne jen poslední změnu. Kritické a závažné nálezy spuštění brání: oprav je (s testem napřed) a review zopakuj. Výslednou zprávu ulož do `docs/bezpecnost/RRRR-MM-DD-bezpecnostni-review.md` a commitni (`docs: bezpečnostní review celé aplikace`). Je to doklad pro správce provozu a pro audit (ISO 27001, opatření A.8.29).

## 3. Podklad pro správce provozu

Připrav issue v repozitáři aplikace s názvem „Žádost o spuštění: <název> <verze>“ a obsahem:

```
Aplikace: <název> · úroveň <L1> · vlastník <jméno>
Charta: <odkaz> · Specifikace: <odkaz>
Podmínky spuštění: <odkaz na docs/podminky-spusteni.md>
Bezpečnostní review: <odkaz na docs/bezpecnost/…> · <verdikt, počet drobných nálezů>

Splněno: X z 10
Nesplněno: <seznam a důvod>
Ověří správce provozu: <seznam>

Prosím o potvrzení spuštění.
```

Issue vytvoř přes `gh issue create`, jen když s tím tvůrce souhlasí. Spuštění potvrzuje správce provozu, ne tvůrce ani agent.

## 4. Po potvrzení (jen PHP aplikace pro JBT Platform)

Když správce provozu spuštění potvrdí a správce platformy připravil hosting, prostředí `produkce` se secrets a registraci na rozcestníku (README aplikace, oddíl Nasazení na JBT Platform):

1. Ve větvi `deploy/<RRRR-MM-DD>` nastav v `CHARTA.md` `stav: pilot`, `umisteni_provozu` na adresu aplikace (`https://<identifikátor>.jbtplatform.cz`) a `spusteni` na dnešní datum. Ověř, že `JBT_AUTH_SLUG` v `public/auth-guard.php` je identifikátor aplikace na rozcestníku a že `public/app/app-info.php` odpovídá chartě.
2. Pošli změnu přes `/jablotron:dokonceni`. Charta je v `CODEOWNERS`, pull request proto schvaluje tým `vibecoding-spravci`. Po sloučení do `main` a úspěšných kontrolách se aplikace nasadí sama.
3. Výsledek workflow `Nasazení` ověř (`gh run list --workflow Kontroly --limit 1`, pak `gh run view <id>`): krok „Kontrola po nasazení“ musí potvrdit, že konfigurace, token ani guardy nejdou z webu otevřít a že `health.php` vrací 200. Tvůrci řekni adresu aplikace a že ji uvidí jen lidé, kterým ji správce přiřadil na rozcestníku.
