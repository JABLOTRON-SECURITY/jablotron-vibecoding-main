# Pravidla práce s agentem

Pravidla jsou závazná pro každého tvůrce i pro agenta. Agent je dostává na začátku každé relace.

## Sedm pravidel

1. **Nejdřív zadání a plán.** Nová funkce začíná specifikací a plánem v `docs/plans/`, drobná úprava krátkým návrhem v konverzaci. Tvůrce je schválí. Teprve potom vzniká kód.
2. **Malé kroky, testy napřed.** Každý úkol začíná testem, který nejdřív selže. Jeden úkol, jeden commit. Návrat k předchozí verzi je pak otázkou minut.
3. **Práce ve vlastní větvi.** Do hlavní větve `main` se dostane změna pouze přes pull request po úspěšných kontrolách.
4. **Pouze testovací data.** Vývoj probíhá s fiktivními údaji. Agent se nepřipojuje k produkčním datům ani systémům.
5. **Víte, co odevzdáváte.** Spolu s odkazem na pull request dostane tvůrce krátké shrnutí změny: co se mění pro uživatele, na co dát pozor a jak si to vyzkoušet. Podrobnosti pro recenzenty jsou v popisu pull requestu. Tvůrce se nezkouší; když něčemu nerozumí, zeptá se. Skill `vysvetli-zmenu`.
6. **Nezávislá kontrola.** Kód nekontroluje agent, který ho napsal: celou větev a bezpečnost vždy kontroluje agent v novém kontextu, u větších plánů i každý úkol zvlášť. U pull requestu ještě běží automatické review. Tvůrce kontroluje chování: každé kritérium hotového řešení si vyzkouší.
7. **Čistý kód, anglicky.** V kódu je všechno anglicky: názvy souborů, funkcí, proměnných, tříd, tabulek a sloupců databáze i komentáře. Česky zůstává jen to, co čte člověk: texty a hlášky v aplikaci, názvy testů podle kritérií („KH-1: …“), specifikace, plán a dokumentace. Kód se drží zavedených zásad: výstižné názvy, malé funkce s jedním účelem, žádné opakování stejné logiky (DRY), oddělené odpovědnosti a závislosti podle SOLID, nejjednodušší řešení, které stačí (KISS), a nic „do zásoby“ (YAGNI). Kde stávající kód šablony používá české názvy, nové části piš anglicky a stávající kód mimo zadání nepřejmenovávej.

## Co agent nikdy nedělá

- Neříká „hotovo“, „funguje“ ani „testy prošly“, dokud nespustil ověření a nepřečetl výsledek.
- Neukládá hesla, tokeny ani klíče do kódu. Tajné hodnoty patří do `.env.local`, který se necommituje.
- Nepřipojuje aplikaci přímo na firemní systémy (ERP, CRM, databáze, interní API). Data přicházejí jen ručním exportem.
- Nepoužívá skutečná data, ani v testech.
- Neukládá data aplikace jinam než do relační databáze MySQL (firemní standard). Nenavrhuje ani nepoužívá jinou databázi nebo úložiště: PostgreSQL, SQLite (výjimkou je vývojová náhrada v PHP šabloně), MongoDB, Firebase, Supabase, Redis, soubory JSON, úložiště v prohlížeči.
- Neobchází kontroly: žádné `--no-verify`, žádné vypínání nebo oslabování testů, žádné `// @ts-ignore` kvůli tomu, aby „to prošlo“.
- Nepřidává knihovny bez důvodu. Každá nová závislost je riziko a musí být zdůvodněná v popisu pull requestu.
- Necommituje do `main` a nepoužívá `git push --force`.
- Nemaže data ani soubory mimo projekt.

## Jak agent komunikuje s tvůrcem

Tvůrce zpravidla není programátor. Agent proto:

- mluví česky a srozumitelně, bez zbytečného žargonu; když použije odborný pojem, jednou větou ho vysvětlí,
- ptá se po jedné otázce, nejlépe s možnostmi na výběr,
- před každou změnou řekne, co udělá a proč, a počká na souhlas; schválený plán je souhlasem se všemi jeho úkoly a spuštění `/jablotron:dokonceni` je souhlasem s ověřením, opravou nálezů z kontrol a vytvořením pull requestu,
- po dokončení shrne, co se změnilo, jak to vyzkoušet a co zbývá; výsledky dokládá čísly („23 z 23 testů prošlo“),
- když požadavek odporuje pravidlům (osobní údaje, napojení na systém, skutečná data), zastaví se, vysvětlí proč a nabídne bezpečnou alternativu,
- když si není jistý, zeptá se, místo aby hádal.
