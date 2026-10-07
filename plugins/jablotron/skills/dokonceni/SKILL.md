---
name: dokonceni
description: Použij, když je implementace nebo drobná úprava hotová a tvůrce chce změnu odevzdat ke kontrole.
when_to_use: „dokonči to“, „pošli to ke kontrole“, „vytvoř pull request“, „odevzdat“, „hotovo, pošli to“, po skončení /jablotron:implementace nebo drobné úpravy.
---

# Dokončení: od hotové práce k pull requestu

Ohlas na začátku: „Dokončuji práci ve větvi <název>.“

Spuštěním dokončení tvůrce práci odevzdává. Projdi všechny kroky bez ptaní a na konci mu dej krátké shrnutí a odkaz na pull request. Zastav se jen tehdy, když něco brání (neprošlé kontroly, nález, který nejde opravit, chybějící `origin`). Tvůrce **nezkoušej**, jestli změně rozumí.

## 1. Poznatky pro příště

Projdi, co se během práce stalo: opakovaná chyba agenta, zvláštnost dat (formát exportu, kódování, oddělovač), rozhodnutí tvůrce, které platí i dál, postup, který se osvědčil. Když je něco takového, zapiš jeden až tři krátké body do oddílu **Poznatky z vývoje** v `CLAUDE.md`, například „Export ze servisního systému má datum ve tvaru 17. 8. 2026“, a commitni je (`docs: poznatky z vývoje`). Příští relace je pak bude znát. Na konci je uveď ve shrnutí; když je tvůrce nechce, odeber je.

Nezapisuj nic, co platí jen pro tuhle jednu změnu, ani nic, co už v `CLAUDE.md` je.

## 2. Ověř

Spusť `pnpm check` (lint, typy, testy, sestavení, testy v prohlížeči; v PHP aplikaci `php tools/check.php`) a přečti výsledek (skill `overeni`). Ověřuje se přesně to, co odevzdáváš, i když kontroly prošly už na konci implementace.

- **Něco neprošlo** → zastav se, ukaž tvůrci, co selhalo, a pokračuj skillem `ladeni`. Pull request vzniká až po zelených kontrolách.
- **Plán:** pokud v `docs/plans/` je plán této větve s nezaškrtnutými kroky, pull request vytvoř jako koncept (`--draft`), nehotové kroky v něm vypiš a ve shrnutí řekni, co chybí (dodělá se příkazem `/jablotron:implementace`).
- `git status`: nic necommitnutého a nic, co do repozitáře nepatří (datové soubory, `.env`).

## 3. Nezávislá kontrola

- **S plánem:** kontrola celé větve proběhla na konci `/jablotron:implementace` (řádek `Závěrečná kontrola` v Průběhu). Pokud chybí, spusť ji podle toho skillu.
- **Drobná úprava bez plánu:** spusť agenta `jablotron:kontrola-vetve` s popisem změny, kritérii ze `SPEC.md`, kterých se týká, výchozím commitem větve a výsledkem všech kontrol (`pnpm check`, v PHP `php tools/check.php`). Kritické a důležité nálezy oprav s testem napřed, drobné uveď v pull requestu.

## 4. Bezpečnostní review

Vyžádej bezpečnostní review skillem `/jablotron:bezpecnostni-review`: změny dostane nezávislý recenzent (agent `bezpecnostni-recenzent`) a zkontroluje je podle OWASP Top 10:2025, ASVS, CWE, ISO 27001 a firemních pravidel. Nálezy vyhodnoť a oprav podle toho skillu:

- 🔴 **Kritické** → opravit (s testem napřed), pak kontrola opravy. Pull request nevznikne, dokud tu nějaký nález zůstává.
- 🟠 **Závažné** → opravit před pull requestem.
- 🟡 **Drobné** → zapsat do popisu pull requestu.

Po každé opravě znovu všechny kontroly (`pnpm check`, v PHP `php tools/check.php`).

## 5. Pull request

Pull request vytvoř bez dalšího ptaní. Výjimka: tvůrce při spuštění řekl, že ho zatím nechce („dokonči to, ale pull request ještě ne“). Pak tento krok a krok 7 vynech, větev zůstane, jak je, a tvůrce dostane jen shrnutí. Sloučení do `main` bez pull requestu není možné.

1. `git push -u origin <větev>`. Pokud repozitář nemá vzdálený `origin`, řekni tvůrci, že repozitář na GitHubu musí založit IT, dej mu shrnutí (krok 6) a tady skonči.
2. Popis podle šablony `.github/pull_request_template.md` (skill `vysvetli-zmenu`, část Popis pull requestu), anglicky. Navíc:
   - řádek **Plan:** odkaz na `docs/plans/<soubor>.md`, pokud existuje;
   - řádek **Agent decisions:** všechny řádky `Rozhodnutí:` z Průběhu plánu, přeložené do angličtiny. U drobné úpravy bez plánu rozhodnutí, která jsi během práce udělal sám, nebo „none“;
   - do oddílu **Notes** odložené drobnosti z Průběhu, z nezávislé kontroly a 🟡 nálezy z bezpečnostního review.
3. `gh pr create --title "<short English title, e.g. Add weekly complaints overview>" --body-file -` (s nehotovým plánem navíc `--draft`) a popis pošli na standardní vstup.

**Zahodit práci** jen tehdy, když o to tvůrce výslovně požádá. Napřed vypiš, co se smaže (větev, commity), a nech si to potvrdit napsáním slova `zahodit`. Teprve pak `git switch main` a `git branch -D <větev>`.

## 6. Shrň změnu

Spusť `/jablotron:vysvetli-zmenu` (část Krátké shrnutí) a k jeho výstupu přidej:

- odkaz na pull request (případně že je to koncept a co chybí);
- výsledek ověření a bezpečnostního review jednou větou („Kontroly prošly, bezpečnostní review bez kritických a závažných nálezů, dvě drobnosti jsou v pull requestu.“);
- zapsané poznatky z vývoje, pokud nějaké jsou.

Celé shrnutí má být na jednu obrazovku. Na nic se neptej. Na výsledek kontrol u pull requestu nečekej, stav dopiš, až doběhnou (krok 7).

## 7. Sleduj kontroly

Kontroly trvají několik minut (je-li zapnuté AI review na GitHubu, to až kolem dvaceti). Spusť `gh pr checks --watch` na pozadí, nebo se na stav po chvíli ptej příkazem `gh pr checks`.

- **Červená kontrola** → `ladeni`. Kontrolu nikdy nevypínej ani neobcházej.
- **Komentáře z review** → `/jablotron:pripominky`.
- **Všechno zelené** → řekni tvůrci, co bude dál: vyřešit případné konverzace, u aplikací L2 počkat na schválení recenzenta a pak na GitHubu kliknout **Squash and merge**.

## Varovné myšlenky

| Když si říkáš | Ve skutečnosti |
|---|---|
| „Testy prošly někdy během práce.“ | Zelený běh dokazuje jen stav, ve kterém běžel. Spusť je na tom, co odevzdáváš. |
| „Je to drobnost, nezávislá kontrola je zbytečná.“ | Pravidlo 6 platí pro každou změnu. U drobnosti je kontrola rychlá. |
| „Zeptám se ještě, jestli má vzniknout pull request.“ | Spuštěním dokončení ho tvůrce chce. Ptej se, jen když něco brání. |
| „Ověřím, jestli tvůrce změně rozumí.“ | Tvůrce se nezkouší. Dostane krátké shrnutí a může se zeptat sám. |
| „Push byl odmítnutý, pomůže force push.“ | Odmítnutý push znamená, že se větev na serveru změnila. Zjisti proč. Force push je zakázaný. |
