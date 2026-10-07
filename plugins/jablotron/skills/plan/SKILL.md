---
name: plan
description: Použij, když je SPEC.md schválená a má vzniknout nová funkce nebo aplikace, než se začne psát kód, který má víc než pár kroků.
when_to_use: „naplánuj to“, „připrav plán“, „jak to uděláš?“, po dokončení /jablotron:specifikace, před /jablotron:implementace.
argument-hint: "[kritéria nebo funkce, např. KH-1 a KH-2]"
---

# Plán: od specifikace k úkolům

Ohlas na začátku: „Připravuji implementační plán.“

Plán čtou dva lidé. **Tvůrce** čte jen část „Pro tvůrce“ nahoře: co vznikne, v jakém pořadí a co si bude zkoušet. **Agent**, který plán provede, čte zbytek. Představ si ho jako schopného vývojáře, který tenhle projekt ani specifikaci nikdy neviděl. Napíše dobrý TypeScript, jakmile zná přesné rozhraní a přesný test, a kde mu plán nechá volbu, rozumně se rozhodne. Nemůže ale vědět, co jste se rozhodli vy: které soubory, jaké názvy a signatury, jaké hodnoty ze specifikace, které testy co dokazují. **To zapiš.** Malé úkoly, testy napřed, časté commity, nic navíc.

Rozsah: $ARGUMENTS

## Než začneš

- Přečti `SPEC.md` (u rozdělené specifikace i soubor oblasti v `docs/spec/`, na který odkazuje), `CHARTA.md` a `CLAUDE.md` a projdi kód, kterého se plán týká (`src/app/`, `src/lib/`, `tests/`; v PHP aplikaci `public/`, `public/app/`, `tests/`). Pokud specifikace obsahuje „DOPLNIT“ nebo ji tvůrce ještě neschválil, vrať se k `/jablotron:specifikace`.
- Ulož plán do `docs/plans/RRRR-MM-DD-<short-name>.md`: dnešní datum a krátký anglický název (`2026-10-07-weekly-overview.md`). Obsah plánu je česky. Použij [šablonu plánu](${CLAUDE_SKILL_DIR}/sablona-planu.md).
- Pracuj ve stejné větvi jako specifikace. Pokud jsi v `main`, založ `feature/<short-name>` (anglicky, jako commity a pull request).

## Rozsah plánu

Jeden plán = jeden ucelený výsledek, který jde samostatně vyzkoušet, obvykle jedno až čtyři kritéria hotového řešení. Pokud tvůrce určil kritéria výše, plánuj jen je. Pokud specifikace obsahuje nezávislé celky, navrhni pro každý vlastní plán.

## Zvolené řešení

Do části „Pro tvůrce“ zapiš variantu, kterou tvůrce vybral ve specifikaci, a zvažované varianty s jednou větou, proč ne. Plán je místo, kde rozhodnutí o této funkci zůstane: `SPEC.md` popisuje jen, jak aplikace funguje teď. Pokud varianty v konverzaci nemáš (plán vzniká v jiné konverzaci než specifikace), převezmi řešení z oddílu Řešení ve `SPEC.md` a zvažované varianty vynech. Nevymýšlej je.

## Struktura souborů

Než napíšeš úkoly, sepiš, které soubory vzniknou nebo se změní a za co každý odpovídá. Tady se rozhoduje o rozdělení práce.

- Drž se vzorů šablony z `CLAUDE.md`: stránka v `src/app/<oblast>/page.tsx`, serverová akce v `akce.ts` vedle ní, logika v `src/lib/<oblast>.ts`, schéma v `src/lib/db/schema.ts` a migrace v `drizzle/`, testy v `tests/unit/` a `tests/e2e/`. V PHP aplikaci platí vzory z jejího `CLAUDE.md` (obdoby obou šablon: [sablony.md](${CLAUDE_PLUGIN_ROOT}/reference/sablony.md)).
- Každý soubor má jednu jasnou odpovědnost. Raději menší soubory než jeden velký.
- Co se mění spolu, patří k sobě. Děl podle funkce, ne podle technické vrstvy.

## Velikost úkolu

Úkol je nejmenší celek, který má vlastní test a o kterém by kontrola mohla samostatně rozhodnout, že ho přijme nebo vrátí. Přípravu, konfiguraci, migraci a dokumentaci přidej k úkolu, který je potřebuje. Každý úkol končí ověřitelným výsledkem a commitem. Obvyklý plán má dva až šest úkolů.

Úkoly seskup pod kritéria hotového řešení (`## KH-1: …`). Za posledním úkolem každého kritéria je blok **Kontrola s tvůrcem**.

## Kroky v úkolu

Každý krok je jedna akce s ověřitelným výsledkem:

1. Napiš test, který selže.
2. Spusť ho a ověř, že selže ze správného důvodu.
3. Napiš nejmenší kód, který test splní.
4. Spusť test a ověř, že projde.
5. Commit.

Co který krok obsahuje:

- **Test:** název testu a jeho ověření (assertions) jako kód, s přesnými hodnotami ze specifikace (počty, texty hlášek).
- **Kód:** přesná signatura (název, parametry, návratový typ), soubor a hodnoty, které specifikace určuje. Tělo funkce napiš jen tehdy, když ho neurčuje signatura s testem (algoritmus), nebo jde o přesné texty pro uživatele.
- **Ověření:** příkaz a výstup, který znamená úspěch (`Očekáváno: …`).
- **Odkaz na jiný úkol:** přes blok Rozhraní toho úkolu, kód se neopakuje.

Plán je souhrn rozhodnutí, která agent neudělá sám. Plán delší než kód, který popisuje, už kód napsal. Řádky, které nic nerozhodují („ošetři chyby“, „přidej validaci“, „napiš testy“, funkce, kterou žádný úkol nedefinuje), jsou opačná chyba.

## Testy v aplikacích ze šablony

| Co | Kde | Spuštění |
|---|---|---|
| Kritérium hotového řešení, chování stránky | `tests/e2e/<oblast>.spec.ts`, název testu začíná „KH-n: …“ | `pnpm test:e2e -g "KH-1:"` |
| Logika v `src/lib/` (výpočty, převody, kontrola dat) | `tests/unit/<oblast>.test.ts` | `pnpm test tests/unit/<oblast>.test.ts` |
| Všechno najednou (lint, typy, testy, sestavení, prohlížeč) | | `pnpm check` |

V PHP aplikaci pro JBT Platform (má `public/app/gate.php`): kritéria v `tests/criteria/<oblast>.php` (`php tools/test.php "KH-1:"`), logika z `public/app/` v `tests/unit/<oblast>.php` (`php tools/test.php --unit`), všechno `php tools/check.php`; data připraví `upload_file` z `tests/helpers.php`, soubory patří do `tests/data/`. Ostatní obdoby v [sablony.md](${CLAUDE_PLUGIN_ROOT}/reference/sablony.md).

Next.js: databáze v testech je MySQL s prázdnými testovacími databázemi, testy si ji spouštějí samy. Databázi nenahrazuj falešnými objekty. Každý test si data připraví sám (`nahrajSoubor` z `tests/e2e/pomocnici.ts`), aby šel spustit samostatně. Fiktivní soubory pro testy patří do `tests/e2e/fixtures/`, ukázková data do `data/sample/`.

## Kontrola s tvůrcem

Za každým kritériem napiš pro tvůrce postup, jak si ho vyzkouší: kam kliknout, který fiktivní soubor nahrát a co má vidět. Aplikaci spustí agent. Bez odborných pojmů. Tohle je jeho kontrola: tvůrce nečte kód, kontroluje chování.

## Vlastní kontrola plánu

Po dopsání projdi plán proti specifikaci a chyby oprav rovnou:

1. **Pokrytí:** každé kritérium v rozsahu má úkol a test. Chybí? Doplň úkol.
2. **Kroky:** každý krok jde provést jen jedním rozumným způsobem a žádný neopisuje celý kód.
3. **Názvy:** funkce, typy a soubory v pozdějších úkolech odpovídají těm z dřívějších.
4. **Na co si dát pozor:** tři až pět vstupů nebo situací, o kterých specifikace mlčí, ale uživatele by potrápily (prázdný soubor, středníky a diakritika v CSV, duplicitní řádky, uživatel bez role, datum v jiném formátu, velmi dlouhý text). Každá má test v úkolu, kterého se týká. Mlčení specifikace není povolení, aby se aplikace rozbila.
5. **Pravidla šablony:** každá serverová akce má `vyzadujRoli`, kontrolu schématem zod a `zapisAudit`; import jde přes `src/lib/import/`. V PHP aplikaci: stránka začíná bránou a `require_role`, zápis je POST (pole `_csrf`) s `require_role` a `audit()`, import přes `public/app/import.php`, změna tabulek je nová migrace. Žádná nová knihovna; pokud je opravdu nutná, je v Globálních omezeních s důvodem a tvůrce o ní ví.
6. **Proporce:** plán několikrát delší než specifikace je přepis programu. Nahraď těla funkcí signaturami a testy.

## Předání tvůrci

1. Urči režim provedení: **do tří úkolů** udělá plán agent sám, **víc úkolů** po úkolech samostatní agenti s kontrolou po každém úkolu (spotřebuje víc limitu, ale je důkladnější). Zapiš režim do hlavičky plánu.
2. Řekni tvůrci například:

   > Plán je v `docs/plans/<soubor>.md`. Přečtěte si prosím jen část **Pro tvůrce** nahoře: co vznikne, v jakém pořadí a co budete zkoušet. Plán má N úkolů, takže ho udělám sám / s pomocí samostatných agentů. Po každém kritériu se zastavím, abyste si ho vyzkoušeli. Sedí to?

3. Počkej na souhlas. Připomínky zapracuj a znovu proveď vlastní kontrolu.
4. **Po souhlasu** zapiš do oddílu Průběh řádek `- Plán schválen tvůrcem: RRRR-MM-DD` a teprve pak plán commitni: `docs: plán <čeho>`. Bez tohoto řádku `implementace` nezačne. Schválený plán je souhlasem se všemi jeho úkoly, mezi úkoly se tvůrce znovu neptáš.
5. Doporuč tvůrci začít stavbu v nové konverzaci, například: „Plán je uložený. Stavbu doporučuji začít v nové konverzaci ve stejné složce, čistá konverzace dává lepší výsledky. Stačí tam napsat ‚pokračuj‘.“ Všechno potřebné je v plánu a nová relace ho najde sama. Když chce tvůrce pokračovat hned, pokračuj skillem `/jablotron:implementace`.
