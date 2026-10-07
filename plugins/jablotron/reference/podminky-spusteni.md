# Podmínky spuštění

Platí od úrovně **L1**. Kontroluje je **správce provozu** před prvním nasazením a při každém větším vydání. Vyplněný seznam je v souboru `docs/podminky-spusteni.md` každé aplikace.

| # | Podmínka | Jak se ověří |
|---|---|---|
| 1 | Charta aplikace vyplněná, úroveň potvrzená schvalovatelem | `CHARTA.md` bez prázdných polí, odkaz na schválení |
| 2 | Všechny automatické kontroly úspěšné | Zelené kontroly na posledním pull requestu do `main` |
| 3 | Přihlášení firemním účtem a přístup podle rolí | Nepřihlášený uživatel se nedostane dál, role odpovídají chartě |
| 4 | Hesla a klíče v secret manageru, nikoli v kódu | Kontrola tajných údajů bez nálezů, `.env.local` necommitnutý |
| 5 | Žádné testovací, ladicí ani dočasné funkce | Žádné „dev“ přihlášení, ladicí výpisy ani skryté stránky v produkci |
| 6 | Záznamy o přístupech a důležitých akcích | Import dat, změny oprávnění a mazání se zapisují do auditního záznamu |
| 7 | Zálohy a ověřená obnova dat (od L2) | Záznam o provedené zkušební obnově |
| 8 | README s návodem k převzetí projektu | Někdo jiný než tvůrce podle README aplikaci spustí |
| 9 | Určený vlastník i jeho zástupce | Obě jména v chartě |
| 10 | Code review a bezpečnostní review bez nevyřešených nálezů | Žádné otevřené závažné nálezy z kontroly větve a review v pull requestu (od L2 i z odborného review). Bezpečnostní review celé aplikace (OWASP Top 10:2025) bez kritických a závažných nálezů, zpráva v `docs/bezpecnost/` |
