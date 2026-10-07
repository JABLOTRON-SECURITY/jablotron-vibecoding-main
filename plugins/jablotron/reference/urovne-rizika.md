# Úrovně rizika L0–L3

Každá aplikace má úroveň rizika. Určuje se **před zahájením vývoje** a podle ní se řídí, jaké kontroly platí. Úroveň navrhuje tvůrce, potvrzuje schvalovatel a zapisuje se do `CHARTA.md`.

## Tři otázky pro zařazení

Rozhoduje **nejvyšší** úroveň, ke které vede kterákoli odpověď. V hraničních případech platí vyšší úroveň.

### 1. S jakými daty bude aplikace pracovat?

| Data | Nejnižší úroveň |
|---|---|
| Veřejná nebo fiktivní | L0 |
| Interní, bez osobních údajů (šablony, souhrnné údaje bez jmen) | L1 |
| Osobní údaje zaměstnanců, obchodní výsledky, smlouvy | L2 |
| Data zákazníků a objektů, poplachové události, přístupové nebo zdravotní údaje | L3 |

Podrobně viz [tridy-dat.md](tridy-dat.md).

### 2. Kdo k ní bude mít přístup?

| Uživatelé | Nejnižší úroveň |
|---|---|
| Pouze autor | L0 |
| Kolegové ve firmě po přihlášení firemním účtem | L1 |
| Veřejný web bez sběru údajů | L2 |
| Kdokoli z internetu se sběrem údajů, obchodní partneři, zákazníci | L3 |

### 3. Co se stane, když selže nebo vrátí chybný výsledek?

| Dopad | Nejnižší úroveň |
|---|---|
| Nic podstatného, jde o experiment | L0 |
| Zdrží se práce týmu, dá se to obejít ručně | L1 |
| Závisí na tom finanční rozhodnutí nebo nabídka pro zákazníka | L2 |
| Ohrožení zákazníků, bezpečnosti objektů nebo pověsti značky | L3 |

## Čtyři úrovně a jejich požadavky

Každá vyšší úroveň zahrnuje všechny požadavky nižších úrovní.

| Úroveň | Kdo ji používá | Data | Požadavky navíc |
|---|---|---|---|
| **L0 – Osobní experiment** | Pouze autor, bez nasazení | Fiktivní nebo veřejná | Kostra projektu a automatické kontroly |
| **L1 – Týmová pomůcka** | Kolegové po přihlášení firemním účtem | Interní bez osobních údajů | Charta aplikace, nezávislá AI kontrola větve a bezpečnostní review, podmínky spuštění, spuštění potvrzuje správce provozu |
| **L2 – Firemní nástroj** | Firma, případně veřejný web bez sběru údajů | Osobní údaje zaměstnanců, obchodní data z ručního exportu | Odborné code review (nikdy autor ani agent, který kód napsal), test oprávnění, souhlas vlastníka zdrojových dat, schválení spuštění vlastníkem i schvalovatelem, zálohy s ověřenou obnovou, posouzení ochrany osobních údajů |
| **L3 – Kritická aplikace** | Zákazníci, partneři, veřejnost | Data zákazníků, citlivá data | Bezpečnostní test před spuštěním (nezávislý odborník), posouzení vlivu na ochranu osobních údajů (DPIA, GDPR čl. 35), plán řešení incidentů, garantovaný provoz |

**Přímé napojení na firemní systém není povolené na žádné úrovni.** Aplikace pracuje jen s ručním exportem, který do ní vloží pověřená osoba.

**Vyšší úroveň neznamená zákaz, ale víc kontrol.** Aplikace L2 a L3 se staví stejným postupem, jakmile úroveň schválí schvalovatel. Na všech úrovních se vyvíjí jen s fiktivními daty; skutečná data dostane aplikace až v provozu. Které úrovně se zkoušejí v pilotu, rozhoduje schvalovatel se sponzorem. Proces doporučuje začít aplikacemi L1 a L2 a L3 pouštět, až jsou obsazené role odborného recenzenta a ochrany osobních údajů.

## Kdy aplikace přechází na vyšší úroveň

Většina aplikací vzniká jako L1 a časem nenápadně přejde výš. Úroveň se proto ověřuje při každé větší změně a při čtvrtletní revizi. Změnu hlásí tvůrce schvalovateli.

1. **Přibudou osobní údaje.** Stačí nové pole pro e-mail nebo import seznamu osob. Od té chvíle platí GDPR a nejméně L2.
2. **Aplikace se dostane mimo firmu.** Začnou ji používat partneři nebo zákazníci.
3. **Někdo ji chce napojit na firemní systém.** Přímé napojení není povolené.
4. **Začnou na ní záviset lidé.** Výpadek zastaví práci týmu nebo na výstupech závisejí rozhodnutí.
