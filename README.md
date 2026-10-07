# Vibecoding v Jablotronu

Všechno pro vývoj interních aplikací s Claude Code na jednom místě: pravidla, plugin se sdílenými skills, návod pro IT a šablony dokumentů. Šablony samotných aplikací jsou v samostatných repozitářích: `jablotron-app-next-template` (Next.js, výchozí) a `jablotron-app-php-template` (PHP pro aplikace na rozcestníku JBT Platform). Postup a skills jsou pro obě stejné, rozdíly shrnuje [plugins/jablotron/reference/sablony.md](plugins/jablotron/reference/sablony.md).

## Kdo tu co najde

| Jsem… | Začněte tady |
|---|---|
| **Tvůrce aplikace** | [Tahák pro tvůrce](TAHAK.md) → [nový nápad](../../issues/new?template=napad.yml) |
| **Schvalovatel** | [Proces](proces/README.md) → [rozhodnutí o nápadu](sablony/rozhodnuti-o-napadu.md) |
| **Správce provozu** | [Podmínky spuštění](plugins/jablotron/reference/podminky-spusteni.md) → [čtvrtletní revize](sablony/ctvrtletni-revize.md) |
| **Administrátor IT** | [Návod k nastavení](nastaveni/NAVOD-PRO-ADMINA.md) |

## Co je v repozitáři

| Složka | Obsah |
|---|---|
| `proces/` | Popis procesu: od nápadu po vyřazení, role, změny, revize |
| `plugins/jablotron/` | Plugin pro Claude Code: skills, subagenti, pravidla pro agenta, hooky |
| `plugins/jablotron/reference/` | Úrovně rizika, třídy dat, pravidla a postup práce, podmínky spuštění, incident |
| `nastaveni/` | Návod pro admina (včetně doporučení pro politiku Claude Code), pravidla pro GitHub, skript pro přehled aplikací |
| `sablony/` | Šablony: rozhodnutí o nápadu, čtvrtletní revize, vyřazení aplikace |
| `.github/ISSUE_TEMPLATE/` | Formulář pro podání nového nápadu |

## Skills v pluginu

Tvůrce je spouští v Claude Code příkazem, agent je ale použije i sám, když se na situaci hodí. Postup je navržený pro tvůrce, kteří nejsou programátoři.

**Postup od nápadu po pull request**

| Příkaz | K čemu |
|---|---|
| `/jablotron:specifikace` | Zadání: záměr, tři otázky pro zařazení, varianty řešení, charta a specifikace s kritérii hotového řešení |
| `/jablotron:plan` | Implementační plán do `docs/plans/`: úkoly s testy napřed a shrnutí pro tvůrce |
| `/jablotron:implementace` | Stavba podle plánu úkol po úkolu, nezávislá kontrola celé větve (u větších plánů i každého úkolu), tvůrce zkouší každé kritérium |
| `/jablotron:dokonceni` | Ověření, bezpečnostní review, pull request a krátké shrnutí změny, bez dalšího ptaní |
| `/jablotron:pripominky` | Vyřízení připomínek z review u pull requestu |
| `/jablotron:ladeni` | Hledání příčiny chyby, oprava s testem |

**Kontroly a péče o aplikaci**

| Příkaz | K čemu |
|---|---|
| `/jablotron:bezpecnostni-review` | Nezávislé bezpečnostní review změn nebo celé aplikace podle OWASP Top 10:2025, ASVS, CWE a ISO 27001 |
| `/jablotron:vysvetli-zmenu` | Krátké shrnutí změny pro tvůrce a podrobný popis pull requestu pro recenzenty |
| `/jablotron:predani-projektu` | Příprava aplikace k převzetí jiným člověkem |
| `/jablotron:nasazeni` | Kontrola podmínek spuštění a podklad pro správce provozu |

**Na pozadí** (agent je používá sám, v nabídce příkazů nejsou): `testy-napred` (test před kódem), `overeni` (žádné „hotovo“ bez důkazu), `firemni-identita` (vzhled Jablotronu a české texty u každé obrazovky), subagenti `provedeni-ukolu`, `kontrola-ukolu`, `kontrola-vetve` a `bezpecnostni-recenzent` a hooky (pravidla a stav aplikace na začátku relace, ochrana hlavní větve a kontrol, automatické formátování).

## Jak se mění pravidla

Pravidla, skills i nastavení se mění **pull requestem do tohoto repozitáře**, který schvaluje sponzor procesu nebo jím pověřená osoba. U změny pluginu zvyšte verzi v `plugins/jablotron/.claude-plugin/plugin.json`; tvůrcům se aktualizace stáhne sama. Zásady a postup úprav jsou v [plugins/jablotron/JAK-UPRAVOVAT.md](plugins/jablotron/JAK-UPRAVOVAT.md).
