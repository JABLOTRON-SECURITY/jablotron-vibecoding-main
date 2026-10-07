# Čtyři třídy dat

Třídy dat přesně vymezují, co znamenají „citlivá data“. Platí pro práci s AI nástroji i pro to, s jakými daty smí aplikace pracovat.

| Třída | Příklady | Do AI nástroje (běžná práce, mimo vývoj aplikací) | V aplikaci |
|---|---|---|---|
| **1. Veřejná** | Web, katalogy, tiskové zprávy, veřejné ceníky | Ano | Od L0 |
| **2. Interní** | Interní směrnice, šablony, souhrnné údaje bez jmen | Ano, pouze do firemního nástroje | Od L1 |
| **3. Důvěrná** | Osobní údaje zaměstnanců, obchodní výsledky, smlouvy | Pouze anonymizovaná | Od L2 |
| **4. Přísně chráněná** | Data zákazníků a objektů, poplachové události, přístupové a zdravotní údaje | **Nikdy** | Pouze na L3 |

## Co z toho plyne pro vývoj

- **Vývoj probíhá výhradně s fiktivními daty.** Ukázková data patří do složky `data/sample/` a musí být vymyšlená.
- **Skutečná data se do repozitáře nikdy neukládají.** Ani jako příloha, ani „jen na chvíli“. Exporty (`.xlsx`, `.csv`) mimo `data/sample/` blokuje `.gitignore`.
- **Při vývoji aplikace se skutečná data nevkládají do konverzace s agentem, a to ani interní.** Sloupec „Do AI nástroje“ platí pro běžnou práci s Claude (texty, dokumenty), ne pro vývoj. Ani jako ukázka „ať vidíš, jak to vypadá“. Místo toho agentovi popište sloupce a vytvořte s ním fiktivní vzorek.
- **Když si nejste jistí, do které třídy data patří, platí ta vyšší.**

## Jak poznat osobní údaje

Osobní údaj je cokoli, podle čeho lze přímo nebo nepřímo poznat konkrétního člověka: jméno, e-mail, telefon, adresa, číslo zaměstnance, IP adresa, kombinace údajů (oddělení + pozice + datum nástupu). Pokud aplikace pracuje s čímkoli z toho, jde nejméně o L2.
