# Tahák pro tvůrce

## Než začnete

1. **Nápad** podejte formulářem [Nový nápad](../../issues/new?template=napad.yml). Bez schválení nevzniká repozitář (výjimkou jsou osobní experimenty L0 a cvičné repozitáře z workshopu).
2. Po schválení vám IT založí repozitář. Stáhněte ho a připravte: `gh repo clone jablotron-org/<nazev>`, ve složce pak jednou `pnpm bootstrap`, která stáhne i vývojovou databázi MySQL (PHP aplikace pro JBT Platform: `php tools/setup.php`).
3. V aplikaci **Claude** otevřete záložku **Code**, zvolte **Local** a složku projektu. Při prvním otevření potvrďte, že složce důvěřujete, jinak se agent bude ptát na každý příkaz. Režim práce (volba vedle tlačítka pro odeslání) je předvolený na **Accept edits**: soubory agent upravuje sám, příkazy mimo povolený seznam vám dá potvrdit. Nechte ho tak. Režim **Plan** nepotřebujete, plán vzniká přes `/jablotron:plan`.

## Postup u každé změny

| Krok | Co napsat | Co se stane | Co děláte vy |
|---|---|---|---|
| 1. Zadání | `/jablotron:specifikace` a popis nápadu | Agent se ptá po jedné otázce, navrhne úroveň rizika a dvě až tři varianty řešení a zapíše `CHARTA.md` a `SPEC.md` | Odpovídáte, vybíráte variantu, **schválíte kritéria hotového řešení** |
| 2. Plán | `/jablotron:plan` | Plán do `docs/plans/` s úkoly a testy | **Přečtete a schválíte část „Pro tvůrce“** |
| 3. Stavba | `/jablotron:implementace` | Agent staví úkol po úkolu, testy napřed, práci nechá nezávisle zkontrolovat | Po každém kritériu **si výsledek vyzkoušíte** v prohlížeči |
| 4. Odevzdání | `/jablotron:dokonceni` | Ověření, bezpečnostní review, pull request a krátké shrnutí změny, všechno najednou | **Přečtete si shrnutí** a na GitHubu sledujete kontroly |
| 5. Připomínky | `/jablotron:pripominky` | Agent posoudí komentáře z review a navrhne opravy nebo odpovědi | Odsouhlasíte, na GitHubu kliknete **Resolve conversation** |

**Kritéria hotového řešení** mají čísla KH-1, KH-2… Jsou to věty ve `SPEC.md` ve tvaru „Když …, pak …“, podle kterých se pozná, že je hotovo. Každé se stane automatickým testem a vy si ho vyzkoušíte. Plán jde udělat jen pro některá: `/jablotron:plan jen KH-1`.

**Drobná úprava** (text, barva, oprava chyby) má kratší cestu: agent navrhne změnu přímo v konverzaci, po vašem „ano“ ji udělá a vy si ji vyzkoušíte. Plán v souboru není potřeba.

**Když něco nefunguje:** `/jablotron:ladeni`. Agent nejdřív hledá příčinu, pak opravuje. Po třech nezdarech se zastaví a řekne vám, co dál.

**Druhý den:** stačí napsat „pokračuj“. Agent najde rozpracovaný plán a naváže tam, kde skončil.

**U pull requestu** v aplikaci Claude nechte přepínače **Auto-fix** a **Auto-merge** vypnuté. Červenou kontrolu řeší `/jablotron:ladeni` (nejdřív příčina) a o sloučení rozhoduje člověk.

Aplikaci spustíte větou „spusť aplikaci“ nebo příkazem `pnpm dev` (http://localhost:3000), PHP aplikaci příkazem `php tools/server.php` (http://localhost:8000).

## Jak mluvit s agentem

- **Konkrétně a jednu věc.** Ne „vylepši přehled“, ale „v přehledu chci vidět i počet reklamací starších než 14 dní“.
- **U chyby napište, co jste čekali a co vidíte**, a přiložte snímek obrazovky. Nikdy nevkládejte skutečná data. Popište sloupce, fiktivní vzorek vyrobí agent.
- **Zastavit a vrátit:** tlačítko **Stop** (nebo klávesa **Esc**) agenta zastaví. Návrat konverzace i souborů do dřívějšího stavu nabídne příkaz `/rewind`. Hotové úkoly jsou navíc v commitech.
- **Nová funkce = nová konverzace.** Dlouhá konverzace zhoršuje výsledky. Všechno důležité je v souborech (specifikace, plán, průběh), nic se neztratí. Stavbu proto klidně začněte v nové konverzaci hned po schválení plánu a napište „pokračuj“.
- **Agent dvakrát nepochopil, co chcete?** Nepokračujte v opravování. Nechte ho napsat zpřesněné zadání, začněte novou konverzaci a vložte ho tam. (Chyba v aplikaci je jiný případ: `/jablotron:ladeni`.)
- **Vedlejší dotaz** („co znamená tahle hláška?“) položte v postranním chatu: **Ctrl+;** (na Macu **Cmd+;**) nebo `/btw`. Hlavní konverzaci nezahltí.
- **Konverzace pojmenujte** (klikněte na název nahoře), ať je druhý den snadno najdete.
- **„Hotovo“ jen s důkazem.** Agent má výsledek doložit čísly („24 z 24 testů prošlo“). Když to neudělá, zeptejte se: „Jak jsi to ověřil?“
- **Limity:** u větších plánů pracují samostatní agenti a čerpají víc z limitu Claude. U malých plánů agent pracuje sám.

## Sedm pravidel

1. **Nejdřív zadání a plán**, pak kód.
2. **Malé kroky, testy napřed**: jeden úkol, jeden commit.
3. **Vlastní větev**, do `main` jen přes pull request. Větve, commity a pull requesty agent píše anglicky (`feature/weekly-overview`, `feat: add weekly overview`), všechno, co čtete vy, česky.
4. **Při vývoji jen fiktivní data.** Skutečná data nepatří do aplikace, repozitáře ani do konverzace s agentem.
5. **Víte, co odevzdáváte**: spolu s odkazem na pull request dostanete krátké shrnutí změny. Když něčemu nerozumíte, zeptejte se.
6. **Nezávislá kontrola**: kód kontroluje jiný agent nebo člověk, vy kontrolujete chování.
7. **Čistý kód anglicky**: kód (názvy, komentáře) píše agent anglicky podle zásad DRY, SOLID, KISS a YAGNI. Texty v aplikaci a všechno, co čtete vy, jsou česky.

## Kdy se zastavit a zeptat schvalovatele

- Přibudou **osobní údaje** (jméno, e-mail, telefon, adresa, číslo zaměstnance…).
- Aplikaci má používat **někdo mimo firmu**.
- Někdo chce aplikaci **napojit na firemní systém**.
- Na výsledcích začnou **záviset rozhodnutí** nebo práce týmu.

## Třídy dat

| Třída | Příklad | Do Claude při běžné práci (ne při vývoji) | V aplikaci |
|---|---|---|---|
| Veřejná | web, katalog, ceník | ano | od L0 |
| Interní | směrnice, souhrny bez jmen | ano | od L1 |
| Důvěrná | osobní údaje zaměstnanců, obchodní výsledky | jen anonymizovaná | od L2 |
| Přísně chráněná | zákazníci, objekty, poplachy, přístupy | **nikdy** | jen L3 |

## Když kontrola selže

| Hláška | Co dělat |
|---|---|
| „Commit zastaven: soubory do repozitáře nepatří“ | Datový soubor nebo `.env` nemá být v gitu. Řekněte agentovi „odeber to z commitu“. |
| „Commit zastaven: heslo, token nebo klíč“ | Klíč z kódu odstranit. Pokud už byl odeslaný, **nahlaste incident** (SECURITY.md). |
| Červená kontrola u pull requestu | `/jablotron:ladeni` nebo „Proč selhala kontrola X?“. Nikdy kontrolu nevypínejte. |
| Agent odmítá akci kvůli pravidlům | Pravidla platí. Zeptejte se na bezpečnou alternativu. |

## Když se něco pokazí

**Zastavit → nahlásit → vyměnit klíče → poučit se.** Nic nemažte. Kontakt je v `SECURITY.md` vaší aplikace.
