# Značka Jablotron – hodnoty pro aplikace

Zdroj: design systém rozcestníku interních aplikací **JBT Platform** (`jbtplatform.cz`, soubory `docs/BRANDKIT.md` a `docs/templates/starter.css`). Šablona aplikace ho přebírá a napojuje na komponenty shadcn/ui. Jediná odchylka: modrá odkazů je ve světlém vzhledu o odstín tmavší (`#0072b1` místo `#0085cf`), aby text odkazu splnil kontrast 4,5 : 1. Když se brandkit rozcestníku změní, upravte stejné hodnoty tady a v `src/app/globals.css` šablony.

Písmo Jablo a logo jsou majetkem Jablotronu. Používají se jen v aplikacích Jablotronu.

## Principy

1. **Signální žlutá, ne výplňová.** `#FFCF00` jen v malých plochách: hlavní tlačítko, aktivní položka, aktivní záložka, avatar, tenký proužek. Nikdy pozadí obsahu.
2. **Na žluté vždy antracit** `#1C1C1C`, nikdy bílý text.
3. **Neutrály nesou obsah.** Světlé plochy a antracitový postranní panel. Barevné jsou jen stavy a odkazy (modrá).
4. **Světlý a tmavý vzhled jsou rovnocenné.** Každá barva je proměnná ve třech blocích `globals.css`. Barva jen v jednom bloku rozbije druhý režim.
5. **Klid a čitelnost před efekty.** Animace jemné a krátké, vypínají se při omezení animací v systému.
6. **Přístupnost není nadstavba.** Odkaz „Přeskočit na obsah“, viditelný fokus, popisky ikon a dostatečný kontrast patří k definici.

## Barvy

Třída Tailwindu → proměnná v `src/app/globals.css` → hodnota ve světlém / tmavém vzhledu.

| Použití | Třída | Světlý | Tmavý |
|---|---|---|---|
| Pozadí stránky | `bg-background` | `#f2f3f5` | `#161616` |
| Základní text | `text-foreground` | `#2b2b2b` | `#f5f5f5` |
| Karty, panely, dialogy | `bg-card`, `bg-popover` | `#ffffff` | `#232323` |
| Vnořené plochy, vstupní pole, řádek tabulky při najetí | `bg-secondary`, `bg-muted` | `#f7f8f9` | `#1d1d1d` |
| Podklad při najetí (ghost tlačítka, položky nabídek) | `bg-accent` | `#e9ebee` | `#2e2e2e` |
| Popisky, sekundární text | `text-muted-foreground` | `#6e6e6e` | `#a8a8a8` |
| Linky a rámečky | `border-border`, `border-input` | `#e2e4e8` | `#383838` |
| **Signální žlutá** | `bg-primary`, `text-primary`, `border-primary` | `#ffcf00` | `#ffcf00` |
| Text a ikony na žluté | `text-primary-foreground` | `#1c1c1c` | `#1c1c1c` |
| Žlutá při najetí | `bg-brand-hover` | `#e6ba00` | `#e6ba00` |
| Jemné žluté podbarvení | `bg-brand-soft` | `#feeb9b` | žlutá 16 % |
| Prstenec fokusu | `ring-ring` | `#ffcf00` | `#ffcf00` |
| Odkazy, informace | `text-odkaz` | `#0072b1` (brandkit `#0085cf`, ztmaveno kvůli kontrastu) | `#4fb3e8` |
| Chyba, nebezpečná akce | `text-destructive`, `bg-destructive` | `#d32f2f` | `#e57373` |
| Tělo loga | `text-logo` | `#1c1c1c` | `#ffffff` |
| Postranní panel: pozadí / text / linky | `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border` | `#1c1c1c` / `#d9d9d9` / `#2e2e2e` | `#101010` / `#d9d9d9` / `#262626` |
| Postranní panel: sekundární text | `text-sidebar-muted` | `#8f8f8f` | `#7e7e7e` |
| Postranní panel: aktivní položka | `bg-sidebar-accent`, `text-sidebar-accent-foreground` | žlutá 14 % / `#ffcf00` | stejně |

**Stavy** (vždy barva + text):

| Stav | Třídy | Světlý text | Tmavý text |
|---|---|---|---|
| V provozu, úspěch | `bg-stav-provoz-pozadi text-stav-provoz` | `#217a3c` | `#5bc57e` |
| Ve vývoji, informace | `bg-stav-vyvoj-pozadi text-stav-vyvoj` | `#0068a3` | `#6fc4f0` |
| Údržba, upozornění | `bg-stav-udrzba-pozadi text-stav-udrzba` | `#8f5a00` | `#ffb84d` |
| Chyba | `Badge variant="destructive"` | `#d32f2f` | `#e57373` |
| Dostupné / nedostupné / neznámé (tečka) | `bg-stav-ok`, `bg-stav-chyba`, `bg-stav-neznamy` | `#2e9e4f` / `#d32f2f` / `#9a9a9a` | `#5bc57e` / `#e57373` / `#7a7a7a` |

**Grafy:** `chart-1` žlutá, `chart-2` modrá, `chart-3` antracit (v tmavém světlá), `chart-4` šedá, `chart-5` zelená. Hodnoty v grafu vždy i jako číslo nebo popisek.

## Písmo

- Rodina **Jablo** (firemní webfont), soubory `src/app/fonts/JabloRegular.woff2` a `JabloSemibold.woff2`, načítá je `src/app/layout.tsx` (`next/font/local`, `display: swap`). Náhradní písma: Inter, Helvetica Neue, Arial, Segoe UI.
- Řezy **Regular (400)** a **Semibold (600)**. `font-medium` i `font-bold` se vykreslí Semiboldem, těžší řez značka nemá.
- Řádkování textu 1,55.

| Prvek | Velikost | Řez |
|---|---|---|
| Nadpis stránky `h1` | `text-2xl` | Semibold |
| Nadpis části `h2` | `text-lg` | Semibold |
| Název karty | `text-base` | Semibold |
| Text | `text-base` / `text-sm` v tabulkách a formulářích | Regular |
| Tlačítko, popisek pole | `text-sm` | Semibold |
| Drobný a sekundární text | `text-xs` / `text-[0.82rem]`, `text-muted-foreground` | Regular |
| Název aplikace v panelu | 1,05 rem, VERZÁLKY, prostrkání 0,05 em | Semibold |

Neproporcionální písmo (kódy, tokeny, IP adresy): `font-mono`.

## Logo

Stylizovaný „kruh s výsečí“: tělo v barvě textu a pevná žlutá výseč `#FFCF00`. Komponenta `src/components/znacka.tsx`, ikona v prohlížeči `src/app/icon.svg` (stejné SVG, tělo se v tmavém režimu prohlížeče přebarví na bílou).

- Postranní panel: vlevo nahoře, 34 × 36 px, bílé tělo, vedle název aplikace verzálkami.
- Mobilní lišta: 24 × 25 px.
- Vodoznak: 560 px vpravo dole, průhlednost 5 %, neklikací (na mobilu 380 px).
- Zakázáno: přebarvit výseč, deformovat, otáčet, přidat stín, rámeček nebo text, použít jinou verzi.

## Rozvržení

- **Skořápka:** postranní panel 264 px (sticky, výška obrazovky) + obsah.
- **Obsah:** šířka max. 1 120 px, odsazení 1,5 rem nahoře, 2 rem po stranách, 2,5 rem dole (na mobilu 1,1 rem po stranách).
- **Mobil (pod 900 px):** panel se schová, nahoře tmavá lišta se žlutým spodním proužkem 2 px, tlačítkem menu, logem a přepínačem vzhledu. Menu vyjede zleva a ztmaví pozadí.
- **Navigace:** položka = ikona 19 px + text 0,92 rem, rádius 10 px. Najetí: světlejší podklad. Aktivní: žlutý podklad 14 %, žlutý text, Semibold. Aktivní je vždy právě jedna.
- **Spodek panelu:** přepínač vzhledu (měsíc ve světlém, slunce v tmavém) a uživatel: kulatý žlutý avatar 36 px s iniciálami, jméno a role.
- **Záložky** (`src/components/ui/tabs.tsx`): přepínání částí stránky je vždy nahoře, „pilulka“ na vnořené ploše s rámečkem. Aktivní záložka žlutá s antracitovým textem.
- **Přihlášení:** aplikace vlastní přihlašovací obrazovku nemají, přihlášení řeší firemní přihlášení (SSO).

## Rádiusy, stíny, mezery

- Rádiusy: tlačítka a vstupy `rounded-lg` (10 px), karty `rounded-xl` (14 px), odznaky, filtry a pilulky `rounded-full`, avatar kruh.
- Stíny: klid `shadow-jbt` (karty ho mají), najetí `shadow-jbt-najeti`. Žádné tvrdé černé stíny.
- Mezery z násobků rem: 0,25 / 0,5 / 0,75 / 1 / 1,5 / 2 (Tailwind `1`, `2`, `3`, `4`, `6`, `8`). Mřížka karet `gap-4`.
- Animace: jen jemné a krátké (vjezd 0,3 s, přechody 0,15 s). Při omezení animací v systému se vypínají.

## Ikony

Jednotný styl: tenké linkové ikony z `lucide-react` (mřížka 24 × 24, tloušťka čáry 1,75, `stroke="currentColor"`), žádné plné výplně kromě loga. Dekorativní ikona `aria-hidden`, tlačítko jen s ikonou má `aria-label`.

## Tón komunikace

Věcně, srozumitelně, vykání. Pravidla textů jsou ve [SKILL.md](SKILL.md).
