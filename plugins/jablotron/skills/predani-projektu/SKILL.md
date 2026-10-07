---
name: predani-projektu
description: Použij při změně vlastníka nebo tvůrce aplikace, když tvůrce odchází, před čtvrtletní revizí a před spuštěním, kdy má aplikaci umět převzít někdo jiný.
when_to_use: „předávám aplikaci“, „odcházím“, „přebírá to kolega“, „připrav to k převzetí“, „blíží se revize“, „aktualizuj README“.
---

# Předání projektu

Cíl: **aplikaci podle README spustí a pochopí člověk, který ji nikdy neviděl.** Žádná aplikace nesmí zůstat bez odpovědné osoby: bez nástupce se vyřazuje.

## 1. Zjisti stav

Přečti `CHARTA.md`, `SPEC.md`, `README.md`, `docs/podminky-spusteni.md`, `package.json` a projdi strukturu `src/`. Spusť `pnpm outdated` a `git log --oneline -15`. V PHP aplikaci pro JBT Platform místo `package.json` a `src/` projdi `public/` a `.github/workflows/deploy.yml` a místo `pnpm outdated` porovnej `public/ipguard.php`, `public/auth-guard.php` a `public/assets/starter.css` s aktuální šablonou v repu jbtplatform.cz.

## 2. Zkontroluj chartu

- Jsou vyplnění věcný vlastník, zástupce, tvůrce a správce provozu? Jsou to stále aktuální lidé?
- Odpovídá úroveň rizika tomu, co aplikace dnes dělá (data, uživatelé, dopad chyby)? Řiď se [úrovněmi rizika](${CLAUDE_PLUGIN_ROOT}/reference/urovne-rizika.md).
- Je `pristi_revize` v budoucnosti? Pokud ne, upozorni, že revize je po termínu.
- Při předání zapiš do historie změn charty, kdo aplikaci přebírá a kdy. Pokud nástupce není, napiš to tvůrci jasně: aplikace se má vyřadit.

## 3. Doplň README

README musí obsahovat tyto oddíly. Co chybí, doplň; co neodpovídá skutečnosti, oprav. Piš pro neprogramátora.

1. **K čemu aplikace je** – dvě věty, odkaz na chartu a specifikaci.
2. **Jak ji spustit u sebe** – přesné příkazy od klonování po otevření v prohlížeči. Ověř je.
3. **Jak je aplikace uspořádaná** – hlavní složky a k čemu slouží, nejvýš deset řádků.
4. **Data** – odkud přicházejí, jak se importují, kde je fiktivní ukázka.
5. **Role a oprávnění** – kdo co smí.
6. **Testy a kontroly** – jak je spustit, co hlídají.
7. **Známá omezení a otevřené úkoly** – co nefunguje nebo chybí, s odkazy na issues.
8. **Kontakty** – vlastník, zástupce, tvůrce, správce provozu, kontakt pro incidenty.

## 4. Zkontroluj zbytek

- `docs/podminky-spusteni.md`: které body nejsou splněné?
- Závislosti: které jsou zastaralé, zejména s bezpečnostními opravami? Jsou otevřené pull requesty od Dependabotu?
- V kódu: zbytky `TODO`, `FIXME`, zakomentovaný kód, ladicí výpisy.

## 5. Výstup

Shrň tvůrci česky:

```
## Připravenost k předání

**Stav:** ✅ Připraveno | ⚠️ Chybí X věcí | ⛔ Nelze předat (chybí nástupce)

### Doplnil jsem
- …

### Chybí a musí doplnit člověk
- [ ] … (kdo by to měl udělat)

### Doporučení
- …
```

Změny v README a chartě udělej ve větvi `handover/<RRRR-MM-DD>` a nabídni pull request.
