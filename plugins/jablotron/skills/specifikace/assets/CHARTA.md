---
# Charta aplikace. Hlavičku čte automatický přehled aplikací – vyplňte všechna pole.
nazev: DOPLNIT
popis: DOPLNIT                  # jedna věta: k čemu aplikace slouží
uroven: DOPLNIT                 # L0 | L1 | L2 | L3
zduvodneni_urovne: DOPLNIT      # odpovědi na tři otázky v jedné větě
stav: experiment                # experiment | pilot | provoz | vyrazeno
schvaleni: DOPLNIT              # odkaz na schválený nápad; u L0 (osobní experiment, cvičení) „není potřeba“

vecny_vlastnik: DOPLNIT         # kdo aplikaci zadává, přebírá a ručí za správnost výstupů
zastupce_vlastnika: DOPLNIT
tvurce: DOPLNIT                 # kdo aplikaci vyvíjí a vede chartu a specifikaci
spravce_provozu: DOPLNIT        # kdo potvrzuje spuštění (od L1)

uzivatele: DOPLNIT              # kdo a přibližně kolik lidí
data_tridy: [DOPLNIT]           # verejna | interni | duverna | prisne_chranena
data_zdroj: DOPLNIT             # např. ruční export ze servisního systému, bez přímého napojení
osobni_udaje: ne                # ano | ne
data_uchovani: DOPLNIT          # např. 12 měsíců
souhlas_vlastnika_dat: DOPLNIT  # od L2 povinné; u L0 a L1 „není potřeba“

umisteni_kodu: DOPLNIT          # odkaz na tento repozitář
umisteni_provozu: zatím neurčeno
spusteni: DOPLNIT               # RRRR-MM-DD, plánované nebo skutečné
pristi_revize: DOPLNIT          # RRRR-MM-DD, zpravidla šest měsíců po spuštění
vyrazeni: DOPLNIT               # kdy nebo za jakých podmínek se aplikace vyřadí
kontakt_incident: DOPLNIT       # komu hlásit bezpečnostní incident
---

# Charta aplikace

Charta je jeden soubor se všemi podstatnými informacemi o aplikaci. Je uložená v repozitáři, takže se mění spolu s kódem. Údaje do ní dává věcný vlastník už ve formuláři nápadu. Po schválení ji tvůrce s věcným vlastníkem zapíše do repozitáře (`/jablotron:specifikace`) a aktualizuje ji s každým vydáním. **Bez vyplněné charty aplikace nedostane data ani přístupy.**

## Účel

DOPLNIT – dvě až tři věty: jaký problém aplikace řeší a komu pomáhá.

## Zařazení do úrovně rizika

| Otázka | Odpověď |
|---|---|
| S jakými daty bude aplikace pracovat? | DOPLNIT |
| Kdo k ní bude mít přístup? | DOPLNIT |
| Co se stane, když selže nebo vrátí chybný výsledek? | DOPLNIT |

## Historie změn charty

| Datum | Změna | Kdo |
|---|---|---|
| DOPLNIT | Založení charty | DOPLNIT |
