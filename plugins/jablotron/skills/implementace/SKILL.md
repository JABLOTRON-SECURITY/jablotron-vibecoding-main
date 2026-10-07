---
name: implementace
description: Použij, když v docs/plans/ existuje schválený implementační plán a má se podle něj stavět, nebo když tvůrce chce pokračovat v rozpracovaném plánu.
when_to_use: „pusť se do toho“, „udělej to“, „pokračuj“, „jedeme“, po schválení plánu, rozpracovaný plán v docs/plans/.
argument-hint: "[cesta k plánu] [sám|subagenti]"
---

# Implementace podle plánu

Ohlas na začátku: „Provádím plán <soubor>.“

Plán už rozhodl. Proveď ho přesně, každý krok dokaž testem, který jsi viděl nejdřív selhat a pak projít, a průběžně zapisuj záznam. Ten pomůže, až si sám nebudeš pamatovat, co už je hotové: konverzace se může kdykoli zkrátit, soubor s plánem zůstane.

Zadání: $ARGUMENTS

## Kdy se zastavit

Schválený plán je souhlasem tvůrce se všemi jeho úkoly. Pracuj proto bez otázek typu „mám pokračovat?“. Zastav se jen v těchto případech:

1. **Kontrola s tvůrcem** po dokončení každého kritéria hotového řešení (viz níže). Je to záměr, ne zdržování.
2. **Nevratná nebo destruktivní operace** (mazání dat, přepis historie).
3. **Cokoli, čeho se týkají pravidla:** skutečná nebo osobní data, napojení na jiný systém, změna oprávnění nebo okruhu uživatelů, nová knihovna, změna kontrolních souborů podle `.github/CODEOWNERS` (`.github/`, `.semgrep/`, `.husky/`, `.claude/`, `scripts/`, `next.config.ts`, `pnpm-workspace.yaml`, `biome.json`, `.gitignore`, `.gitattributes`, `.secretlint*`; v PHP aplikaci seznam z jejího `CLAUDE.md`). Vrať věc do `/jablotron:specifikace` nebo se zeptej tvůrce.
4. **Plán je tak rozbitý**, že každá cesta dál je hádání.

Ostatní nejasnosti a rozpory rozhodni sám. Specifikace je závazná, plán je její výklad a kde nestačí ani jedno, rozhoduje tvůj úsudek. Každé rozhodnutí hned zapiš do oddílu Průběh: `Rozhodnutí: <co> – <proč> – <co to stojí, když je špatně>`. Tvůrce je dostane na konci. Nezapsaná odchylka od plánu je rozhodnutí udělané potají.

## Příprava

1. **Větev:** nikdy nepracuj v `main`. Pokud v ní jsi, založ `feature/<short-name>` (anglicky, jako commity a pull request).
2. **Plán:** cesta ze zadání, jinak nejnovější soubor v `docs/plans/`, který má nezaškrtnuté kroky nebo v Průběhu ještě nemá řádek `Závěrečná kontrola:`. Když jsou kroky hotové a chybí jen kontrola s tvůrcem nebo závěrečná kontrola, pokračuj jimi. Přečti ho jednou celý a přečti i specifikaci (`SPEC.md` a část v `docs/spec/`, pokud na ni plán odkazuje). Při rozporu má přednost specifikace.
3. **Schválení:** v Průběhu musí být řádek `Plán schválen tvůrcem: <datum>`. Když chybí, nezačínej: ukaž tvůrci část „Pro tvůrce“, počkej na souhlas a řádek doplň (postup ve skillu `plan`, Předání tvůrci).
4. **Co už je hotové:** úkoly s řádkem `Úkol N: hotovo` v Průběhu jsou hotové. Nedělej je znovu, pokračuj prvním nehotovým. Úkol, který nemá řádek `hotovo`, ale má řádky `Úkol N: oprava R/3`, je uprostřed oprav: pokračuj kolem R+1 podle posledního z nich. Po zkrácení konverzace věř Průběhu a `git log`, ne své paměti.
5. **Výchozí stav:** spusť `pnpm test` (v PHP aplikaci `php tools/test.php`; obdoby dalších příkazů v [sablony.md](${CLAUDE_PLUGIN_ROOT}/reference/sablony.md)). Pokud testy padají už před začátkem, řekni to tvůrci. Není to tvoje chyba, ale musí o tom vědět.
6. **Předběžná kontrola:** projdi bloky Rozhraní. Pro každý úkol, který používá něco z dřívějšího úkolu, ověř, že názvy a typy sedí. Rozpory rozhodni a zapiš do Průběhu, jinak zapiš `Předběžná kontrola: bez rozporů`.
7. **Seznam úkolů:** pro každý úkol plánu založ položku v seznamu úkolů (todo).
8. **Režim:** podle zadání, jinak podle hlavičky plánu, jinak do tří úkolů **sám**, víc úkolů **se subagenty**. Řekni ho tvůrci jednou větou.
9. Řiď se skillem `testy-napred` ve všem, co následuje.

## Režim „sám“

Pro každý úkol:

1. Zapiš si BASE (`git rev-parse HEAD`). Přečti text úkolu v plánu znovu, ne z paměti: přesné hodnoty jsou v plánu.
2. Proveď kroky v pořadí. U každého příkazu s `Očekáváno:` příkaz spusť, přečti výstup a porovnej:
   - **sedí** → další krok;
   - **chyba v kódu** → skill `ladeni`. Nikdy neupravuj test ani očekávání, aby výsledek „seděl“;
   - **chyba v plánu** (krok odporuje specifikaci, rozhraní nesedí, příkaz nemůže fungovat) → nejmenší změna, která splní specifikaci, a zápis `Rozhodnutí:` do Průběhu.
3. Commitni podle plánu.
4. **Úkol je hotový, jen když** všechny testy z úkolu existují a běžely, poslední běh prošel a výstup jsi přečetl, každé `Očekáváno:` jsi porovnal se skutečným výstupem a každá odchylka má zapsané rozhodnutí. Jinak úkol dokonči.
5. Zaškrtni kroky v plánu a zapiš do Průběhu `Úkol N: hotovo (commity <base7>..<head7>, testy: <příkaz> → <výsledek>)`. Plán commitni s úkolem nebo hned po něm.

## Režim „se subagenty“

Každý úkol udělá čerstvý agent `jablotron:provedeni-ukolu` a zkontroluje čerstvý agent `jablotron:kontrola-ukolu`. Ty koordinuješ a tvoje konverzace zůstává volná pro tvůrce.

Pro každý úkol:

1. **BASE:** `git rev-parse HEAD`.
2. **Provedení:** spusť `jablotron:provedeni-ukolu`. Nikdy dva najednou, přepisovali by si práci. Do zadání dej jen: cestu k plánu a číslo úkolu, jednu větu o tom, kam úkol zapadá, rozhraní a rozhodnutí z dřívějších úkolů, která text úkolu nezná, a jak jsi rozhodl nejasnosti, kterých sis všiml. Nevkládej historii konverzace ani shrnutí předchozích úkolů.
3. **Hlášení** podle stavu:
   - `HOTOVO` → kontrola;
   - `HOTOVO S VÝHRADAMI` → výhrady přečti. Týkají-li se správnosti nebo rozsahu, vyřeš je před kontrolou;
   - `POTŘEBUJI INFORMACE` → doplň a spusť znovu;
   - `ZASEKNUTO` → dej víc kontextu, rozděl úkol, oprav plán (se zápisem rozhodnutí), nebo spusť agenta se schopnějším modelem. Nikdy nespouštěj totéž znovu beze změny.
4. **Kontrola:** spusť `jablotron:kontrola-ukolu` s cestou k plánu, číslem úkolu, BASE a HEAD, globálními omezeními z plánu (doslova), body z „Na co si dát pozor“, které se úkolu týkají, a s hlášením implementátora o testech. Nepředjímej nálezy. Věty jako „tohle nehlas“ do zadání nepatří.
5. **Oprava**, když kontrola našla nesplněné zadání (❌), kritický nebo důležitý nález, nebo bod ⚠️, který po tvém ověření platí:
   - **drobné nálezy** do opravy nejdou, zapiš je do Průběhu: `Úkol N: drobnost (odloženo): …`;
   - **nález v rozporu s textem plánu** rozhodni podle specifikace a zapiš rozhodnutí;
   - **ostatní** → kolo opravy: nový `jablotron:provedeni-ukolu` s nálezy doslova, číslem úkolu a rozsahem commitů předchozího pokusu. Pak `jablotron:kontrola-ukolu` v režimu **kontrola opravy**: jen diff opravy (od stavu, který viděla předchozí kontrola) a seznam nálezů. Nové postřehy mimo opravu do smyčky nepatří, zapiš je jako drobnosti. Po každém kole zapiš do Průběhu `Úkol N: oprava R/3 (X opraveno, Y zbývá; commity a..b)`;
   - **nejvýš tři kola.** Pak rozhodni o každém otevřeném nálezu. Neblokující zapiš do Průběhu jako odložený s důvodem. Blokující (bezpečnost, data, nesplněné kritérium) znamená zastavit se a tvůrci srozumitelně vysvětlit, co se nedaří, a navrhnout další krok: zjednodušit, změnit plán, zeptat se správce;
   - opravy nikdy nedělej sám v hlavní konverzaci. Obešel bys kontrolu.
6. **Hotovo:** do Průběhu `Úkol N: hotovo (commity <base7>..<head7>, kontrola čistá)` nebo `…, K odloženo`, zaškrtni kroky a commitni plán: `docs: průběh plánu, úkol N`.

Hlášením subagentů nevěř naslepo. Když hlásí hotovo, podívej se do `git log` a na výsledek kontroly.

## Kontrola s tvůrcem po každém kritériu

Když jsou hotové všechny úkoly jednoho kritéria (v obou režimech):

1. Spusť `pnpm test:e2e -g "KH-n:"` (v PHP `php tools/test.php "KH-n:"`) a výsledek řekni tvůrci číslem.
2. Spusť aplikaci (`pnpm dev`, v PHP aplikaci `php tools/server.php`; v aplikaci Claude se otevře náhled) a dej tvůrci postup z bloku „Kontrola s tvůrcem“: kam kliknout, který fiktivní soubor nahrát, co má vidět.
3. Zeptej se: „Odpovídá to tomu, co jste chtěli?“ a počkej.
   - **Ano** → do Průběhu `KH-n: tvůrce ověřil` a pokračuj.
   - **Nefunguje** (chyba) → skill `ladeni`.
   - **Funguje, ale chtěl to jinak** → jde o změnu zadání. Uprav s tvůrcem specifikaci (upravené nebo nové kritérium v `SPEC.md`, případně v části v `docs/spec/`), doplň úkol do plánu a zapiš rozhodnutí. Změnu bez specifikace nevymýšlej.

## Závěrečná kontrola větve

Po posledním úkolu a po kontrole s tvůrcem u posledního kritéria, v obou režimech:

1. Spusť `pnpm check` celé a přečti výsledek.
2. Spusť agenta `jablotron:kontrola-vetve` s cestou k plánu, výchozím commitem větve (`git merge-base origin/main HEAD`, případně `main`), výsledkem `pnpm check` (čísla), oddílem „Na co si dát pozor“ doslova a s odkazem na řádky `Rozhodnutí:` a odložené drobnosti v Průběhu. Je to jediný úplně čerstvý pohled na celou práci, nevynechávej ho a nenahrazuj vlastním čtením.
3. Nálezy nejdřív přehodnoť podle dopadu na člověka, který aplikaci bude používat. Ne podle toho, jestli o věci specifikace mluví.
   - **Kritické a důležité** → jedna opravná dávka. V režimu sám je oprav ty, každou s testem, který nejdřív selže. V režimu se subagenty pošli jednomu `jablotron:provedeni-ukolu` celý seznam najednou s pokynem doložit u každého nálezu test RED/GREEN; hlášení zkontroluj. Pak znovu `pnpm check`. Další kolo kontroly už nespouštěj, opravu dokládají testy, které nejdřív selhaly.
   - **Drobné** → odložit, uvedou se v závěrečném řádku Průběhu.
   - **Nález, který neopravíš** → `Rozhodnutí:` s důvodem.
   - **„Co jsem posoudil a nechal stranou“** → o každém řádku rozhodni ty a zapiš ho jako `Rozhodnutí:` (proč to obstojí, nebo proč je to přece jen nález k opravě). Nic z toho nesmí tiše zmizet.
4. Vždy zapiš do Průběhu jeden řádek `Závěrečná kontrola: <verdikt>; opraveno: <co nebo nic>; drobnost (odloženo): <co nebo nic>` a commitni plán s Průběhem. Podle tohoto řádku `dokonceni` pozná, že kontrola větve proběhla.

## Předání tvůrci

Krátce a srozumitelně:

- co je hotové (která kritéria prošla) a výsledek ověření číslem;
- **Rozhodnutí, která jsem udělal za vás:** všechna z Průběhu, každé s tím, co by stálo, kdyby bylo špatně. Tohle je jediné místo, kde se tvůrce o rozhodnutích dozví;
- **odložené drobnosti.**

Pak se zeptej: „Můžeme to dokončit a poslat ke kontrole?“ a počkej na odpověď. Při souhlasu pokračuj skillem `/jablotron:dokonceni` (ten už se na nic neptá).

## Časté výmluvy

| Výmluva | Ve skutečnosti |
|---|---|
| „Pamatuju si, co úkol říká.“ | Pamatuješ si shrnutí. Přesné hodnoty jsou v plánu. Přečti ho. |
| „Test je jasný, nemusím ho vidět selhat.“ | Test, který jsi neviděl selhat, nic nedokazuje. Je to jeden krok. |
| „Plán je tu špatně, udělám to správně a psát to nebudu.“ | Udělej to správně a zapiš rozhodnutí. |
| „Zeptám se tvůrce, jestli mám pokračovat.“ | Mezi úkoly se neptej. Zastavuješ se u kritérií a u bodů z „Kdy se zastavit“. |
| „Opravu udělám rychle sám.“ (režim se subagenty) | Oprava v hlavní konverzaci obchází kontrolu. Spusť `provedeni-ukolu`. |
| „Subagent hlásí hotovo.“ | Ověř `git log` a výsledek kontroly. |
| „Průběh zapíšu později.“ | Konverzace se může zkrátit kdykoli. Zapiš hned. |
| „Závěrečnou kontrolu si ušetřím, četl jsem to.“ | Stejný autor, stejná slepá místa. Kontrola větve je povinná. |
| „Tvůrce kód stejně nečte.“ | Právě proto musí každý krok dokázat test a kontrola. |
