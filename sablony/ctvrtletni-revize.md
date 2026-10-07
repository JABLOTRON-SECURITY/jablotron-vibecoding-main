# Čtvrtletní revize aplikací

**Datum:** … · **Provedl:** správce provozu … · **Přítomni:** schvalovatel …, věcní vlastníci

Podklad: aktuální přehled z chart – `node nastaveni/app-overview.mjs <organizace>` vygeneruje `PREHLED-APLIKACI.md` včetně upozornění na revize po termínu, čekající aktualizace a repozitáře bez charty.

Pro každou aplikaci:

| Aplikace | Úroveň v chartě | Odpovídá skutečnosti? | Používá se? | Vlastník a zástupce aktuální? | Přístupy aktuální? | Otevřené bezpečnostní aktualizace | Rozhodnutí |
|---|---|---|---|---|---|---|---|
| | | ano / ne → nová úroveň | ano / ne (od kdy) | ano / ne | ano / ne | počet, nejstarší | ponechat / upravit / vyřadit |

## Kontrolní otázky

- Přibyly v aplikaci osobní údaje, noví uživatelé nebo lidé mimo firmu? → přezkoumat úroveň.
- Napojil někdo aplikaci na firemní systém? → okamžitě řešit, není povoleno.
- Je některá aplikace šest měsíců bez použití? → vyřadit.
- Jsou pull requesty od Dependabotu starší než dva týdny (kritické 72 hodin)? → urgovat vlastníka.
- Proběhlo u každé aplikace v provozu `/jablotron:bezpecnostni-review celá aplikace` bez kritických a závažných nálezů (zpráva v `docs/bezpecnost/`)?
- Je u všech aplikací nastavený nový termín revize (`pristi_revize` v chartě)?

## Úkoly z revize

| Úkol | Kdo | Do kdy |
|---|---|---|
| | | |
