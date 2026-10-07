# Proces: vibecoding pod kontrolou

Funkční nástroj dnes za jedno odpoledne vytvoří i člověk, který nikdy neprogramoval. Proces proto nastavuje aplikacím od začátku jasné mantinely. Řeší tři rizika současně: **zdánlivě hotový kód** (funguje, ale chybí kontrola oprávnění nebo ošetření vstupů), **agenta se širokými právy** a **aplikace mimo evidenci**.

## Šest principů

1. **Požadavky podle míry rizika.** Čtyři úrovně L0–L3. Čím citlivější data a širší okruh uživatelů, tím přísnější kontroly. → [úrovně rizika](../plugins/jablotron/reference/urovne-rizika.md), [třídy dat](../plugins/jablotron/reference/tridy-dat.md)
2. **Bezpečnost zabudovaná do kostry.** Kontroly běží automaticky v každém projektu ze šablony `jablotron-app-next-template` (Next.js) nebo `jablotron-app-php-template` (PHP pro JBT Platform).
3. **Žádná aplikace bez své charty.** Každá aplikace je evidovaná a má vlastníka, úroveň rizika a termín příští revize. Přehled všech aplikací vzniká z chart automaticky skriptem `nastaveni/app-overview.mjs`.
4. **Agent s minimálními oprávněními.** Ochranné hooky pluginu, žádná produkční data ani přístup do produkce. → [pravidla práce](../plugins/jablotron/reference/pravidla-prace.md)
5. **Kontrola nezávislá na autorovi.** Automatické kontroly vždy, odborné code review od L2, nezávislé ověření u L3.
6. **Postupné zavedení.** Pilotní provoz, vyhodnocení podle metrik a teprve poté rozšíření na další tvůrce.

## Role

Jedna osoba může zastávat více rolí, každá role však musí mít konkrétní jméno.

| Role | Odpovědnost |
|---|---|
| **Sponzor** | Zástupce vedení. Odpovídá za proces, schvaluje výjimky a změny pravidel. |
| **Schvalovatel** | Potvrzuje úroveň rizika, schvaluje vývoj a spuštění L2 a L3. |
| **Věcný vlastník** | Zadává aplikaci, přebírá ji a ověřuje správnost výstupů. |
| **Tvůrce** | Vyvíjí na kostře projektu, vede chartu a specifikaci. |
| **Správce provozu** | Provozní prostředí, přístupy, zálohy, potvrzuje podmínky spuštění. |
| **IT a bezpečnost** | Síť, firemní přihlášení, správa tajných údajů, řešení incidentů, nastavení GitHubu a Claude. |
| **Ochrana osobních údajů** | Posuzuje aplikace s osobními údaji od L2. |
| **Externí odborník** | Odborné code review L2 a L3, bezpečnostní testy, školení. |

Od úrovně L2 musí být věcný vlastník a tvůrce dvě různé osoby, stejně jako tvůrce a ten, kdo provádí code review.

## Od nápadu k prototypu

| Krok | Co se děje | Kdo |
|---|---|---|
| **1. Nápad se zapíše** | Formulář [Nový nápad](../../../issues/new?template=napad.yml): problém, komu pomůže, s jakými daty | Tvůrce nebo věcný vlastník |
| **2. Tři otázky pro zařazení** | Jaká data, kdo bude aplikaci používat, co se stane při chybě. Vyjde navržená úroveň. | Tvůrce |
| **3. Rozhodnutí o nápadu** | Schváleno / vráceno k doplnění / zamítnuto, vždy s důvodem. → [šablona](../sablony/rozhodnuti-o-napadu.md) | Schvalovatel |
| **4. Repozitář po schválení** | Nový repozitář ze šablony `jablotron-app-next-template` (aplikace pro rozcestník JBT Platform ze `jablotron-app-php-template`), pravidla větve `main`, přístupy. → [návod](../nastaveni/NAVOD-PRO-ADMINA.md#5-nová-aplikace-po-schválení-nápadu) | IT |
| **5. Charta a specifikace** | Než vznikne první řádek kódu: `CHARTA.md` a `SPEC.md` s kritérii hotového řešení. Skill `/jablotron:specifikace`. | Tvůrce s věcným vlastníkem |
| **6. Plán** | Implementační plán v `docs/plans/`: úkoly navázané na kritéria hotového řešení, testy napřed. Tvůrce schválí shrnutí. Skill `/jablotron:plan`. | Tvůrce |
| **7. Prototyp a kontrola** | Stavba úkol po úkolu (u plánů nad tři úkoly s nezávislou kontrolou každého úkolu), na konci nezávislá kontrola celé větve, tvůrce vyzkouší každé kritérium. Pak ověření, bezpečnostní review, pull request s automatickými kontrolami a krátké shrnutí změny pro tvůrce. Skills `/jablotron:implementace` a `/jablotron:dokonceni`. | Tvůrce |

Nic nevzniká na vlastní pěst. Nápady z oblastí, na které se proces nevztahuje, se předávají standardnímu vývoji IT.

## Kdo a jak kontroluje

Každá vyšší úroveň zahrnuje všechny kontroly nižších úrovní.

| Úroveň | Kontrola | Kde |
|---|---|---|
| **L0** | Kontrola klíčů, dat a závislostí v kostře | Kontrola před commitem, CI |
| **L1** | Kompletní automatické kontroly, testy ke každému kritériu hotového řešení, nezávislá AI kontrola celé větve (u větších plánů i každého úkolu) a bezpečnostní AI review v novém kontextu. Spuštění potvrzuje správce provozu. | CI (charta, tajné údaje, závislosti, kvalita a testy, statická analýza), `/jablotron:implementace`, `/jablotron:bezpecnostni-review`, Claude Code Review u pull requestu |
| **L2** | Navíc odborné code review, test oprávnění, souhlas vlastníka zdrojových dat, posouzení ochrany osobních údajů, zálohy s ověřenou obnovou, schválení spuštění vlastníkem i schvalovatelem | `CODEOWNERS` + pravidla větve pro L2, `docs/podminky-spusteni.md` |
| **L3** | Navíc bezpečnostní test před spuštěním (nezávislý odborník), posouzení vlivu na ochranu osobních údajů (DPIA, GDPR čl. 35), plán řešení incidentů, garantovaný provoz | Pravidla větve pro L2, `docs/podminky-spusteni.md` |

**Vyšší úroveň neznamená zákaz, ale víc kontrol.** Agent staví aplikaci na jakékoli úrovni, kterou schválil schvalovatel, vždy jen s fiktivními daty. Přímé napojení na firemní systém není povolené na žádné úrovni.

## Spuštění

Od L1 platí [podmínky spuštění](../plugins/jablotron/reference/podminky-spusteni.md). Tvůrce je připraví skillem `/jablotron:nasazeni`, správce provozu je potvrdí. **Cílové provozní prostředí a firemní přihlášení zatím nejsou rozhodnuté**, do té doby se aplikace mimo počítače tvůrců nespouštějí.

## Změna u běžící aplikace

| Situace | Postup |
|---|---|
| **Malá změna** (oprava, kosmetika) | Krátký návrh v konverzaci, test napřed, pull request, automatické kontroly, sloučení. Bez schvalování. |
| **Větší změna** (nová funkce, nová data, víc uživatelů) | Specifikace s přezkoumáním úrovně (`/jablotron:specifikace`), plán a stavba podle plánu. Pokud se úroveň mění, platí požadavky vyšší úrovně a nové schválení. |
| **Změna vlastníka nebo tvůrce** | Skill `/jablotron:predani-projektu`, zápis do charty. Bez nástupce se aplikace vyřazuje. |
| **Nepoužívaná aplikace** | Po šesti měsících bez použití se vypíná, ne udržuje. |

Většina aplikací vzniká jako L1 a časem nenápadně přejde výš. Úroveň se proto ověřuje při každé větší změně a při čtvrtletní revizi.

## Provoz, revize a vyřazení

1. **Automatické aktualizace.** Bezpečnostní aktualizace knihoven přicházejí od Dependabotu jako pull requesty. Vlastník je vyřídí do dvou týdnů, kritické do 72 hodin.
2. **Čtvrtletní revize.** Projde se přehled aplikací (`PREHLED-APLIKACI.md`, vygenerovaný z chart): kdo je používá, zda odpovídá úroveň, zda jsou aktuální vlastníci i přístupy. → [šablona](../sablony/ctvrtletni-revize.md)
3. **Změna vlastníka.** Aplikace se předá podle README, nebo se vyřadí.
4. **Řízené vyřazení.** Zruší se přístupy, smažou data, archivuje kód. → [šablona](../sablony/vyrazeni-aplikace.md)

Vyřadit nepotřebnou aplikaci je stejně důležité jako spustit novou. Každá aplikace v provozu představuje riziko.

## Když se něco pokazí

Zastavit → nahlásit → vyměnit klíče a zajistit stopy → poučit se. → [postup při incidentu](../plugins/jablotron/reference/incident.md)

## Postupné zavedení

| Fáze | Obsah | Rozhodovací bod |
|---|---|---|
| **1. Příprava** | Schválení procesu, obsazení rolí, firemní licence, nastavení podle [návodu](../nastaveni/NAVOD-PRO-ADMINA.md) | Role mají jména |
| **2. Workshop a kostra** | Předání šablony projektu, skills a nastavení | Tvůrci umí projít celý postup |
| **3. Pilotní provoz** | Dvě až tři aplikace vytvořené podle procesu, doporučeně L1 (proces se ověří na nízkém riziku). Aplikaci L2 nebo L3 může schvalovatel pustit, jakmile jsou obsazené role odborného recenzenta a ochrany osobních údajů. Jeden zkušenější tvůrce jako ambasador (první kontakt pro dotazy, sbírá podněty k pluginu), společný kanál v Teams a jednou týdně krátká ukázka, co kdo postavil a co nefungovalo | — |
| **4. Vyhodnocení a rozšíření** | Vyhodnocení metrik, úprava pravidel, rozhodnutí o dalších tvůrcích | **Závazný:** bez vyhodnocení se okruh tvůrců nerozšiřuje |
