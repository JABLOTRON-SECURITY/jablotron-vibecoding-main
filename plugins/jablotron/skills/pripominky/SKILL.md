---
name: pripominky
description: Použij, když jsou v pull requestu připomínky od správce, od kolegy nebo z AI review (Claude Code Review, pokud je zapnuté), nebo když review neprošlo.
when_to_use: „v PR jsou komentáře“, „co chce review?“, „oprav připomínky“, „AI review něco našlo“, „správce něco připomínkoval“.
argument-hint: "[číslo pull requestu]"
---

# Připomínky z review

Review je technické posouzení, ne společenská situace. Každou připomínku nejdřív ověř, pak jednej. Nesouhlas podložený fakty je v pořádku, slepé přikyvování ne.

Pull request: $ARGUMENTS (když chybí, `gh pr status`)

## 1. Načti všechno

- `gh pr view <číslo> --comments`: celkové komentáře a review,
- `gh api repos/{owner}/{repo}/pulls/<číslo>/comments`: komentáře u konkrétních řádků,
- `gh pr checks <číslo>`: stav kontrol.

Přečti všechny připomínky dřív, než začneš cokoli měnit. Mohou spolu souviset.

## 2. Ověř každou připomínku

1. **Pochop:** převyprávěj ji vlastními slovy. Když nevíš, co přesně chce, nic neopravuj a nejdřív se zeptej. Nedělej jen ty, kterým rozumíš.
2. **Ověř proti kódu:** platí to v tomhle projektu? Nerozbije oprava něco jiného? Má současné řešení důvod? Neodporuje to specifikaci nebo dřívějšímu rozhodnutí tvůrce?
3. **Posuď:**
   - **bezpečnostní připomínky** a body ze seznamu „Co je Important“ v `REVIEW.md` oprav vždy, ledaže prokážeš, že jsou mylné;
   - **připomínka od člověka** (správce, recenzent u L2) má váhu. Pokud odporuje rozhodnutí tvůrce, nejdřív to s tvůrcem probereš;
   - **„profesionální“ rozšíření navíc**, která specifikace nechce: neimplementuj, navrhni odpověď.

## 3. Vysvětli tvůrci

Krátká tabulka: připomínka (lidsky) – oprávněná? – co s ní (opravit / odpovědět proč ne / zeptat se autora). Žádné „Máte naprostou pravdu!“. Rovnou věcně, co a proč.

Počkej na souhlas tvůrce.

## 4. Oprav

- Po jedné, každou s testem napřed (`testy-napred`), commit `oprava: připomínka z review – <co>`.
- Po všech opravách `pnpm check` (v PHP aplikaci `php tools/check.php`; skill `overeni`) a `git push`.

## 5. Odpověz

- Ke každé připomínce připrav krátkou věcnou odpověď česky: co se opravilo, nebo proč ne (s technickým důvodem).
- Po souhlasu tvůrce ji odešli k příslušnému komentáři: `gh api repos/{owner}/{repo}/pulls/<číslo>/comments/<id>/replies -f body="…"`.
- Pravidla větve vyžadují vyřešené konverzace. Tlačítko **Resolve conversation** na GitHubu klikne tvůrce, až si odpověď přečte. Je to jeho potvrzení, že s vyřízením souhlasí.

## 6. Sleduj kontroly

Kontroly trvají několik minut: spusť `gh pr checks --watch` na pozadí, nebo se na stav po chvíli ptej příkazem `gh pr checks`. Červená kontrola → `ladeni`.
