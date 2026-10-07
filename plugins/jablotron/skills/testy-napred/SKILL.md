---
name: testy-napred
description: Použij při implementaci jakékoli funkce, opravy chyby nebo změny chování v aplikaci ze šablony Jablotron, dřív než napíšeš kód.
user-invocable: false
---

# Testy napřed

Napiš test. Sleduj, jak selže. Napiš nejmenší kód, který ho splní.

**Když jsi neviděl test selhat, nevíš, jestli testuje správnou věc.** Tvůrce kód nečte, takže testy jsou jeho jistota, že aplikace dělá, co má.

## Železné pravidlo

```
ŽÁDNÝ KÓD FUNKCE BEZ TESTU, KTERÝ PŘEDTÍM SELHAL
```

Napsal jsi kód dřív než test? Smaž ho a začni testem. Nenechávej si ho „pro inspiraci“ a neupravuj ho podle testu. Smazat znamená smazat.

**Výjimky** (bez testu napřed, ale `pnpm check` musí projít): čistě vzhled a texty bez logiky (barvy, rozložení, popisky), konfigurace, kterou nejde rozumně testovat, generované soubory (migrace z `pnpm db:generate`, komponenty shadcn/ui; migrace v PHP aplikaci se píší ručně, výjimka pro ně neplatí – ověří je test, který na nové tabulce stojí). O výjimce rozhoduješ sám a zmíníš ji v commitu. „Je to jednoduché“ výjimka není.

## Cyklus

1. **ČERVENÁ: napiš jeden test.** Jedno chování, jasný název, skutečný kód.
2. **Ověř, že selže.** Povinné, nikdy nepřeskakuj. Selhat musí proto, že funkce ještě chybí: neodpovídající hodnota, `… is not a function`, modul, který teprve vznikne, chybějící prvek nebo stránka (404). Špatný důvod je překlep (i v cestě importu), chyba v testu samotném nebo chybějící testovací data. U testu v prohlížeči se podívej do snímku stránky v `test-results/…/error-context.md`, jestli stránka opravdu vypadá tak, jak čekáš. Projde test hned? Testuješ něco, co už existuje. Oprav test.
3. **ZELENÁ: nejmenší kód.** Jen tolik, aby test prošel. Žádné parametry „pro budoucnost“, žádné úpravy jiného kódu.
4. **Ověř, že projde.** Povinné. Projde nový test a projdou i ostatní: před commitem vždy `pnpm test`, u stránek i `pnpm test:e2e -g "KH-n:"`. Výstup bez chyb a varování. Neprochází? Oprav kód, ne test.
5. **ÚKLID.** Až po zelené: duplicity, názvy, pomocné funkce. Testy zůstávají zelené, chování se nemění.

Další chování = další červený test.

## Jak se testuje v šabloně

| Co | Nástroj | Kde | Spuštění |
|---|---|---|---|
| Kritérium hotového řešení, chování stránky, oprávnění v rozhraní | Playwright | `tests/e2e/<oblast>.spec.ts`, název „KH-n: …“ | `pnpm test:e2e -g "KH-1:"` |
| Logika v `src/lib/` (výpočty, převody, kontrola dat, import) | Vitest | `tests/unit/<oblast>.test.ts` | `pnpm test tests/unit/<oblast>.test.ts` |

V PHP aplikaci pro JBT Platform (má `public/app/gate.php`) platí: kritéria v `tests/criteria/<oblast>.php` s `Browser` (`php tools/test.php "KH-1:"`), logika z `public/app/` v `tests/unit/<oblast>.php` (`php tools/test.php --unit`), před commitem `php tools/test.php`, data připraví `upload_file` z `tests/helpers.php`, fiktivní soubory jsou v `tests/data/`, test čtenáře má `role: 'reader'`. Obdoby dalších příkazů: [sablony.md](${CLAUDE_PLUGIN_ROOT}/reference/sablony.md).

- **Každý test je samostatný.** Data si připraví sám (Next.js `nahrajSoubor` z `tests/e2e/pomocnici.ts`, PHP `upload_file` z `tests/helpers.php`) a nespoléhá na to, co nahrál jiný test. Jen tak jde spustit jeden test bez ostatních.
- **Skutečný kód, ne napodobeniny.** Databáze v testech je už nastavená (Next.js MySQL s prázdnou testovací databází, PHP SQLite v dočasné složce). Nenahrazuj ji falešnými objekty.
- **Přesné hodnoty ze specifikace:** počty, texty hlášek, formáty („93 reklamací“, „1 234,50 Kč“).
- **Fiktivní data** pro testy patří do `tests/e2e/fixtures/` (PHP: `tests/data/`). Nikdy skutečná data.
- **Oprávnění:** test s rolí, která akci smí, i s rolí, která ji nesmí. Next.js: instance jen s rolí čtenáře běží na `URL_CTENARE` z `tests/e2e/adresy.ts`, vzor je v existujících testech (`test.describe("čtenář", …)`). PHP: test s parametrem `role: 'reader'`, vzor v `tests/criteria/zaklad.php`.
- Testy nikdy nepřeskakuj ani neoslabuj (`.skip`, `.only`, mírnější očekávání, delší timeout „aby to prošlo“). Kontrola v CI to stejně zastaví.

## Dobrý test

| | Dobře | Špatně |
|---|---|---|
| **Jedna věc** | „KH-2: export se jménem zákazníka se odmítne“ | „import funguje a validuje a ukládá“ |
| **Jasný název** | Název popisuje chování | `test("test1")` |
| **Ukazuje záměr** | Ukazuje, jak se má funkce používat | Zkoumá vnitřnosti |

Než test napíšeš, umíš říct, která změna v kódu by ho shodila? Když ne, test nic nehlídá.

## Oprava chyby

Chyba se nejdřív zopakuje testem, který selže. Pak oprava. Test dokazuje, že oprava funguje, a hlídá, aby se chyba nevrátila. Hledání příčiny popisuje skill `ladeni`.

## Varovné signály: zastav se a začni znovu

- kód dřív než test,
- test, který prošel hned napoprvé,
- neumíš vysvětlit, proč test selhal,
- „test doplním potom“,
- „už jsem to vyzkoušel ručně“,
- „jen tentokrát“, „tohle je jiný případ“.

## Časté výmluvy

| Výmluva | Ve skutečnosti |
|---|---|
| „Je to moc jednoduché na test.“ | Jednoduchý kód se taky rozbije. Test zabere půl minuty. |
| „Test napíšu potom.“ | Test psaný po kódu projde hned, takže nic nedokazuje. |
| „Ručně jsem to vyzkoušel.“ | Ruční zkouška nejde zopakovat a nehlídá budoucí změny. |
| „Smazat hodinu práce je škoda.“ | Čas je pryč tak jako tak. Kód, kterému nejde věřit, je větší škoda. |
| „Test je těžké napsat.“ | Těžko testovatelný kód je těžko použitelný. Zjednoduš návrh. |

## Na konec

- [ ] Každá nová funkce má test
- [ ] Každý test jsem viděl selhat ze správného důvodu
- [ ] Napsal jsem jen tolik kódu, kolik test potřeboval
- [ ] Všechny testy prošly a výstup je čistý
- [ ] Testy používají skutečný kód a fiktivní data
