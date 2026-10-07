---
name: overeni
description: Použij, když se chystáš říct, že je něco hotové, opravené, funkční nebo že testy prošly, a před každým commitem, pull requestem, přechodem na další úkol a předáním práce tvůrci.
user-invocable: false
---

# Ověření před „hotovo“

Tvůrce zpravidla není programátor a tvoje „hotovo“ si ověřit neumí. Proto musí každé tvrzení stát na čerstvém důkazu.

## Železné pravidlo

```
ŽÁDNÉ TVRZENÍ O DOKONČENÍ BEZ ČERSTVÉHO DŮKAZU
```

Pokud jsi ověřovací příkaz nespustil v této odpovědi, nemůžeš tvrdit, že prošel.

## Postup před každým tvrzením

1. **Urči**, který příkaz tvrzení dokazuje.
2. **Spusť** ho celý a znovu, ne z paměti.
3. **Přečti** celý výstup a návratový kód, spočítej selhání.
4. **Porovnej:** potvrzuje výstup tvrzení?
   - Ne → řekni skutečný stav i s důkazem.
   - Ano → řekni tvrzení i s důkazem.
5. **Teprve potom** to řekni.

## Co čím dokázat

| Tvrzení | Důkaz | Nestačí |
|---|---|---|
| Testy prošly | `pnpm test`, případně `pnpm test:e2e`: 0 selhání | dřívější běh, „mělo by projít“ |
| Je to v pořádku | `pnpm check` (lint, typy, testy, sestavení, prohlížeč) | jen lint, jen testy |
| Kritérium KH-n je splněné | `pnpm test:e2e -g "KH-n:"` prošel a tvůrce si ho vyzkoušel | „kód vypadá správně“ |

V PHP aplikaci pro JBT Platform: testy `php tools/test.php`, kritérium `php tools/test.php "KH-n:"`, všechno `php tools/check.php` (syntaxe, pravidla šablony, PHPStan, testy).
| Chyba je opravená | test, který chybu zopakoval, teď prochází, a původní příznak zmizel | „změnil jsem kód“ |
| Subagent úkol dokončil | `git log` a `git diff` ukazují změny, kontrola úkolu je čistá | hlášení „HOTOVO“ |
| Splněno podle specifikace | projitá kritéria v `SPEC.md` jedno po druhém | „testy prošly“ |

## Varovné signály

- slova „mělo by“, „asi“, „pravděpodobně“, „vypadá to“,
- radost před ověřením („Hotovo!“, „Skvělé!“, „Funguje!“),
- commit, push nebo pull request bez ověření,
- spoléhání na hlášení subagenta nebo na částečné ověření,
- „jen tentokrát“.

## Jak to říct tvůrci

Srozumitelně a s čísly:

- ✅ „Všechny kontroly prošly: 24 z 24 jednotkových testů, 6 z 6 testů v prohlížeči, sestavení bez chyb.“
- ✅ „Dva testy neprošly. Oba hlídají import s prázdným souborem, příčinu hledám.“
- ❌ „Mělo by to fungovat.“
- ❌ „Hotovo!“ (bez spuštěných kontrol)

Pravdivé „ještě to nefunguje“ je pro tvůrce cennější než nepravdivé „hotovo“.
