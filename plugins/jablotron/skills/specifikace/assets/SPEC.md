# Specifikace aplikace

> Specifikace popisuje, **co** má aplikace umět a **kdy je hotovo**. Píše se před prvním promptem a mění se spolu s kódem: každá nová funkce začíná úpravou tohoto souboru. Když kritérií přibude víc než zhruba 15 nebo má aplikace samostatné části, popis částí se přesune do `docs/spec/<oblast>.md` a tady zůstane přehled s odkazy.

## Problém

DOPLNIT – co dnes nefunguje nebo stojí zbytečně času. Konkrétně, ideálně s příkladem z praxe.

## Uživatelé a role

| Role | Kdo to je | Co smí |
|---|---|---|
| `ctenar` | DOPLNIT | Prohlížet přehledy |
| `editor` | DOPLNIT | Importovat a upravovat data |
| `spravce` | DOPLNIT | Vše včetně záznamů o akcích |

V PHP aplikaci se role v kódu jmenují `reader`, `editor` a `admin`.

## Co aplikace umí

- Jako DOPLNIT chci DOPLNIT, abych DOPLNIT.

## Co aplikace nesmí

- Nepřipojuje se přímo na žádný firemní systém. Data přicházejí jen ručním exportem.
- DOPLNIT

## Data

Pouze popis údajů a fiktivní příklady. **Žádná skutečná data.**

| Údaj | Typ | Třída dat | Zdroj | Povinný | Fiktivní příklad |
|---|---|---|---|---|---|
| DOPLNIT | text / číslo / datum | interní | ruční export | ano | DOPLNIT |

## Řešení

DOPLNIT – jak aplikace problém řeší, jednou dvěma větami. S každou novou funkcí se upraví, aby odpovídal současnému stavu. Zvažované varianty jednotlivých funkcí jsou v jejich plánech v `docs/plans/`.

## Obrazovky

1. DOPLNIT – co na ní uživatel vidí a co může udělat.

## Chybové stavy

| Situace | Co uživatel uvidí |
|---|---|
| Soubor s chybným nebo chybějícím údajem | Seznam chyb s čísly řádků, neuloží se nic |
| Soubor se sloupcem s osobními údaji | Odmítnutí s vysvětlením, neuloží se nic |
| Uživatel bez potřebné role | Hláška, že na akci nemá oprávnění |
| DOPLNIT | DOPLNIT |

## Kritéria hotového řešení

Každé kritérium musí jít ověřit automatickým testem.

- **KH-1:** Když DOPLNIT, pak DOPLNIT.

## Mimo rozsah

Co se v této verzi dělat nebude:

- DOPLNIT

## Otevřené otázky

- DOPLNIT

## Historie změn

| Datum | Změna | Kdo |
|---|---|---|
| DOPLNIT | První verze specifikace | DOPLNIT |
