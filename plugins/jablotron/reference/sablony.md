# Dvě šablony aplikací

Postup práce, skills a pravidla jsou pro obě šablony stejné. Liší se příkazy, cesty a vzory v kódu. Skills a agenti je uvádějí pro šablonu Next.js. V PHP aplikaci použij obdobu z této tabulky; přesné znění má každá aplikace v `CLAUDE.md` (oddíly Příkazy a Vzory).

| | Next.js (`jablotron-app-next-template`) | PHP pro JBT Platform (`jablotron-app-php-template`) |
|---|---|---|
| Kdy | výchozí pro nové aplikace | aplikace na rozcestníku jbtplatform.cz (hosting vashosting.cz, přihlášení přes rozcestník) |
| Poznáš podle | `package.json`, `src/app/` | `public/app/gate.php`, `tools/` |
| Příprava po naklonování | `pnpm bootstrap` | `php tools/setup.php` |
| Spustit aplikaci | `pnpm dev` → http://localhost:3000 | `php tools/server.php` → http://localhost:8000 (`--role=reader` pro jinou roli) |
| Všechny kontroly | `pnpm check` | `php tools/check.php` (syntaxe, pravidla šablony, PHPStan, testy) |
| Jednotkové testy | `pnpm test` · `tests/unit/<oblast>.test.ts` | `php tools/test.php --unit` · `tests/unit/<oblast>.php` |
| Test jednoho kritéria | `pnpm test:e2e -g "KH-1:"` · `tests/e2e/<oblast>.spec.ts` (Playwright) | `php tools/test.php "KH-1:"` · `tests/criteria/<oblast>.php` (`Browser`: otevři stránku, odešli formulář, nahraj soubor) |
| Test s rolí čtenáře | `test.describe("čtenář")` s `URL_CTENARE` | `test('KH-n: …', function (Browser $p): void { … }, role: 'reader');` |
| Společný krok testu | `nahrajSoubor` z `tests/e2e/pomocnici.ts` | `upload_file` z `tests/helpers.php` |
| Fiktivní soubory pro testy | `tests/e2e/fixtures/` | `tests/data/` |
| Databáze ve vývoji a v testech | MySQL 8.4, kterou spouští `pnpm dev` a testy samy (`scripts/mysql.mjs`, nic se neinstaluje); testy mají vlastní prázdné databáze, v GitHubu běží proti službě MySQL | SQLite jako vývojová náhrada (v testech v dočasné složce, každý běh prázdná); migrace se píšou pro MySQL i SQLite |
| Nová stránka | `src/app/<oblast>/page.tsx`, odkaz v `src/components/navigace.tsx` | `public/<nazev>.php`, odkaz v `public/app/navigation.php` |
| Ochrana stránky | `uzivatelSRoli(...)`, bez role `<BezOpravneni />` | `require __DIR__ . '/app/gate.php';` jako první, pak `require_role(...)`; `has_role(...)` jen pro zobrazení |
| Zápisová akce | `akce.ts`: `vyzadujRoli` → schéma zod → transakce → `zapisAudit` | POST (formulář s polem `_csrf`, z JavaScriptu `apiWrite`; CSRF ověří brána): `require_role` → kontrola vstupu → transakce → `audit()` → `set_flash` a `redirect` |
| Logika | `src/lib/<oblast>.ts` | `public/app/<oblast>.php` |
| Import | `src/lib/import/`: `prectiSoubor`, `validujRadky`, `sloupceSOsobnimiUdaji` (CSV, Excel) | `public/app/import.php`: `read_uploaded_file`, `validate_rows`, `personal_data_columns` (jen CSV) |
| Databáze (vždy MySQL) | Drizzle s MySQL: `mysqlTable` v `src/lib/db/schema.ts`, migrace `pnpm db:generate` do `drizzle/`, ID nového záznamu přes `$returningId()` | `db()` a `prepare` s otazníky, migrace `public/app/migrations/NNNN-description.php` (MySQL i SQLite), hotové se nemění |
| Auditní záznam | `zapisAudit(...)` → tabulka | `audit(...)` → `app/storage/audit.log`, stránka Záznamy akcí |
| Údaje o aplikaci v rozhraní | `src/lib/aplikace.ts` | `public/app/app-info.php` |
| Vzhled | Tailwind a shadcn/ui ve vzhledu Jablotronu (`globals.css`) | `starter.css` JBT Platform (neupravuje se) a `assets/app.css` |
| Výstup do stránky | React escapuje sám; zakázané `dangerouslySetInnerHTML` | vždy `e()`; CSP zakazuje `style="…"` a skripty bez `nonce` |
| Tajné údaje | `.env.local`, jen přes `src/lib/env.ts` | `config.local.php` jen na hostingu (`config()`), GitHub secrets |
| Přihlášení | vývojové v `src/lib/auth.ts`, firemní nastaví IT | rozcestník JBT Platform (`auth-guard.php`); ve vývoji `tools/dev/login.php` |
| Nová knihovna | `pnpm add` se souhlasem tvůrce | `composer require <dodavatel/balik>` se souhlasem tvůrce a zdůvodněním v pull requestu; instaluje se do `public/app/vendor/` (není v gitu), verze zamyká `composer.lock`; npm se nepoužívá |
| Tajné údaje a závislosti v kontrolách | `pnpm secrets`, `pnpm audit --audit-level high` | kontrola před commitem, gitleaks v CI; `composer validate` a `composer audit` v kontrole Závislosti |
| Bezpečnostní podklady | `owasp-top10.md` | `owasp-top10-php.md` |
| Nasazení | zatím neurčené (rozhodne IT) | workflow `Nasazení` (FTPS na hosting) po úspěšných kontrolách v `main`, jen ve stavu pilot nebo provoz; secrets v prostředí `produkce` jen pro `main` |
| Kontrolní soubory (CODEOWNERS) | `.github/`, `.semgrep/`, `.husky/`, `.claude/`, `scripts/`, `next.config.ts`, `pnpm-workspace.yaml`, `biome.json`, `.gitignore`, `.gitattributes`, `.secretlint*` | `.github/`, `.semgrep/`, `.claude/`, `tools/`, `tests/helpers.php`, `phpstan.neon`, `public/.htaccess`, `public/app/.htaccess`, `public/app/gate.php`, `public/app/bootstrap.php`, `public/ipguard.php`, `public/auth-guard.php`, `public/assets/starter.css`, `.gitignore`, `.gitattributes`, `CHARTA.md` |
