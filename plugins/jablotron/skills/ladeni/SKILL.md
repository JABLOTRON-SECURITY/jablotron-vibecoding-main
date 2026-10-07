---
name: ladeni
description: Použij u každé chyby, neprocházejícího testu, červené kontroly v pull requestu nebo když tvůrce řekne „nefunguje to“, dřív než navrhneš jakoukoli opravu.
when_to_use: „nefunguje to“, „hází to chybu“, „spadl test“, „kontrola je červená“, „pořád to nejde“, chybová hláška v terminálu nebo v prohlížeči.
argument-hint: "[popis chyby]"
---

# Ladění: nejdřív příčina

Náhodné opravy ztrácejí čas a přidávají nové chyby. Tvůrce nepozná, jestli oprava řeší příčinu, nebo jen zakrývá příznak. Proto vždy nejdřív najdi příčinu.

Popis od tvůrce: $ARGUMENTS

## Železné pravidlo

```
ŽÁDNÁ OPRAVA BEZ HLEDÁNÍ PŘÍČINY
```

Dokud neprojdeš fázi 1, opravu nenavrhuj. Platí to hlavně ve spěchu, když se oprava zdá jasná a když už jedna oprava nezabrala.

## Fáze 1: příčina

1. **Přečti celou chybu.** Celé hlášení, číslo řádku, soubor. Kde ji najdeš:
   - terminál, ve kterém běží `pnpm dev` (v PHP aplikaci `php tools/server.php`) nebo testy,
   - konzole prohlížeče v náhledu aplikace,
   - kontroly pull requestu: `gh pr checks`, pak `gh run view <id> --log-failed`.
2. **Zopakuj ji.** Přesné kroky, vždy s fiktivními daty. Od tvůrce zjisti po jedné otázce, co přesně udělal a co viděl (snímek obrazovky pomůže). **Nikdy si neříkej o skutečný soubor ani skutečná data.** Ať popíše sloupce, fiktivní vzorek vyrobíš. Když chybu zopakovat nejde, sbírej další informace, nehádej.
3. **Co se změnilo?** `git log --oneline -10`, `git diff`, nové knihovny, změněná konfigurace.
4. **Sleduj data.** Kde vzniká chybná hodnota? U importu typicky soubor → `prectiSoubor` → `validujRadky` → zápis do databáze → stránka. Postupuj proti proudu až k místu, kde se hodnota pokazí. Oprav tam, ne na konci.

## Fáze 2: vzor

- Najdi v projektu podobné místo, které funguje (ukázka v šabloně, jiná stránka, jiná akce).
- Porovnej je řádek po řádku a sepiš každý rozdíl, i když se zdá nepodstatný.

## Fáze 3: hypotéza

- Napiš jednu hypotézu: „Myslím, že příčina je X, protože Y.“
- Ověř ji nejmenší možnou změnou, vždy jen jednou proměnnou naráz.
- Nevyšlo to? Novou hypotézu, ne další opravu navrch.
- Nevíš? Řekni „tomuhle nerozumím“ a hledej dál. Nepředstírej.

## Fáze 4: oprava

**Chyba v hotové aplikaci** (ne v rozpracovaném úkolu plánu) se opravuje jako drobná úprava podle skillu `specifikace`: řekni tvůrci příčinu, navrhni opravu a počkej na souhlas, případně doplň kritérium do `SPEC.md`. Po opravě si ji tvůrce vyzkouší. Pak nabídni `/jablotron:dokonceni` („Můžeme to dokončit a poslat ke kontrole?“) a počkej na odpověď.

1. **Test, který chybu zopakuje a selže** (skill `testy-napred`). Bez něj se neopravuje.
2. **Jedna oprava v místě příčiny.** Žádné „když už jsem tady“ úpravy.
3. **Ověř** (skill `overeni`): nový test prochází, ostatní taky, původní příznak zmizel.
4. **Tvůrci jednou dvěma větami řekni, co bylo příčinou** a jak je oprava pojištěná testem.

## Tři neúspěšné opravy = stop

Když nezabrala oprava, vrať se do fáze 1. Po **třetí** neúspěšné opravě další nezkoušej. Problém je nejspíš v návrhu, ne v detailu: každá oprava odhalí nový problém jinde nebo by vyžadovala velkou přestavbu.

Zastav se a řekni tvůrci srozumitelně:

- co jste zkoušeli a co jste zjistili,
- že problém je pravděpodobně v přístupu, ne v drobnosti,
- co navrhuješ: vrátit se k plánu nebo specifikaci a zjednodušit, zvolit jinou variantu, nebo se poradit se správcem.

## Nikdy neopravuj tak, že

- vypneš, přeskočíš nebo oslabíš test či kontrolu,
- chybu odchytíš a zahodíš,
- prodloužíš čekání v testu „aby to prošlo“, místo abys čekal na konkrétní stav stránky,
- změníš očekávanou hodnotu v testu podle chybného výsledku.

## Varovné myšlenky

| Když si říkáš | Ve skutečnosti |
|---|---|
| „Rychle to opravím a příčinu dohledám potom.“ | První oprava určí směr. Udělej to hned pořádně. |
| „Zkusím změnit X, uvidíme.“ | Nejdřív hypotéza, pak nejmenší test. |
| „Udělám víc změn najednou, ušetřím čas.“ | Nepoznáš, co zabralo, a přidáš nové chyby. |
| „Vidím problém, opravím ho.“ | Vidět příznak neznamená znát příčinu. |
| „Ještě jeden pokus.“ (po dvou nezdarech) | Po třech nezdarech je chyba v přístupu. Zastav se. |
| „Test je zbytečný, ověřím to ručně.“ | Oprava bez testu nevydrží. |
