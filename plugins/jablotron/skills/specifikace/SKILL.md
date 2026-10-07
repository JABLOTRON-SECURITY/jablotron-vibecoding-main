---
name: specifikace
description: Použij, když tvůrce přichází s nápadem na novou aplikaci, funkci nebo změnu chování, když se mění data, uživatelé či oprávnění, a vždy dřív, než vznikne kód nové funkce nebo změny. Také když CHARTA.md nebo SPEC.md chybí či obsahují „DOPLNIT“.
when_to_use: Tvůrce říká například „chci udělat aplikaci na…“, „mám nápad“, „přidej…“, „chtěl bych, aby to…“, „změň…“, „přibude nový sloupec / noví uživatelé“, „vyplň chartu“, „dá se vůbec…?“.
argument-hint: "[stručný popis nápadu nebo změny]"
---

# Specifikace: od nápadu k zadání

Výsledkem je porozumění, které tvůrce pozná a umí opravit, a zadání, podle kterého jde aplikaci postavit a ověřit testy. Tvůrce zpravidla není programátor: ptej se jednoduše, česky a průběžně shrnuj.

Podklad od tvůrce: $ARGUMENTS

<TVRDÁ-HRANICE>
Dokud tvůrce neschválí návrh odpovídající zvolené cestě, nepiš kód, neupravuj soubory aplikace a neinstaluj balíčky. Číst projekt smíš.

- **Zkouška:** tvůrce kývne na otázku a postup.
- **Drobná úprava:** tvůrce schválí krátký návrh v konverzaci.
- **Nová funkce nebo aplikace:** tvůrce schválí zapsanou `CHARTA.md` a `SPEC.md`. Teprve potom následuje `/jablotron:plan`.

Souhlas platí jen pro to, co tvůrce viděl. Souhlas s nápadem není souhlas se specifikací, která ještě neexistuje. Když se vracíš k rozpracované práci, pokračuj od prvního neschváleného kroku.
</TVRDÁ-HRANICE>

## 1. Zjisti výchozí stav

- Přečti `CHARTA.md`, `SPEC.md`, `CLAUDE.md` a posledních pár commitů (`git log --oneline -10`). Pokud charta nebo specifikace chybí, vytvoř je ze šablon [assets/CHARTA.md](${CLAUDE_SKILL_DIR}/assets/CHARTA.md) a [assets/SPEC.md](${CLAUDE_SKILL_DIR}/assets/SPEC.md).
- Rozliš **novou aplikaci** (charta obsahuje „DOPLNIT“) a **změnu existující** (charta je vyplněná).

## 2. Urči cestu a řekni ji nahlas

Před první otázkou změnu zařaď a řekni to tvůrci jednou větou, ať tě může opravit. Například: „Vypadá to jako drobná úprava, takže navrhnu změnu tady v konverzaci, bez plánu v souboru. Jestli to vidíte jinak, řekněte.“

| Cesta | Kdy | Co následuje |
|---|---|---|
| **Zkouška** | „Dá se vůbec…?“, „zkus, jestli…“. Výsledkem je odpověď, ne kód, který zůstane. | Dvěma třemi větami řekni, co zkusíš, počkej na kývnutí, zjisti to co nejlevněji a dej doporučení. Nic z pokusu necommituj. |
| **Drobná úprava** | Malá změna něčeho, co v aplikaci už je: text, popisek, řazení, barva, oprava chyby (příčinu najde `ladeni`), další sloupec v přehledu z údajů, které aplikace už má. | Kroky 3 a 7 zkráceně, návrh jen v konverzaci, bez plánu v souboru. Mění-li se chování, doplň do `SPEC.md` kritérium (KH-n) a řádek historie změn. Pak krok 11. |
| **Nová funkce nebo aplikace** | Všechno ostatní: nová obrazovka, nový import, nové údaje, noví uživatelé, nová aplikace. | Celý postup níže, pak `/jablotron:plan`. |

- **Nikdy nejde o drobnou úpravu**, když se mění data (nové údaje, osobní údaje), okruh uživatelů, oprávnění nebo napojení na jiný systém. Tam vždy plná cesta, protože se může měnit úroveň rizika.
- Když váháš mezi dvěma cestami, zvol tu náročnější. Když se během práce ukáže, že je věc větší, zastav se, řekni to a přejdi na náročnější cestu. Opačně nikdy.
- Nová aplikace je vždy plná cesta, i když je malá.

## 3. Pochop záměr

- **Jedna otázka na zprávu.** Pokud to jde, nabídni možnosti (A, B, C) a jednu doporuč. Otevřená otázka je v pořádku, když možnosti nedávají smysl.
- **Otázku s možnostmi polož nástrojem `AskUserQuestion`**, pokud ho máš, vždy jen jednu otázku na jedno použití: tvůrce klikne na volbu a vždy může napsat i vlastní odpověď. Doporučenou možnost dej první a označ ji „(doporučeno)“.
- **Nejdřív účel:** k čemu to bude, kdo to použije, podle čeho poznáme, že to pomáhá. Teprve pak podrobnosti. Typ aplikace („přehled“, „evidence“) ještě neříká, proč ji tvůrce chce.
- Když tvůrce přinese hotové zadání (například ze cvičení), neptej se znovu na to, co už řekl. Shrň ho a nech si potvrdit.
- **U drobné úpravy** nemusíš klást otázky jednu po druhé. Stačí jeden návrh s doporučenými volbami a výslovně vypsanými předpoklady („počítám jen vyřízené reklamace“, „u typu bez dat ukážu –“), které tvůrce potvrdí nebo opraví.
- **Velký nápad** (několik nezávislých částí) hned rozděl na menší celky, domluv pořadí a specifikuj jen první. Každý celek má vlastní specifikaci, plán a implementaci.
- **Shrň porozumění:** krátce napiš, co tvůrce řekl, a zvlášť, co předpokládáš. Nech si to opravit, než půjdeš dál.

## 4. Tři otázky pro zařazení

Jen u nové funkce nebo aplikace. Řiď se [úrovněmi rizika](${CLAUDE_PLUGIN_ROOT}/reference/urovne-rizika.md) a [třídami dat](${CLAUDE_PLUGIN_ROOT}/reference/tridy-dat.md). Zjisti:

1. **S jakými daty bude aplikace pracovat?** Ať tvůrce popíše sloupce nebo údaje, ne konkrétní hodnoty. Odkud data přicházejí?
2. **Kdo k ní bude mít přístup?** Jen autor, kolegové v týmu, celá firma, někdo mimo firmu?
3. **Co se stane, když selže nebo vrátí chybný výsledek?**

Pak navrhni úroveň L0–L3 a jednou větou ji zdůvodni. Rozhoduje nejvyšší úroveň, ke které vede kterákoli odpověď. V hraničních případech platí vyšší.

**Vyšší úroveň neznamená zákaz, ale víc kontrol.** Aplikace L2 a L3 se staví stejným postupem. Když vyjde L2 nebo L3, řekni tvůrci jednoduše, co se přidává:

- **L2:** odborné code review (kód schvaluje člověk, ne autor ani agent), test oprávnění, souhlas vlastníka zdrojových dat, posouzení ochrany osobních údajů, zálohy s ověřenou obnovou, spuštění schvaluje i schvalovatel;
- **L3:** navíc bezpečnostní test před spuštěním, posouzení vlivu na ochranu osobních údajů (DPIA), plán řešení incidentů a garantovaný provoz.

Úroveň musí schválit schvalovatel dřív, než vznikne kód (krok 5). Když tvůrce o vyšší úroveň nestojí, nabídni, jak ji snížit (souhrny bez jmen, menší okruh uživatelů). I u L2 a L3 se vyvíjí **jen s fiktivními daty**; skutečná data dostane aplikace až v provozu ručním exportem. Osobní údaje zapiš do charty (`osobni_udaje: ano`) a do specifikace: které údaje, proč jsou potřeba a kdo je uvidí. Nic navíc.

**Zastav se a vysvětli, proč nelze pokračovat, když:**

- tvůrce chce **přímé napojení na firemní systém** (ERP, CRM, databáze, interní API): na žádné úrovni není povolené. Nabídni ruční export, který do aplikace vloží pověřená osoba;
- tvůrce chce do konverzace vložit **skutečná data**: nedělej to. Ať popíše sloupce a vytvořte spolu fiktivní vzorek.

## 5. Schválení

- U **L0** (osobní experiment nebo cvičný repozitář z workshopu) schválení není potřeba. Do charty napiš „není potřeba“.
- U aplikace **L1 a výš** musí existovat schválený nápad (issue ve formuláři „Nový nápad“ v centrálním repozitáři `jablotron-vibecoding`), ve kterém schvalovatel potvrdil úroveň. Zeptej se na odkaz a zapiš ho do charty.
- U **L2 a L3** navíc: souhlas vlastníka zdrojových dat (pole `souhlas_vlastnika_dat`, s odkazem nebo jménem a datem).
- Pokud schválení chybí, pomoz tvůrci sepsat text do formuláře nápadu (problém, komu pomůže, data, odpovědi na tři otázky, navržená úroveň) a **vývoj nezačínej**, dokud nápad schvalovatel neschválí.
- U změny existující aplikace, která **mění úroveň**, platí totéž: nová úroveň musí být schválená dřív, než vznikne kód.

## 6. Varianty řešení

- Navrhni **dvě až tři varianty** z pohledu uživatele, tedy co uvidí a co udělá, ne jakou technologií. Například: „A) tabulka s výběrem regionu, B) karty se součty a týdenní graf, C) jen seznam s upozorněním na zpožděné.“
- U každé řekni, v čem je dobrá a co stojí (složitost, čas). Začni tou, kterou doporučuješ, a řekni proč.
- **Data vždy v MySQL.** Ve variantách neřeš technologii, ale ani nenabízej ukládání jinam (soubory, tabulka v prohlížeči, jiná databáze). Data aplikace patří do relační databáze MySQL, kterou šablona už má.
- **Nic navíc.** Z každé varianty vyhoď, co tvůrce teď nepotřebuje. Hledáte nejmenší užitečnou verzi.
- Stack a vzory jsou dané (`CLAUDE.md`). Varianty se neliší knihovnami.
- Když pomůže obrázek, nakresli jednoduchý náčrt obrazovky textem přímo do konverzace.
- Varianty nejdřív popiš ve zprávě, pak nech tvůrce vybrat (`AskUserQuestion`).
- Zvolená varianta a důvody, proč ne ostatní, se zapisují do plánu funkce (`/jablotron:plan`, část „Pro tvůrce“). Do `SPEC.md` jde jen výsledné řešení.

## 7. Návrh po částech

Návrh předlož postupně. Po každé části se zeptej, jestli sedí, a teprve pak pokračuj. Délku části přizpůsob složitosti: jasná věc je na dvě věty.

1. **Obrazovky:** co na nich uživatel vidí a co může udělat.
2. **Data:** údaje, typ, třída dat, zdroj, fiktivní příklad. Zdrojem je vždy ruční export nebo ruční zadání.
3. **Kdo co smí:** role čtenář, editor a správce (v kódu Next.js `ctenar`, `editor`, `spravce`; v PHP aplikaci `reader`, `editor`, `admin`).
4. **Co aplikace nesmí:** výslovně (například „nezobrazuje jména zákazníků“, „neposílá e-maily“).
5. **Chybové stavy:** co uživatel uvidí při chybném nebo prázdném souboru, duplicitách, chybějícím oprávnění.
6. **Kritéria hotového řešení:** každé ve tvaru „Když …, pak …“ s konkrétními hodnotami. Žádné „aplikace je rychlá“ nebo „vypadá hezky“. Každé kritérium se stane automatickým testem.

U drobné úpravy stačí v jedné zprávě: co se změní, kterých částí se to týká, jaký test to ověří. Pak **zastav se a počkej na výslovné „ano“**. Návrh a začátek práce v jedné zprávě znamenají přeskočit souhlas.

## 8. Zápis charty a specifikace

**Charta (`CHARTA.md`).** Hlavička ve formátu YAML se zpracovává strojově (kontrola v CI, přehled aplikací), proto:

- vyplň všechna pole, žádné „DOPLNIT“ nesmí zůstat;
- `uroven` je přesně `L0`, `L1`, `L2` nebo `L3`;
- `stav` je `experiment`, `pilot`, `provoz` nebo `vyrazeno`;
- data zapisuj ve formátu `RRRR-MM-DD`; první revize je šest měsíců po plánovaném spuštění;
- u **L0** (nenasazuje se): `spravce_provozu: není potřeba`, `umisteni_provozu: nenasazuje se`, `spusteni` = začátek experimentu, `pristi_revize` = plánovaný konec experimentu, `vyrazeni: po skončení experimentu`;
- od L2 musí být **věcný vlastník a tvůrce dvě různé osoby**, u L1 je to doporučené.

**Údaje v rozhraní (`src/lib/aplikace.ts`, v PHP aplikaci `public/app/app-info.php`).** Po zápisu charty uprav i tento soubor: `nazev`, `popis`, `vecnyVlastnik` a `kontaktIncident` (v PHP `APP_TITLE`, `APP_POPIS`, `APP_VLASTNIK`, `APP_KONTAKT_INCIDENT`) podle hlavičky charty. Zobrazuje je postranní panel, úvodní stránka a patička; jinak by v aplikaci zůstalo „Nová aplikace“ a „DOPLNIT“. Commitni ho spolu s chartou.

**Specifikace (`SPEC.md`)** podle šablony a schváleného návrhu: problém, role, co aplikace umí („Jako *role* chci *akce*, abych *přínos*“), co nesmí, data, řešení (jak aplikace problém řeší teď, jednou dvěma větami), obrazovky, chybové stavy, kritéria hotového řešení, mimo rozsah, otevřené otázky a řádek do historie změn. U změny existující aplikace přidej nová kritéria s dalším číslem (KH-5, KH-6…), stávající nepřečíslovávej, a oddíl Řešení uprav tak, aby popisoval aplikaci po změně.

**Rozdělení specifikace.** Když by `SPEC.md` měla víc než zhruba 15 kritérií nebo má aplikace samostatné části (například import, přehled, správa číselníků), přesuň do `docs/spec/<oblast>.md` všechno, co se týká jen té části: co v ní uživatel umí, obrazovky, chybové stavy, kritéria, mimo rozsah a otevřené otázky. V `SPEC.md` zůstane, co platí pro celou aplikaci: problém, role, data, co aplikace nesmí, řešení, odkazy na oblasti a historie změn. Čísla kritérií zůstávají jedinečná v celé aplikaci a nepřečíslovávají se. Rozdělení řekni tvůrci a commitni ho samostatně, bez jiných změn.

## 9. Kontrola vlastního zápisu

Přečti oba soubory s čerstvým pohledem a chyby oprav rovnou:

1. **Nedodělky:** žádné „DOPLNIT“, „TBD“ ani prázdné oddíly.
2. **Rozpory:** neodporují si části? Například kritérium mluví o roli, která v tabulce rolí chybí.
3. **Dvojznačnost:** dá se některé kritérium vyložit dvojím způsobem? Vyber jeden výklad a zapiš ho výslovně.
4. **Ověřitelnost:** každé kritérium jde ověřit automatickým testem s konkrétními hodnotami (počty, texty hlášek).
5. **Rozsah:** vejde se to do jednoho plánu? Jinak rozděl. Má `SPEC.md` víc než zhruba 15 kritérií nebo samostatné části? Rozděl ji podle kroku 8.
6. **Data:** ve specifikaci nejsou skutečná data, jen popis údajů a fiktivní příklady.

## 10. Tvůrce zkontroluje zápis

Řekni například: „Charta a specifikace jsou zapsané v `CHARTA.md` a `SPEC.md`. Přečtěte si prosím hlavně kritéria hotového řešení, přesně podle nich pak poznáme, že je hotovo. Chcete něco změnit, než připravím plán?“

Počkej na odpověď. Změny zapracuj a znovu proveď krok 9. Pokračuj až po souhlasu.

## 11. Uložení a další krok

- Pracuj ve větvi, ne v `main`. Pokud jsi v `main`, založ větev `feature/<short-name>` (u nové aplikace třeba `feature/first-version`). Názvy větví, zprávy commitů a pull requesty jsou anglicky, specifikace a charta česky. Specifikace, plán i kód jdou do stejné větve a jednoho pull requestu. Pokud chce věcný vlastník schválit specifikaci zvlášť, pošli ji samostatným pull requestem.
- Commitni chartu a specifikaci zvlášť od kódu, zpráva např. `docs: charta a specifikace přehledu reklamací`.
- **Nová funkce nebo aplikace:** jediný další krok je `/jablotron:plan`. Řekni tvůrci: „Teď připravím plán, jak to postavit.“ Nespouštěj žádný jiný skill a nepiš kód.
- **Drobná úprava:** po souhlasu commitni případnou změnu `SPEC.md`, pak kód podle `testy-napred` (ve stejné větvi, jeden commit). Tvůrci řekni, co si má vyzkoušet, a počkej na potvrzení, stejně jako u kritéria v `implementace`. Pak nabídni `/jablotron:dokonceni` („Můžeme to dokončit a poslat ke kontrole?“) a počkej na odpověď.
- **Zkouška:** předej doporučení. Pokud se z ní má stát skutečná funkce, je to nový požadavek a začíná znovu krokem 2.

## Varovné myšlenky

| Když si říkáš | Ve skutečnosti |
|---|---|
| „Tohle je tak jednoduché, že to nepotřebuje návrh.“ | I drobná úprava má krátký návrh a souhlas. |
| „Řeknu, že je to drobná úprava, a ušetřím si specifikaci.“ | Když hledáš zařazení, které ušetří práci, je to důvod k pochybnosti. Zvol náročnější cestu. |
| „Návrh je jasný, začnu, zatímco ho tvůrce čte.“ | Hranicí je souhlas, ne délka návrhu. Předlož a počkej. |
| „Znám tenhle typ aplikace, takže je to drobnost.“ | Drobná úprava se měří podle toho, co už v aplikaci je, ne podle tvé zkušenosti. |
| „Pokus funguje, tak ho nechám.“ | Výsledkem zkoušky je odpověď. Ponechat kód je nový požadavek. |
| „Rozrostlo se to, ale už jsem skoro hotový.“ | Skrytá složitost mění cestu. Zastav se a řekni to. |

## Kontrola na konec

- [ ] Cesta je určená a tvůrce ji slyšel
- [ ] Úroveň odpovídá nejvyšší odpovědi ze tří otázek; od L1 je schválená, u L2 a L3 tvůrce ví, jaké kontroly se přidávají
- [ ] Charta nemá prázdná pole ani „DOPLNIT“
- [ ] Ve specifikaci nejsou skutečná data, jen popis údajů a fiktivní příklady
- [ ] Každé kritérium hotového řešení jde ověřit testem
- [ ] Tvůrce zápis schválil
