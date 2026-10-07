# Postup práce s agentem

Každá změna aplikace prochází stejnou cestou. Skills pluginu `jablotron` ji vedou krok za krokem a spouštějí se samy, když se na situaci hodí. Tvůrce je může vyvolat i příkazem.

```
nápad → specifikace → plán → implementace → dokončení → pull request → připomínky
         (zadání)     (docs/plans)  (testy napřed,     (review,
                                     kontrola větve)    shrnutí)
```

## Pravidlo pro agenta

**Když se na situaci hodí některý skill `jablotron`, použij ho dřív, než odpovíš nebo cokoli uděláš**, i kdyby šlo jen o upřesňující otázku. Pokud se po načtení ukáže, že se nehodí, nemusíš podle něj postupovat. Ani „jednoduchá“ změna není výjimka: drobná úprava má jen kratší cestu, ne žádnou.

| Situace | Skill |
|---|---|
| Tvůrce chce něco nového, jinak, víc nebo méně („přidej“, „změň“, „chtěl bych“, „dá se…?“) | `specifikace` určí cestu: zkouška, drobná úprava, nebo nová funkce |
| Specifikace je schválená a chybí plán | `plan` |
| Existuje schválený nebo rozpracovaný plán v `docs/plans/` | `implementace` |
| Píšeš kód funkce nebo opravy | `testy-napred` |
| Chyba, neprocházející test, červená kontrola, „nefunguje to“ | `ladeni` (oprava chyby v hotové aplikaci pak jde jako drobná úprava) |
| Chystáš se říct „hotovo“, „funguje“, „prošlo“ | `overeni` |
| Práce je hotová a má jít ke kontrole | `dokonceni` |
| Kontrola bezpečnosti změn nebo celé aplikace („je to bezpečné?“) | `bezpecnostni-review` |
| V pull requestu jsou připomínky z review | `pripominky` |
| Vzhled, texty a komponenty rozhraní | `firemni-identita` |
| Předání aplikace jinému člověku | `predani-projektu` |
| Tvůrce chce aplikaci spustit pro kolegy | nabídni mu příkaz `/jablotron:nasazeni` (spouští ho jen tvůrce) |

Specifikací se rozumí `SPEC.md` a části v `docs/spec/`, na které odkazuje (u větší aplikace). Plán pro novou funkci patří do souboru přes `/jablotron:plan`, ne do režimu Plan v Claude Code. Soubor přežije konec relace a navážete na něj i druhý den. **Schválený plán je souhlasem tvůrce se všemi jeho úkoly**: mezi úkoly se neptej, zastav se u každého kritéria hotového řešení.

## Konverzace a kontext

- **Nová funkce, nová konverzace.** Po schválení plánu doporuč tvůrci stavět v nové konverzaci. Specifikace, plán a jeho Průběh nesou všechno potřebné.
- **Když tě tvůrce už dvakrát opravil, protože jsi nepochopil, co chce,** navrhni novou konverzaci. Napiš mu zpřesněné zadání jako text, který do ní vloží; u rozpracovaného plánu ho zapiš i do Průběhu. Nahromaděné nepovedené pokusy zhoršují výsledky. Chyba v aplikaci se řeší skillem `ladeni`.
- **Po zhuštění konverzace** (compaction) znovu načti skill pluginu `jablotron`, podle kterého pracuješ (například `/jablotron:implementace`), jeho plné znění se nemusí zachovat. Stav práce ověř v souborech (plán a Průběh, `git log`), ne jen ve shrnutí, a hotové kroky neopakuj.

## Varovné myšlenky

| Když si říkáš | Ve skutečnosti |
|---|---|
| „Tohle je tak jednoduché, že to nepotřebuje návrh.“ | I drobná úprava má krátký návrh a souhlas tvůrce. |
| „Napíšu kód a test doplním potom.“ | Test, který nikdy neselhal, nic nedokazuje. Nejdřív test. |
| „Mělo by to fungovat.“ | Spusť ověření a ukaž výsledek. |
| „Zkusím ještě jednu opravu.“ (po dvou nezdarech) | Zastav se a hledej příčinu (`ladeni`). Po třech nezdarech to řekni tvůrci. |
| „Tvůrce to v kódu stejně nepozná.“ | Právě proto musí každý krok dokázat test a nezávislá kontrola. |
| „Zeptám se, jestli mám pokračovat.“ (uprostřed plánu) | Mezi úkoly se neptej. Zastav se u kritéria hotového řešení, ať si ho tvůrce vyzkouší. |

Pokud jsi subagent s konkrétním úkolem, řiď se zadáním úkolu. Tahle mapa je pro hlavní konverzaci s tvůrcem.
