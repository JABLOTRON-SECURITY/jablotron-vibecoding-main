---
name: firemni-identita
description: Použij vždy, když vzniká nebo se mění obrazovka, formulář, tabulka, navigace, chybová hláška nebo jakýkoli text, který uvidí uživatel.
user-invocable: false
when_to_use: nová stránka nebo obrazovka, nová položka v menu, úprava vzhledu, „udělej to hezčí“, „ať to vypadá jako Jablotron“, barvy, logo, tmavý režim, texty tlačítek, chybové hlášky, prázdné stavy.
paths:
  - "src/app/**"
  - "src/components/**"
  - "public/**/*.php"
  - "public/assets/**"
---

# Firemní identita

Interní aplikace Jablotronu vypadají a mluví stejně jako ostatní firemní nástroje (rozcestník JBT Platform): uživatel se v nové aplikaci zorientuje bez návodu. Všechny hodnoty značky (barvy, písmo, logo, rozměry) jsou v [znacka.md](${CLAUDE_SKILL_DIR}/znacka.md).

**PHP aplikace pro JBT Platform** (má `public/app/gate.php`): zásady níže platí stejně, ale vzhled se skládá z tříd `starter.css`, ne z Tailwindu a shadcn/ui. Místo oddílů Co je hotové, Barvy, Rozvržení a Komponenty se řiď [php.md](${CLAUDE_SKILL_DIR}/php.md).

## Co je hotové v šabloně

Vzhled značky je postavený jednou, ve skořápce aplikace. **Stránka jen dodává obsah.**

| Co | Kde |
|---|---|
| Tmavý postranní panel vlevo: logo, název aplikace, navigace, přepínač světlého a tmavého vzhledu, přihlášený uživatel. Na mobilu (pod 900 px) horní lišta se žlutým proužkem a tlačítkem menu. | `src/components/postranni-panel.tsx` |
| Odkazy v navigaci | `src/components/navigace.tsx` |
| Obsah (max. 1 120 px), patička s vlastníkem a kontaktem pro incident, vodoznak loga, odkaz „Přeskočit na obsah“, písmo Jablo | `src/app/layout.tsx`, `src/app/fonts/` |
| Barvy značky ve třech blocích (světlé, systémové tmavé, ručně zvolené tmavé) | `src/app/globals.css` |
| Logo a ikona v prohlížeči | `src/components/znacka.tsx`, `src/app/icon.svg` |
| Komponenty sladěné se značkou: žluté hlavní tlačítko s antracitovým textem, žlutý prstenec fokusu, karty se stínem, záložky | `src/components/ui/` |

Tyto soubory neměň kvůli jedné stránce. Změnu skořápky nebo barev navrhni tvůrci a proveď ji, jen když ji chce a odpovídá [znacka.md](${CLAUDE_SKILL_DIR}/znacka.md). Když aplikace skořápku nemá (vznikla ze starší šablony), navrhni tvůrci převzít uvedené soubory ze šablony `jablotron-app-next-template` jako samostatnou drobnou úpravu.

## Barvy

- Jen přes třídy z proměnných: `bg-primary`, `text-primary-foreground`, `bg-card`, `bg-secondary`, `text-muted-foreground`, `border-border`, `text-odkaz`, stavové `text-stav-provoz` … (seznam v [znacka.md](${CLAUDE_SKILL_DIR}/znacka.md)). **Nikdy** hex (`bg-[#ffcf00]`), `style={{ color: … }}` ani paleta Tailwindu (`bg-yellow-400`, `text-gray-500`).
- **Žlutá je signál, ne výplň.** Patří jen na hlavní tlačítko, aktivní položku nebo záložku, aktivní filtr, avatar a tenký proužek. Nikdy jí nebarvi pozadí karty, sekce ani stránky.
- **Na žluté vždy antracit** (`text-primary-foreground`). Bílý text na žluté je zakázaný.
- Obsah nesou neutrální plochy (`bg-background`, `bg-card`, `bg-secondary`). Barevné jsou jen stavy a odkazy.
- Každá obrazovka musí fungovat ve **světlém i tmavém** vzhledu. Proměnné to zařídí samy, pokud nepoužiješ pevné barvy.
- Když barva v proměnných chybí, nevymýšlej ji. Zeptej se tvůrce. Novou proměnnou pak přidej do **všech tří bloků** v `globals.css` a do `@theme inline`.

## Písmo

- Firemní písmo Jablo je nastavené pro celou aplikaci. Nepřidávej jiná písma a nenačítej písma z externích služeb.
- Jen dva řezy: běžný text a `font-semibold` (nadpisy, tlačítka, popisky polí, důležité údaje). Těžší řezy značka nemá.
- Nadpis stránky `h1`: `text-2xl font-semibold`. Nadpis části `h2`: `text-lg font-semibold`. Kódy a identifikátory `font-mono`.

## Logo

- Komponenta `<Znacka />` je v panelu, na mobilní liště a ve vodoznaku. Do obsahu stránek logo nepřidávej.
- Logo nepřebarvuj (výseč je vždy žlutá, tělo má barvu textu), nedeformuj, nepřidávej mu efekty, rámečky ani text a nevytvářej jiné verze.

## Rozvržení stránky

- **Nová stránka** = `src/app/<nazev>/page.tsx` a odkaz v `src/components/navigace.tsx` s tenkou linkovou ikonou z `lucide-react`. Odkaz na stránku pro určitou roli přidej podmíněně (`maRoli`), stránka si roli hlídá i sama.
- **Hlavička stránky:** `h1` a pod ním jedna věta `text-muted-foreground`, co tu uživatel udělá. Hlavní akce stránky vpravo vedle nadpisu (`flex flex-wrap items-end justify-between gap-4`).
- Jedna stránka = jeden hlavní úkol. Jedno žluté tlačítko (`variant="default"`), ostatní akce `outline` nebo `ghost`, nebezpečné `destructive`.
- Části stránky přepínej **záložkami nahoře**, panely nestohuj pod sebe.
- Obsah skládej do karet (`Card`) a tabulek s mezerami `space-y-6` / `gap-4`. Šířku obsahu neřeš, drží ji skořápka.
- Stránka musí fungovat i na mobilu (390 px): nic nepřetéká, široká tabulka se posouvá ve svém rámečku, stránka nikdy do šířky.

## Komponenty

Používej komponenty z `src/components/ui/` (shadcn/ui). Nevytvářej vlastní tlačítka, vstupy, tabulky ani dialogy, pokud stejná komponenta existuje. Chybějící komponentu přidej příkazem `pnpm dlx shadcn@latest add <nazev>` a řekni o tom tvůrci. Když komponenta přidá novou závislost do `package.json` (například graf), je to nová knihovna: zastav se a zeptej se tvůrce.

| Potřeba | Komponenta |
|---|---|
| Hlavní akce | `Button` (výchozí varianta = žluté s antracitovým textem) |
| Vedlejší akce | `Button variant="outline"` nebo `"ghost"` |
| Nebezpečná akce | `Button variant="destructive"` + potvrzení `AlertDialog` s popisem, co se stane |
| Přehled záznamů | `Table` s hlavičkou, čísla zarovnaná doprava |
| Formulář | `Label` + `Input` / `Select` / `Textarea`, popisek nad polem, chyba pod polem; odeslání přes serverovou akci a `useActionState` (vzor: `src/components/import-souboru.tsx`) |
| Části stránky | `Tabs`, `TabsList` nahoře, `TabsTrigger`, `TabsContent` (aktivní záložka je žlutá) |
| Krátké oznámení o výsledku | `toast` (sonner) |
| Stav záznamu | `Badge` vždy s textem: v provozu `bg-stav-provoz-pozadi text-stav-provoz`, ve vývoji `bg-stav-vyvoj-pozadi text-stav-vyvoj`, údržba `bg-stav-udrzba-pozadi text-stav-udrzba`, chyba `variant="destructive"` |
| Dostupnost, výsledek kontroly | tečka `size-2 rounded-full bg-stav-ok` / `bg-stav-chyba` / `bg-stav-neznamy` a vedle ní text |
| Filtr | `Button size="sm"` s `rounded-full`; aktivní `variant="default"`, ostatní `outline` |
| Karta, na kterou jde kliknout | `Card` s `transition-shadow hover:shadow-jbt-najeti`, odkaz přes celou kartu |

## Stavy obrazovky

Každý přehled a formulář musí mít ošetřené:

- **načítání** – `Skeleton`, ne prázdná stránka;
- **chybějící hodnota** v tabulce nebo kartě – „—“, nikdy prázdné místo, „0“ ani „null“;
- **prázdný stav** – vysvětlí, proč nic nevidím, a nabídne další krok („Zatím tu nejsou žádná data. Nahrajte export v sekci Import.“);
- **chybu** – lidsky, co se stalo a co s tím může uživatel udělat. Nikdy technický výpis.

## Texty v rozhraní

- Česky, spisovně, **vykání**. Krátce a věcně.
- Tlačítka říkají, co se stane: „Nahrát soubor“, „Uložit změny“, „Smazat záznam“. Ne „OK“, „Odeslat“, „Potvrdit“.
- Chybová hláška = co se stalo + co dělat: „Soubor je větší než 5 MB. Zmenšete ho nebo ho rozdělte na více částí.“
- Bez vykřičníků, bez emoji, bez anglických slov tam, kde existuje běžný český výraz.

## Formáty

Vždy přes `Intl` s locale `cs-CZ` (pomocné funkce jsou v `src/lib/format.ts`):

- datum `1. 10. 2026`, datum a čas `1. 10. 2026 14:05`;
- čísla s mezerou mezi tisíci `12 345,6`;
- měna `12 345 Kč`.

## Přístupnost

- Kontrast textu nejméně 4,5 : 1. Informace se nikdy nepředává jen barvou (stav = barva + text).
- Každé pole formuláře má popisek (`Label`), každý obrázek popis (`alt`).
- Vše jde ovládat klávesnicí a fokus je vidět. Žlutý prstenec fokusu je v komponentách; třídy `focus-visible:` neodstraňuj a `outline-none` nepoužívej bez náhrady.
- Dekorativní ikony mají `aria-hidden`, tlačítko jen s ikonou má `aria-label`.
- Animace jen krátké a jemné (`transition-colors`, `animate-in fade-in`). Omezení animací v systému uživatele platí pro celou aplikaci samo.
- Odkaz mimo aplikaci: `target="_blank" rel="noopener noreferrer"`.

## Než řekneš „hotovo“

- [ ] Žádný hex, `style={{ … }}` ani barva z palety Tailwindu.
- [ ] Žlutá jen jako signál, na žluté antracit.
- [ ] Obrazovka vypadá dobře ve světlém i tmavém vzhledu (přepínač je dole v panelu).
- [ ] Na mobilu (390 px) nic nepřetéká.
- [ ] Nová stránka má odkaz v navigaci.
- [ ] Načítání, prázdný stav, chyba a chybějící hodnota jsou ošetřené.
- [ ] Texty česky, vykání, tlačítka říkají, co se stane.
