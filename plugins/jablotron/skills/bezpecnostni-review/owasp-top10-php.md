# OWASP Top 10:2025 pro PHP aplikace na JBT Platform

Kontroly pro PHP šablonu (`jablotron-app-php-template`): čisté PHP 8.1+, stránky v `public/*.php` za bránou `public/app/gate.php`, přihlášení přes rozcestník jbtplatform.cz (`auth-guard.php`), povolené sítě (`ipguard.php`), PDO s MySQL na hostingu. Vychází z `docs/SECURITY.md` repa jbtplatform.cz: co zajišťuje platforma, aplikace neobchází ani nevypíná. U každé kategorie je, co hledat, kde to v kódu bývá a typické CWE. Mapování na ASVS, ISO 27001 a GDPR je v [normy.md](normy.md).

Hledej vzorem (Grep) i čtením: chyba v oprávnění bývá v tom, co v kódu **chybí**. `public/ipguard.php` a `public/auth-guard.php` jsou kopie z jbtplatform.cz; hodnoť jen to, jestli je změna neoslabila.

## A01 Broken Access Control – řízení přístupu

- Každý soubor `public/**/*.php` mimo `public/app/` je veřejně dostupná adresa. Každý (kromě `health.php`) má jako první require `require __DIR__ . '/app/gate.php';` a před ním žádný výstup. Guardy se nenačítají jinak a nic je neobchází. (CWE-306, CWE-862)
- Každá stránka s daty volá `require_role(...)` dřív, než data načte. Každá zápisová akce (POST) volá `require_role(...)` s rolemi, které ji smějí, i když formulář jiné roli není vidět. API (`JBT_AUTH_JSON`) stejně. (CWE-862, CWE-285)
- Role odpovídají tabulce rolí ve specifikaci. Role se odvozuje jen v `public/app/permissions.php` (rozcestník, `config.local.php` → `editors`), nikdy z parametru požadavku, skrytého pole nebo cookie. (CWE-284, CWE-639)
- **IDOR:** ID záznamu z `$_GET`/`$_POST` se nepoužije bez ověření, že na záznam má uživatel nárok (`WHERE id = ? AND vlastnik = ?`). (CWE-639, CWE-863)
- Zápisy jen přes POST: formulář se skrytým polem `_csrf`, z JavaScriptu `apiWrite`. CSRF token ověřuje brána u každého požadavku kromě GET a HEAD; změna `brana.php`, která to oslabí, je kritický nález. Akce měnící data přes GET (odkaz „smazat“) je nález. (CWE-352)
- Přesměrování jen přes `redirect()` na stránku této aplikace, nikdy na adresu z požadavku. (CWE-601)
- Hromadné akce (smazat vše, import nahrazující data) mají jen role, kterým je specifikace dává.

**Kde hledat:** `public/*.php` bez `gate.php`, `$_GET[`, `$_POST[`, `REQUEST_METHOD`, `WHERE id = ?` bez podmínky na uživatele, `header('Location`, `role`.

## A02 Security Misconfiguration – chybné nastavení

- Bezpečnostní hlavičky a CSP v `public/app/bootstrap.php` nejsou oslabené: `script-src 'self'` s nonce, bez `unsafe-inline` a `unsafe-eval`, `frame-ancestors 'none'`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, HSTS. (CWE-693, CWE-1021)
- `display_errors` zůstává vypnuté, chyby se uživateli nezobrazují (výjimky převádí obecná stránka s ID). Žádné `phpinfo()`, `var_dump`, `print_r`, ladicí výpisy, testovací ani diagnostické skripty. (CWE-209, CWE-489)
- `.htaccess` dál blokuje `config.local.php`, `jbt-token.php`, guardy, skryté soubory a složku `app/` (má vlastní `.htaccess` s `Require all denied`). Nová citlivá cesta (záloha, export, upload) leží v `app/storage/`, ne ve veřejné části. (CWE-538, CWE-552)
- Žádné CORS hlavičky, uploady ani funkce, které aplikace nepotřebuje.
- Vývojové přihlášení zůstává jen v `tools/dev/` (na hosting se nenahrává) a `vyvojovy_rezim()` nejde zapnout mimo vestavěný server PHP.

**Kde hledat:** `bootstrap.php`, `header(`, `ini_set`, `.htaccess`, `phpinfo`, `var_dump`, `print_r`, `error_reporting`.

## A03 Software Supply Chain Failures – dodavatelský řetězec

- Knihovny jen přes Composer: zamčené v `composer.lock`, nainstalované do `public/app/vendor/` (ne do gitu), `composer.json` bez pluginů (`allow-plugins` prázdné), skriptů a vlastních repozitářů. Nová knihovna bez zdůvodnění v popisu pull requestu, málo udržovaná, opuštěná nebo zbytečná (šablona to umí) je nález. `package.json` a `vendor/` v gitu jsou nález vždy.
- Žádné skripty, styly, písma ani obrázky z cizích domén (CDN). Vše je v `public/assets/`.
- GitHub Actions jsou připnuté na konkrétní commit (SHA) nebo od vydavatele GitHub; nástroje v CI se stahují s ověřeným kontrolním součtem (gitleaks, PHPStan).
- `public/ipguard.php` a `public/auth-guard.php` odpovídají šabloně z jbtplatform.cz (kromě `JBT_AUTH_SLUG`). (CWE-1104, CWE-1395)

**Kde hledat:** kořen repozitáře, `.github/workflows/`, `<script src=`, `<link href=`, `https://` v `public/`.

## A04 Cryptographic Failures – kryptografie

- Tokeny, odkazy ke stažení a identifikátory, které nesmí jít uhodnout, vznikají z `random_bytes()` / `bin2hex(random_bytes(…))`, nikdy z `rand()`, `mt_rand()`, `uniqid()` ani času. (CWE-338, CWE-330)
- Pro bezpečnostní účely žádné `md5`/`sha1` (`asset_version()` je jen otisk souboru pro mezipaměť). Porovnání tajných hodnot přes `hash_equals()`. (CWE-327, CWE-208)
- Nic citlivého v adrese (URL), v `localStorage`, v cookie ani v `audit()`. (CWE-312, CWE-598)
- Kód aplikace nevypíná ověření TLS (`CURLOPT_SSL_VERIFYPEER => false`, `verify_peer => false`). (CWE-295)
- Tajné hodnoty jen v `config.local.php` na hostingu (čte se přes `config()`) nebo v GitHub secrets, nikdy v kódu. (CWE-798)

**Kde hledat:** `rand(`, `mt_rand`, `uniqid`, `md5(`, `sha1(`, `==` u tokenů, `SSL_VERIFY`, `verify_peer`, řetězce podobné heslům.

## A05 Injection – vkládání kódu

- SQL jen přes `db()` s `prepare` a otazníky; hodnota spojená do SQL (`"… $x"`, `'…' . $x`) je kritický nález. Názvy sloupců a řazení z požadavku jen z pevného seznamu. (CWE-89)
- Každá hodnota do HTML přes `e()`, do JavaScriptu přes `json_encode()`. Výjimka jsou jen pomocníci, kteří vracejí pevné HTML (`icon()`, `znacka_svg()`, `prepinac_vzhledu()`). (CWE-79)
- Adresa od uživatele v `href` nebo `src` jen se schématem `http:` nebo `https:`. (CWE-79)
- Žádné `eval`, `exec`, `system`, `shell_exec`, `passthru`, `popen`, `proc_open`, zpětné uvozovky, `unserialize`, `extract`, `$_REQUEST`. (CWE-78, CWE-94, CWE-502, CWE-621)
- Cesty k souborům z dat od uživatele jen po kontrole proti pevné složce, bez `..`; `include`/`require` nikdy s proměnnou z požadavku. (CWE-22, CWE-98)
- Žádné `file_get_contents`/`curl` na adresu převzatou od uživatele (SSRF). Jediné volání ven jsou guardy na rozcestník. (CWE-918)
- `preg_*` se vzorem sestaveným z dat od uživatele jen přes `preg_quote`. (CWE-1333)
- **Export do CSV:** hodnoty začínající `=`, `+`, `-`, `@` se upraví, aby se v Excelu nespustily jako vzorec. (CWE-1236)
- Text od uživatele do `audit()` nebo `error_log` bez zalomení řádků. (CWE-117)

**Kde hledat:** `->query(`, `->exec(`, `->prepare(` s proměnnou, `<?=` bez `e(`, `echo $`, `eval(`, `exec(`, `include $`, `file_get_contents(`, `curl_init(`, `preg_match($`.

## A06 Insecure Design – návrh

Polož si u každé nové funkce otázky zneužití a odpověď hledej v kódu, ne v dokumentaci:

- Co když to zavolá přihlášený uživatel s jinou rolí nebo z jiného týmu či regionu (přímým POST požadavkem, bez formuláře)?
- Co když nahraje obří, prázdný, binární nebo zlomyslný soubor? Platí limit velikosti (5 MB), počtu řádků a typu i podle obsahu, ne jen přípony? (CWE-434, CWE-770)
- Co když akci zopakuje tisíckrát za sebou? Drahé akce (import, export, výpočty nad celou databází) mají limit. (CWE-770)
- Platí obchodní pravidla na serveru, nebo jen ve formuláři či v JavaScriptu? (CWE-602)
- Ukládá a zobrazuje aplikace jen údaje, které specifikace potřebuje (minimalizace dat)?
- Dostane prohlížeč (HTML, `api.php`) jen to, co potřebuje, ne celý záznam z databáze? (CWE-200)

## A07 Authentication Failures – přihlášení

- Aplikace nemá vlastní přihlašování, hesla, registraci ani vlastní cookies. Uživatele vrací jen brána (`$jbt_user` z `auth-guard.php`). `password_hash`, `password_verify`, `setcookie` nebo formulář s heslem v aplikaci jsou kritický nález. (CWE-287, CWE-306)
- Nastavení session v `bootstrap.php` zůstává (`strict_mode`, `HttpOnly`, `Secure`, `SameSite`).
- Odkazy s tokenem (ke stažení, pozvánky) mají omezenou platnost a jdou použít jen jednou, pokud dávají přístup. (CWE-613)
- Žádné natvrdo zapsané identity, výchozí účty ani „zadní vrátka“ pro testy mimo `tools/dev/`. (CWE-798)

## A08 Software or Data Integrity Failures – integrita

- Import dat je vše-nebo-nic: chybný řádek znamená, že se neuloží nic (transakce). Data z importu prošla `validate_rows`, nevěří se jim. (CWE-345, CWE-20)
- `json_decode` jen s následnou kontrolou struktury; `unserialize` vůbec. (CWE-502)
- Hotové migrace v `public/app/migrations/` se nemění; změna je nová migrace. Migrace nespouští nic staženého.
- Nasazuje se jen workflow `deploy.yml` z `main` po úspěšných kontrolách. Změny v `.github/`, `tools/`, `.semgrep/`, `phpstan.neon`, `.htaccess` jsou zdůvodněné a neoslabují kontroly ani nasazení. (CWE-494, CWE-693)

## A09 Security Logging and Alerting Failures – záznamy a upozornění

- Import dat, mazání a změny oprávnění se zapisují přes `audit(...)`. Zamítnutý přístup zapisuje `require_role` a odmítnuté CSRF `csrf_check` samy, kód je nesmí obcházet. Přihlášení zapisuje brána. (CWE-778)
- `audit()` obsahuje kdo, co a nad čím, nikdy osobní údaje navíc, obsah dat, tokeny ani hesla. (CWE-532)
- `health.php` nevrací nic citlivého (cesty, texty chyb, přístupy) a hlásí nefunkční databázi a úložiště.
- Od L2: bezpečnostní události (opakovaně zamítnutý přístup, hromadné mazání) mají upozornění odpovědné osobě a stanovenou dobu uchování záznamů.

## A10 Mishandling of Exceptional Conditions – chybové stavy

- Při jakékoli chybě v kontrole oprávnění, CSRF nebo validaci aplikace **zamítne**, nepustí dál (fail closed). (CWE-636, CWE-755)
- Žádné prázdné `catch` ani `catch` vracející výchozí hodnotu tam, kde by se pokračovalo s neověřenými daty. (CWE-390, CWE-703)
- Vícekrokový zápis běží v transakci (`beginTransaction` … `commit`, při chybě `rollBack`). (CWE-460)
- Uživatel vidí srozumitelnou hlášku bez technických detailů, detail jde jen do `error_log`. (CWE-209)
- Chybějící nebo prázdná data (prázdný soubor, žádné záznamy, chybějící klíč v poli) nevedou k pádu ani k nesprávnému výsledku.

## Vědomě přijaté v šabloně

Tyto vlastnosti šablony nehlas jako nález, pokud je změna nezhoršuje:

- `ipguard.php` pustí aplikaci, když rozcestník neodpovídá (`ALLOW_WHEN_HUB_UNREACHABLE`); přihlášení přes `auth-guard.php` v tu chvíli selže bezpečně (rozhodnutí platformy, `docs/SECURITY.md` v repu jbtplatform.cz).
- Nasazení přes lftp s vypnutým ověřením certifikátu FTP serveru (certifikát hostingu zní na jinou doménu; rozhodnutí platformy).
- Vývojové přihlášení v `tools/dev/`, které se na hosting nenahrává a mimo vestavěný server PHP nejde zapnout.
- Databáze SQLite ve vývoji a testech, MySQL na hostingu.
- `asset_version()` s `md5` jako otisk pro mezipaměť prohlížeče, ne pro bezpečnost.
