# Firemní identita v PHP aplikaci (JBT Platform)

Platí pro aplikace z PHP šablony (`jablotron-app-php-template`, mají `public/app/gate.php`). Zásady ze [SKILL.md](SKILL.md) (žlutá jako signál, světlý i tmavý vzhled, stavy obrazovky, texty, formáty, přístupnost) platí beze změny. Liší se jen to, **čím** se to v kódu dělá: místo Tailwindu a shadcn/ui jsou to třídy z `public/assets/starter.css`, designového systému JBT Platform. Hodnoty značky jsou v [znacka.md](znacka.md).

## Co je hotové v šabloně

| Co | Kde |
|---|---|
| Tmavý postranní panel s logem, názvem aplikace, navigací, přepínačem vzhledu a přihlášeným uživatelem; na mobilu (pod 900 px) horní lišta se žlutým proužkem a tlačítkem menu | `public/app/rozvrzeni.php` (`page_start`, `page_end`) |
| Odkazy v navigaci a jejich ikony | `public/app/navigation.php` (`navigation()`, `icon()`) |
| Obsah (max. 1 120 px), patička s vlastníkem a kontaktem pro incident, vodoznak loga, „Přeskočit na obsah“, písmo Jablo | `layout.php`, `starter.css`, `public/assets/fonts/` |
| Barvy ve třech blocích (světlé, systémové tmavé, ručně zvolené tmavé), všechny komponenty | `public/assets/starter.css` – **neupravuje se**, nová verze se přebírá z repa jbtplatform.cz |
| Doplňky této aplikace | `public/assets/app.css` |
| Přepínání vzhledu, mobilní menu | `public/assets/app.js` |

## Barvy a styly

- Jen přes třídy ze `starter.css` a proměnné (`var(--muted)`, `var(--border)`, `var(--surface)` …) v `app.css`. **Nikdy** pevný hex v novém pravidle ani atribut `style="…"` (CSP ho stejně zablokuje).
- Nová barva: nevymýšlej ji, zeptej se tvůrce. Novou proměnnou pak přidej do `app.css` ve **všech třech blocích** stejně jako ve `starter.css` (`:root`, `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) … }`, `:root[data-theme="dark"]`).
- Odkazy mají ve světlém vzhledu tmavší modrou z `app.css` kvůli kontrastu; neměň ji.

## Rozvržení stránky

```php
require __DIR__ . '/app/gate.php';
require_role('reader', 'editor', 'admin');
// … data …
page_start('Nadpis stránky', 'id-polozky-v-navigaci');
?>
      <div class="page-head">
        <div>
          <h1>Nadpis stránky</h1>
          <p class="page-description">Jedna věta, co tu uživatel udělá.</p>
        </div>
        <a class="btn btn-primary" href="…">Hlavní akce</a>
      </div>
      …
<?php
page_end();
```

- Nová stránka = soubor `public/<nazev>.php` a položka v `navigation()` s ikonou. Chybějící ikonu přidej do `icon()` jako tenkou linkovou ikonu 24×24 (jen `stroke`, styl lucide). Položka pro určitou roli má `'role' => [...]`, stránka si roli hlídá i sama.
- Jedna stránka = jeden hlavní úkol, jedno žluté tlačítko.
- Části stránky přepínej záložkami nahoře (odkazy `?tab=…`, obsah vybere server), panely nestohuj pod sebe.
- Nadpis části: `<h2 class="section-heading">`.
- Stránka musí fungovat i na mobilu (390 px): široká tabulka je v `.table-wrap`, která se posouvá ve svém rámečku.

## Komponenty (třídy ze starter.css)

| Potřeba | Zápis |
|---|---|
| Hlavní akce | `<button class="btn btn-primary">` (žlutá s antracitovým textem) |
| Vedlejší akce | `<a class="btn">` nebo `<button class="btn">`, menší `btn btn-small` |
| Nebezpečná akce | `<button class="btn btn-danger">` v samostatném formuláři POST s potvrzovací stránkou nebo krokem, který řekne, co se stane |
| Karta | `<article class="card">` s `<h2 class="card-name">`, `<p class="card-desc">`; mřížka karet `<section class="card-grid">` |
| Přehled záznamů | `<div class="table-wrap"><table class="table">` s `<th scope="col">`; čísla a částky `class="num"` (doprava) |
| Formulář | `<form method="post" class="form-grid">` se skrytým `_csrf`; pole `<label class="field"><span>Popisek</span><input …></label>`, přes celou šířku `field field-wide`, nápověda `<span class="field-help">`, tlačítka v `<div class="form-actions field-wide">` |
| Zpráva po odeslání | `set_flash('success' \| 'error' \| 'info', 'Text')` a `redirect(...)`; zobrazí se jako `flash` |
| Prázdný stav | `<div class="empty-state"><p>Proč tu nic není a co dál.</p></div>` |
| Stav záznamu | `<span class="badge badge-active">V provozu</span>`, `badge-dev` (ve vývoji), `badge-maintenance` (údržba) – vždy s textem |
| Dostupnost, výsledek kontroly | `<span class="health health-up"><span class="health-dot"></span>Online</span>`, `health-down`, bez třídy = neznámý |
| Filtr | `<div class="chips"><a class="chip is-active" href="?…">Vše</a><a class="chip" href="?…">…</a></div>` |
| Záložky | `<div class="tabs"><a class="tab is-active" href="?tab=…" aria-current="page">…</a></div>` |
| Hledání a filtry nad tabulkou | `<section class="toolbar">` s `<input class="search-input" type="search">`, počet výsledků `<p class="result-count">` |

Nevytvářej vlastní varianty tlačítek, karet ani tabulek. Když komponenta chybí, poskládej ji z existujících tříd a doplňky dej do `app.css`. Žádné knihovny ani soubory z cizích serverů.

## Logo

Funkce `znacka_svg()` je v panelu, na mobilní liště a ve vodoznaku. Do obsahu stránek logo nepřidávej, nepřebarvuj ho a nedeformuj.

## Stavy, texty, formáty

- Načítání: stránky se skládají na serveru, prázdná stránka nehrozí. Když se něco načítá JavaScriptem (`api.php`), ukaž text „Načítám…“.
- Chybějící hodnota „—“ (`format_date`, `format_number`, `format_currency` ji vrací samy pro `null`).
- Formáty jen přes `public/app/format.php`: `format_date('2026-10-01')` → „1. 10. 2026“, `format_datetime(...)`, `format_number(12345.6)` → „12 345,6“, `format_currency(1250)` → „1 250 Kč“.
- Každá hodnota do HTML přes `e()`.

## Než řekneš „hotovo“

- [ ] Žádný hex v novém pravidle, žádné `style="…"`, žádné soubory z cizích serverů.
- [ ] Žlutá jen jako signál (hlavní tlačítko, aktivní položka, filtr, záložka).
- [ ] Obrazovka vypadá dobře ve světlém i tmavém vzhledu (přepínač je dole v panelu).
- [ ] Na mobilu (390 px) nic nepřetéká.
- [ ] Nová stránka má položku v `navigation()`.
- [ ] Prázdný stav, chyba a chybějící hodnota jsou ošetřené.
- [ ] Texty česky, vykání, tlačítka říkají, co se stane.
