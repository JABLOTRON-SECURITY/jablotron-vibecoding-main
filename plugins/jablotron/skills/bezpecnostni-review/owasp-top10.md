# OWASP Top 10:2025 pro aplikace ze šablony

Kontroly pro stack šablony: Next.js (App Router, serverové akce, route handlery), React, Drizzle ORM, zod, papaparse a read-excel-file. U každé kategorie je, co hledat, kde to v kódu bývá a typické CWE. Mapování na ASVS, ISO 27001 a GDPR je v [normy.md](normy.md).

Hledej vzorem (Grep) i čtením: chyba v oprávnění bývá v tom, co v kódu **chybí**.

## A01 Broken Access Control – řízení přístupu

- Každá serverová akce (soubor s `"use server"`) je veřejný koncový bod: kdokoli ji může zavolat přímo, i bez tlačítka v UI. Každá exportovaná funkce musí na začátku volat `vyzadujRoli(...)`. (CWE-862, CWE-306)
- Každý route handler (`src/app/**/route.ts`) s neveřejnými daty nebo zápisem volá `vyzadujRoli(...)`. Výjimka je jen `api/zdravi`.
- Stránka s neveřejnými daty volá `uzivatelSRoli(...)` dřív, než data načte, a bez role vrátí `<BezOpravneni />`.
- Role odpovídají tabulce rolí ve specifikaci. Akce není dostupná víc rolím, než má.
- **IDOR:** ID záznamu z formuláře, adresy nebo parametru akce se nepoužije bez ověření, že na záznam má uživatel nárok (vlastník, tým, region). (CWE-639, CWE-863)
- Oprávnění se nebere z dat od klienta (skryté pole formuláře, parametr `role`, cookie bez ověření). (CWE-284)
- Kontrola oprávnění jen v `proxy.ts` / `middleware.ts` nestačí, akce a stránky ji musí mít samy.
- Route handler, který mění data a spoléhá na cookie, musí odmítnout požadavky z cizího původu (kontrola hlavičky `Origin`) nebo přijímat jen JSON s vlastní hlavičkou. Serverové akce mají ochranu proti CSRF vestavěnou, route handlery ne. (CWE-352)
- Přesměrování (`redirect()`, `router.push`, `href`) na adresu od uživatele jen po kontrole, že vede do aplikace. (CWE-601)
- Hromadné akce (smazat vše, import nahrazující data) mají jen role, kterým je specifikace dává.

**Kde hledat:** `"use server"`, `export async function`, `route.ts`, `params`, `searchParams`, `formData.get(`, `redirect(`, `.where(` bez podmínky na uživatele.

## A02 Security Misconfiguration – chybné nastavení

- Bezpečnostní hlavičky v `next.config.ts` nejsou oslabené: CSP bez `unsafe-eval` v produkci, `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. Změna hlaviček musí mít zdůvodnění. (CWE-693, CWE-1021)
- Žádné `Access-Control-Allow-Origin: *` ani jiné CORS hlavičky u API bez důvodu.
- Žádné ladicí stránky, testovací endpointy, `console.log` s daty, natvrdo zapsaní uživatelé, vývojové přihlášení zapnuté v produkci. (CWE-489, CWE-798)
- Chyby uživateli neukazují výpis, SQL ani cesty; `error.tsx` ukazuje jen obecnou hlášku. (CWE-209)
- V produkci nejsou zdrojové mapy pro prohlížeč (`productionBrowserSourceMaps`) ani `poweredByHeader`.
- Proměnné s předponou `NEXT_PUBLIC_` jsou veřejné, nesmí obsahovat nic tajného. (CWE-200)
- `next/image` nemá `remotePatterns` s hvězdičkou pro libovolnou doménu.

**Kde hledat:** `next.config.ts`, `headers(`, `Access-Control`, `NEXT_PUBLIC_`, `console.log`, `DEV_UZIVATEL`, `debug`, `test`.

## A03 Software Supply Chain Failures – dodavatelský řetězec

- Každá nová závislost je zdůvodněná, běžně používaná, udržovaná a její název není podvrh známého balíčku (překlep, podobný název). Čerstvě vydané nebo málo stahované balíčky jsou podezřelé.
- `pnpm-lock.yaml` je součástí změny, když se měnily závislosti. Verze se instalují podle zámku.
- `pnpm-workspace.yaml` neoslabuje `minimumReleaseAge` ani nepovoluje instalační skripty bez důvodu (`onlyBuiltDependencies`, `ignoredBuiltDependencies`).
- Žádné skripty, styly ani písma z cizích domén (CDN). Vše je v repozitáři.
- GitHub Actions jsou připnuté na konkrétní commit (SHA), nové akce jen od důvěryhodných vydavatelů.
- Výsledek `pnpm audit`: známé zranitelnosti vysoké a kritické jsou nález. (CWE-1104, CWE-1395)

**Kde hledat:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.github/workflows/`, `<script src=`, `https://` v kódu.

## A04 Cryptographic Failures – kryptografie

- Tokeny, odkazy ke stažení a identifikátory, které nesmí jít uhodnout, vznikají z `crypto.randomUUID()` nebo `crypto.randomBytes()`, nikdy z `Math.random()` nebo času. (CWE-338, CWE-330)
- Pro bezpečnostní účely žádné MD5 ani SHA-1. Hesla aplikace neukládá vůbec (přihlášení řeší firma). (CWE-327, CWE-328)
- Porovnání tajných hodnot (tokeny) přes `crypto.timingSafeEqual`, ne `===`. (CWE-208)
- Nic citlivého v adrese (URL), v `localStorage` ani v logu. (CWE-312, CWE-598)
- Kód nevypíná ověření TLS certifikátu (`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED`). (CWE-295)
- Tajné hodnoty jen přes `src/lib/env.ts` z proměnných prostředí, nikdy v kódu. (CWE-798)

**Kde hledat:** `Math.random`, `createHash(`, `md5`, `sha1`, `===` u tokenů, `localStorage`, `rejectUnauthorized`, `process.env`.

## A05 Injection – vkládání kódu

- SQL jen přes Drizzle (`db.select()`, `db.insert()`…) nebo tagovaný `sql\`…\`` s hodnotami jako parametry. `sql.raw()` a skládání SQL z řetězců s daty od uživatele je kritický nález. Názvy sloupců a řazení z požadavku jen z pevného seznamu. (CWE-89)
- Žádné `dangerouslySetInnerHTML`, `eval`, `new Function`, `setTimeout` s řetězcem, `innerHTML`. (CWE-79, CWE-94)
- Adresa od uživatele v `href` nebo `src` jen se schématem `http:` nebo `https:` (ne `javascript:`, `data:`). (CWE-79)
- Žádné spouštění příkazů (`child_process`, `exec`, `spawn`) s daty od uživatele. (CWE-78, CWE-77)
- Cesty k souborům z dat od uživatele (`fs`, `path.join`) jen po kontrole proti pevné složce, bez `..`. (CWE-22)
- Žádný `fetch` na adresu převzatou od uživatele (SSRF). (CWE-918)
- Regulární výraz se nesestavuje z dat od uživatele a nemá vnořené opakování nad dlouhým vstupem (ReDoS). (CWE-1333)
- Slučování objektů z požadavku (`Object.assign`, spread do konfigurace) neumožní přepsat `__proto__` ani nečekané vlastnosti. (CWE-1321, CWE-915)
- **Export do CSV nebo Excelu:** hodnoty začínající `=`, `+`, `-`, `@` se upraví, aby se v Excelu nespustily jako vzorec. (CWE-1236)
- Text od uživatele zapisovaný do logu nesmí obsahovat zalomení řádku, které by podvrhlo další záznam. (CWE-117)

**Kde hledat:** `sql.raw`, `sql\``, `dangerouslySetInnerHTML`, `eval(`, `new Function`, `child_process`, `exec(`, `fs.`, `path.join`, `fetch(`, `new RegExp(`, `Object.assign`, `href={`.

## A06 Insecure Design – návrh

Polož si u každé nové funkce otázky zneužití a odpověď hledej v kódu, ne v dokumentaci:

- Co když to zavolá přihlášený uživatel s jinou rolí nebo z jiného týmu či regionu?
- Co když nahraje obří, prázdný, poškozený nebo zlomyslný soubor? Je omezená velikost (5 MB), počet řádků a typ podle obsahu, ne jen podle přípony? Soubor `.xlsx` je zip: limit velikosti musí platit před rozbalením. (CWE-434, CWE-409)
- Co když akci zopakuje tisíckrát za sebou? Drahé akce (import, export, výpočty nad celou databází) mají limit. (CWE-770)
- Platí obchodní pravidla na serveru (stav reklamace, povinná pole, rozsahy hodnot), nebo jen ve formuláři? (CWE-602)
- Ukládá a zobrazuje aplikace jen údaje, které specifikace potřebuje (minimalizace dat)?
- Dostane prohlížeč jen to, co potřebuje? Klientská komponenta (`"use client"`) nedostane celý záznam z databáze, jen vybraná pole. (CWE-200)
- Cache (`"use cache"`, `unstable_cache`, `fetch` s cache) nesdílí data jednoho uživatele s jiným ani obsah závislý na roli. (CWE-524)

## A07 Authentication Failures – přihlášení

- Aplikace nemá vlastní přihlašování, hesla ani registraci. Uživatele vrací jen `aktualniUzivatel()` ze `src/lib/auth.ts`. Vlastní login je kritický nález. (CWE-287, CWE-306)
- Vývojové přihlášení (`DEV_UZIVATEL_*`) zůstává zablokované v produkci. Funkce `aktualniUzivatel()` v produkci bez firemního přihlášení selže.
- Pokud aplikace nastavuje vlastní cookie: `httpOnly`, `secure`, `sameSite: "lax"` nebo přísnější, omezená platnost. (CWE-1004, CWE-614)
- Odkazy s tokenem (ke stažení, pozvánky) mají omezenou platnost a jdou použít jen jednou, pokud dávají přístup. (CWE-613)
- Žádné natvrdo zapsané identity, výchozí účty ani „zadní vrátka“ pro testy. (CWE-798)

## A08 Software or Data Integrity Failures – integrita

- Import dat je vše-nebo-nic: chybný řádek znamená, že se neuloží nic (transakce). Data z importu se validují schématem zod, nevěří se jim. (CWE-345, CWE-20)
- Žádná deserializace nedůvěryhodných dat jinak než přes `JSON.parse` a následnou validaci schématem. (CWE-502)
- Žádné stahování a spouštění kódu za běhu, žádné `curl | sh` ve skriptech, žádné aktualizace bez ověření otisku. (CWE-494)
- Změny v `.github/`, `scripts/`, `.husky/`, `.semgrep/` jsou zdůvodněné a neoslabují kontroly ani nasazení. (CWE-693)

## A09 Security Logging and Alerting Failures – záznamy a upozornění

- Import dat, mazání a změny oprávnění se zapisují přes `zapisAudit(...)`. Zamítnutý přístup k akci zapisuje `vyzadujRoli` sama, kód ji nesmí obcházet. (CWE-778)
- Auditní záznam obsahuje kdo, co, kdy a nad čím, nikdy osobní údaje, obsah dat, tokeny ani hesla. (CWE-532)
- Chyba při zápisu auditu nesmí akci tiše dovolit, když audit vyžaduje specifikace.
- Od L2: bezpečnostní události (opakovaně zamítnutý přístup, hromadné mazání) mají upozornění odpovědné osobě.

## A10 Mishandling of Exceptional Conditions – chybové stavy

- Při jakékoli chybě v kontrole oprávnění nebo validaci aplikace **zamítne**, nepustí dál (fail closed). (CWE-636, CWE-755)
- Žádné prázdné `catch {}` ani `catch` vracející výchozí hodnotu tam, kde by se pokračovalo s neověřenými daty. (CWE-390, CWE-703)
- Vícekrokový zápis běží v transakci a při chybě se vrátí celý. (CWE-460)
- Uživatel vidí srozumitelnou hlášku bez technických detailů, detail jde jen do logu serveru. (CWE-209)
- Neošetřené odmítnutí slibu (promise) nebo výjimka v route handleru neshodí aplikaci a nevrátí výpis chyby. (CWE-248)
- Chybějící nebo prázdná data (`null`, prázdný soubor, žádné záznamy) nevedou k pádu ani k nesprávnému výsledku.

## Vědomě přijaté v šabloně

Tyto vlastnosti šablony nehlas jako nález, pokud je změna nezhoršuje:

- CSP povoluje `'unsafe-inline'` pro skripty a styly, protože ho Next.js potřebuje. Od L2 zvaž přechod na CSP s nonce.
- Vývojové přihlášení v `src/lib/auth.ts`, které se v produkci samo zablokuje.
- Vývojová a testovací MySQL bez hesla, dostupná jen na 127.0.0.1 (`scripts/mysql.mjs`). V provozu se k MySQL připojuje přes proměnnou `DATABAZE`.

## Aplikace, která volá AI model

Jen když kód volá jazykový model (Claude, OpenAI apod.), projdi navíc OWASP Top 10 pro LLM aplikace (2025):

- Odeslání dat modelu mimo firmu je **posun úrovně rizika** a musí to povolit charta (třídy dat). (LLM02)
- Vstup od uživatele ani obsah souborů nesmí měnit instrukce modelu bez kontroly (prompt injection). (LLM01)
- Výstup modelu se nevkládá do HTML, SQL ani příkazů bez stejné kontroly jako vstup od uživatele. (LLM05)
- Model nemá oprávnění dělat akce (mazat, posílat, zapisovat) bez potvrzení člověkem. (LLM06)
- Klíč k API je jen na serveru a volání mají limit počtu i ceny. (LLM10)
