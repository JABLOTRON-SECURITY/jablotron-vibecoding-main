---
name: vysvetli-zmenu
description: Použij před každým pull requestem a kdykoli se tvůrce zeptá, co se v kódu změnilo.
when_to_use: „co jsi změnil?“, „shrň změny“, „vysvětli mi to“, „nerozumím tomu“, „napiš popis změny“, před vytvořením pull requestu.
---

# Shrnutí změny

Tvůrce má vědět, co odevzdává, ale nemusí číst kód ani se nic učit. Dostane **krátké shrnutí**. Podrobnosti pro recenzenty patří do popisu pull requestu.

Tvůrce **nezkoušej**: neptej se, jestli změně rozumí, a na nic nečekej. Když se sám zeptá nebo řekne, že něčemu nerozumí, vysvětli tu část podrobněji a jinými slovy.

## 1. Zjisti, co se změnilo

- `git diff --stat origin/main...HEAD` a `git diff origin/main...HEAD` (když `origin/main` neexistuje, použij `main`)
- `git diff` a `git status --short` pro necommitnuté změny
- `git log --oneline origin/main..HEAD` pro seznam commitů
- přečti `SPEC.md`, ať víš, ke které části zadání změna patří
- pokud k větvi existuje plán v `docs/plans/`, přečti jeho část „Pro tvůrce“ a oddíl Průběh (rozhodnutí agenta, odložené drobnosti)

## 2. Krátké shrnutí pro tvůrce

Česky, nejvýš deset řádků, bez názvů souborů a bez odborných pojmů:

- **Co se mění:** jedna až tři věty z pohledu člověka, který aplikaci používá, a ke kterému kritériu to patří („plní KH-2“). Když změna dělá něco, co ve specifikaci není, výslovně to uveď.
- **Na co dát pozor:** jen když něco takového je: nová knihovna, změna dat nebo oprávnění, rozhodnutí, které agent udělal sám, něco, co ještě nefunguje. Jinak řádek vynech.
- **Jak si to vyzkoušet:** dva až čtyři kroky (co otevřít, kam kliknout, co má vyjít).

Shrnutí je informace, ne kontrola. Po něm se na nic neptej.

## 3. Popis pull requestu

Když vzniká pull request, vyplň šablonu `.github/pull_request_template.md` v repozitáři. Název i popis pull requestu piš **anglicky** (šablona je anglicky), krátké shrnutí pro tvůrce (krok 2) zůstává česky. Popis je pro recenzenty, proto je podrobnější než shrnutí:

- **What changes** a **Spec reference**: totéž co v krátkém shrnutí (krok 2), anglicky.
- **Plan and agent decisions**: odkaz na plán v `docs/plans/` a rozhodnutí z jeho Průběhu, u drobné úpravy ta, která jsi udělal sám, nebo „none“.
- **How to test**: číslovaný postup s fiktivními daty.
- **Code changes**: nejvýš pět bodů ve tvaru „*file or area* – what and why“ a které automatické testy změnu hlídají. Pokud některé kritérium test nemá, napiš to.
- **Checklist**: zaškrtni jen to, co skutečně platí a máš ověřené (kontroly, bezpečnostní review, specifikace).
