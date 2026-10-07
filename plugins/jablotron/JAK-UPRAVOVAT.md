# Jak upravovat plugin

Pro správce centrálního repozitáře `jablotron-vibecoding`. Každá změna jde pull requestem, který schvaluje sponzor procesu nebo jím pověřená osoba.

## Co kde je

| Složka | Obsah |
|---|---|
| `skills/<nazev>/SKILL.md` | Skill: postup, který agent načte, když se na situaci hodí. Podklady (šablony, kontrolní seznamy) leží vedle. |
| `agents/<nazev>.md` | Subagenti pro provedení a kontrolu úkolů, celé větve a bezpečnostní review. Spouštějí je skills `implementace`, `dokonceni` a `bezpecnostni-review`. |
| `hooks/` | Skripty, které běží automaticky: pravidla, postup a stav aplikace na začátku relace, ochrana hlavní větve a kontrol, formátování upravených souborů. |
| `reference/` | Pravidla, úrovně rizika, třídy dat, postup práce. Na ně odkazují skills i hooky. |

## Zásady pro skills

1. **Popis (`description`) říká jen, kdy skill použít**, ne co dělá krok za krokem. Agent podle popisu rozhoduje, jestli skill načte. Když popis shrnuje postup, agent se řídí shrnutím a celý skill nepřečte. Pište „Použij, když …“ a vyjmenujte situace a typické věty tvůrce (`when_to_use`).
2. **Krátce a závazně.** `SKILL.md` pod 500 řádků, podrobnosti do samostatných souborů vedle. Co je nepřekročitelné, pište jako pravidlo („Žádný kód bez testu, který předtím selhal“), ne jako doporučení.
3. **Výmluvy předem.** U pravidel, která agent pod tlakem obchází, přidejte tabulku „Když si říkáš / Ve skutečnosti“ s konkrétními výmluvami, které jste viděli.
4. **Nejdůležitější nahoru.** Po zhuštění dlouhé konverzace Claude Code vrací do kontextu jen začátek každého použitého skillu (prvních 5 000 tokenů; nejdelší skills pluginu, `specifikace` a `implementace`, jsou blízko této hranice) a všech skillů dohromady nejvýš 25 000 tokenů, nejstarší vypadnou celé. Tvrdé hranice a pravidla proto patří na začátek `SKILL.md`, kontrolní seznamy a příklady na konec.
5. **Pro nevývojáře.** Všechno, co uvidí tvůrce, česky a bez žargonu. Rozhodnutí, která tvůrce posoudit neumí (technická), dělá agent a zapisuje je; rozhodnutí o chování aplikace patří tvůrci.

## Jak změnu vyzkoušet

Skill je postup a jeho chování se testuje stejně jako kód:

1. **Před změnou** si na cvičném repozitáři zopakujte situaci, kterou chcete zlepšit (například „spěchá to, testy přeskoč“), a zapište si, co agent udělal a jakými slovy se vymlouval.
2. Upravte skill.
3. Stejnou situaci zopakujte **v nové relaci** a ověřte, že se agent chová správně. Zkuste i obměnu, která pravidlo obchází jinými slovy.
4. Zvyšte verzi v `.claude-plugin/plugin.json`. Tvůrcům se aktualizace stáhne sama.

Ověření struktury pluginu: `claude plugin validate .` v kořeni repozitáře.

Pomocníci pro správce (Claude Code v2.1.283 nebo novější):

| Příkaz | Co dělá |
|---|---|
| `/doctor prompt-audit plugins/jablotron` | Najde zastaralé nebo vzájemně rozporné pokyny ve skills, agentech a pravidlech a navrhne opravy. Spusťte před každou větší změnou a po ní. |
| `/skill-doctor` | Ukáže, jak často se který skill používá na vašem počítači a kolik stojí kontextu. Využití napříč firmou ukazuje přehled využití (návod pro IT, krok 6d). |
