# Plán: <název funkce>

> **Pro agenta:** plán prováděj skillem `/jablotron:implementace` úkol po úkolu. Kroky mají zaškrtávací políčka `- [ ]`. Průběh a rozhodnutí zapisuj do oddílu Průběh na konci.

<!-- Šablona uvádí příkazy a vzory aplikace Next.js. V PHP aplikaci pro JBT Platform je při psaní plánu nahraď obdobami z jejího CLAUDE.md: php tools/test.php "KH-1:", php tools/check.php, POST s polem _csrf → require_role → kontrola vstupu → transakce → audit(), import přes public/app/import.php, formáty z public/app/format.php. -->

## Pro tvůrce

**Co vznikne:** <jedna až tři věty z pohledu uživatele>

**Zvolené řešení:** <varianta, kterou jste vybrali ve specifikaci, jednou větou>. Zvažovali jsme: <B – proč ne>; <C – proč ne>.

**Kritéria hotového řešení:** KH-1 <krátce>, KH-2 <krátce>

**Pořadí a co si vyzkoušíte:**

1. <po prvním bloku: co bude hotové a co si vyzkoušíte>
2. <…>

**Co se teď dělat nebude:** <z oddílu Mimo rozsah, co by se dalo čekat>

**Na co se vás zeptám:** <nic / rozhodnutí, která agent neudělá sám>

---

**Cíl:** <jedna věta>
**Přístup:** <dvě až tři věty: jak to bude postavené>
**Specifikace:** `SPEC.md`, kritéria <KH-…>
**Režim provedení:** sám | se subagenty – <proč: počet úkolů, závislosti>

## Globální omezení

- Stack a vzory podle `CLAUDE.md`. Žádná nová knihovna.
- Serverové akce: `vyzadujRoli(...)` → kontrola schématem zod → zápis v transakci → `zapisAudit(...)`.
- Import jen přes `src/lib/import/` (`prectiSoubor`, `validujRadky`, `sloupceSOsobnimiUdaji`).
- České texty a formáty přes `src/lib/format.ts`.
- Jen fiktivní data.
- <hodnoty ze specifikace doslova: limity, texty hlášek, názvy rolí>

## Na co si dát pozor

- <vstup nebo situace> → <co má uživatel zažít> (test `<název>` v úkolu N)

## Soubory

| Soubor | Nový / úprava | Za co odpovídá |
|---|---|---|
| `src/…` | nový | … |

---

## KH-1: <znění kritéria>

### Úkol 1: <název>

**Soubory:** vytvořit `…`, upravit `…`, test `…`
**Rozhraní:** používá <co z dřívějších úkolů, přesné signatury>; poskytuje `nazevFunkce(vstup: Typ): Navrat`

- [ ] **Krok 1: Napiš test, který selže**

```ts
test("KH-1: …", async ({ page }) => {
  // přesné hodnoty ze specifikace
});
```

- [ ] **Krok 2: Ověř, že test selže**
Spusť: `pnpm test:e2e -g "KH-1:"`
Očekáváno: FAIL, protože <stránka / funkce ještě neexistuje>

- [ ] **Krok 3: Implementuj `nazevFunkce(vstup: Typ): Navrat` v `src/…`**
<jedna věta k přístupu, pokud signatura a test nechávají volbu>

- [ ] **Krok 4: Ověř, že test projde**
Spusť: `pnpm test:e2e -g "KH-1:"` a `pnpm test`
Očekáváno: PASS, žádné chyby ani varování

- [ ] **Krok 5: Commit**
`git add <soubory úkolu>` a `git commit -m "feat: …"` (zpráva anglicky)

### Kontrola s tvůrcem (KH-1)

Agent spustí aplikaci a otevře náhled.

1. <kam kliknout, který fiktivní soubor nahrát>
2. Má být vidět: <konkrétně, s čísly>

---

## Průběh

<!-- Agent sem zapisuje po každém úkolu, jeden bod na řádek. Nemazat. Vzory:
- Plán schválen tvůrcem: <RRRR-MM-DD>
- Předběžná kontrola: <bez rozporů | co se upravilo>
- Úkol <N>: hotovo (commity <od>..<do>, testy: pnpm test → <x>/<x>, kontrola čistá)
- Úkol <N>: oprava <R>/3 (<kolik> opraveno, <kolik> zbývá; commity <od>..<do>)
- Úkol <N>: drobnost (odloženo): <co>
- Rozhodnutí: <co> – <proč> – <co to stojí, když je špatně>
- KH-<n>: tvůrce ověřil
- Závěrečná kontrola: <verdikt>; opraveno: <co nebo nic>; drobnost (odloženo): <co nebo nic> -->
