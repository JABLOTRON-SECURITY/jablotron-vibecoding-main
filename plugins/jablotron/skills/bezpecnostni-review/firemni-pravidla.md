# Firemní pravidla Jablotronu

Pravidla, která OWASP neřeší, ale ve firmě platí vždy. Kontroluj je vedle OWASP Top 10 ([šablona Next.js](owasp-top10.md), [PHP šablona pro JBT Platform](owasp-top10-php.md)). Kde se šablony liší, je u pravidla uvedené obojí. Podklady: [úrovně rizika](../../reference/urovne-rizika.md), [třídy dat](../../reference/tridy-dat.md), [pravidla práce](../../reference/pravidla-prace.md).

## F1. Tajné údaje

- [ ] V kódu, konfiguraci, testech, komentářích ani v historii změn nejsou hesla, tokeny, API klíče, connection stringy ani privátní klíče. Výsledek `pnpm secrets` je bez nálezu (PHP: kontrola před commitem a gitleaks v CI).
- [ ] Tajné hodnoty se čtou jen přes `src/lib/env.ts`, ne přímo z `process.env` roztroušeně po kódu (PHP: jen přes `config()` z `config.local.php` na hostingu, nebo GitHub secrets).
- [ ] `.env.local`, `config.local.php`, `jbt-token.php` ani jiný soubor s tajnými hodnotami není v gitu. `.env.example` a `config.local.example.php` obsahují jen názvy a zástupné hodnoty.

## F2. Data a osobní údaje

- [ ] V repozitáři nejsou skutečná data: exporty, výpisy, snímky obrazovky se skutečnými údaji. Ukázková data jsou fiktivní a jen v `data/sample/` a `tests/e2e/fixtures/` (PHP: `tests/data/`).
- [ ] Nová pole, importy ani výstupy nezavádějí osobní údaje (jméno, e-mail, telefon, adresa, číslo zaměstnance, identifikátor zákazníka nebo objektu), pokud to charta výslovně nepovoluje.
- [ ] Import u aplikací L0 a L1 volá `sloupceSOsobnimiUdaji(...)` (PHP: `personal_data_columns(...)`) a soubor s takovými sloupci odmítne.
- [ ] Do logů, auditního záznamu ani chybových hlášek se nezapisují osobní údaje ani obsah importovaných souborů.

## F3. Úroveň rizika

- [ ] Změna neposouvá aplikaci na vyšší úroveň, než má v `CHARTA.md`: nové osobní údaje, nový okruh uživatelů (mimo firmu), závislost rozhodnutí nebo práce týmu na výsledcích, odesílání dat mimo firmu (včetně AI služeb).
- [ ] Posun úrovně hlas vždy jako 🟠 nebo 🔴, i když je kód technicky v pořádku. Řešení je aktualizovat chartu a nechat úroveň schválit, ne „opravit kód“.

## F4. Napojení na firemní systémy

- [ ] Aplikace se nepřipojuje přímo na firemní systém (ERP, CRM, interní databáze, interní API, sdílené disky, firemní e-mail). Jediný zdroj dat je ruční import nebo ruční zadání. Nález je vždy 🔴.

## F5. Obcházení kontrol

- [ ] Změna nevypíná ani neobchází kontroly: `// @ts-ignore`, `@ts-expect-error`, `biome-ignore`, `nosemgrep`, `gitleaks:allow`, `.gitleaksignore`, `.semgrepignore`, `test.skip`, `test.only`, `--no-verify`, `@phpstan-ignore`, `phpstan-baseline`, snížená úroveň v `phpstan.neon`, snížené limity, zakomentované nebo oslabené testy.
- [ ] Změny v kontrolních souborech podle `.github/CODEOWNERS` (seznam je v `CLAUDE.md` aplikace, oddíl „Co nedělat“) jsou zdůvodněné v popisu pull requestu.

## F6. Vzory šablony

Šablona Next.js:

- [ ] Serverová akce: `vyzadujRoli(...)` → kontrola vstupu schématem zod → zápis v transakci → `zapisAudit(...)` → srozumitelný výsledek.
- [ ] Import jen přes `prectiSoubor` a `validujRadky` ze `src/lib/import/`, žádné vlastní čtení CSV nebo Excelu.
- [ ] Databáze jen MySQL přes Drizzle a `src/lib/db/` (`mysqlTable`), po změně schématu je migrace v `drizzle/`. Žádná jiná databáze ani úložiště dat (soubory, úložiště v prohlížeči).
- [ ] Rozhraní z komponent `src/components/ui/`, české texty a formáty přes `src/lib/format.ts`.

PHP šablona pro JBT Platform:

- [ ] Stránka: `require __DIR__ . '/app/gate.php';` jako první → `require_role(...)` → data → `page_start(...)` … `page_end()`.
- [ ] Zápisová akce: POST (formulář s polem `_csrf`, CSRF ověřuje brána) → `require_role(...)` → kontrola vstupu → zápis v transakci → `audit(...)` → `set_flash(...)` a `redirect(...)`.
- [ ] Import jen přes `read_uploaded_file` a `validate_rows` z `public/app/import.php`.
- [ ] Databáze jen přes `db()` a `prepare` s otazníky, změna tabulek jako nová migrace v `public/app/migrations/`; hotové migrace se nemění.
- [ ] Rozhraní z tříd `starter.css` (JBT Platform), doplňky v `assets/app.css`, výstup přes `e()`, české formáty z `public/app/format.php`.

## F7. Soulad se zadáním

- [ ] Změna dělá jen to, co je ve specifikaci (`SPEC.md` a části v `docs/spec/`). Nové chování mimo specifikaci je nález „rozšíření rozsahu bez zadání“.
- [ ] Nic z oddílu „Co aplikace nesmí“ není porušené.
- [ ] Ke každému novému kritériu hotového řešení existuje test. Oprávnění jsou otestovaná i s rolí, která akci nesmí.
