# Když se něco pokazí

Bezpečnostní incident je cokoli, co může vést k úniku dat nebo zneužití aplikace: klíč omylem v repozitáři, skutečná data tam, kde nemají být, podezřelé chování aplikace, neznámý uživatel, aplikace dostupná mimo firmu.

## Čtyři kroky

1. **Zastavit.** Vypnout aplikaci nebo odebrat přístupy, i za cenu výpadku. **Nic nemazat**, ani podezřelé soubory. Smazání zničí stopy.
2. **Nahlásit.** Informovat kontakt pro bezpečnostní incidenty (uvedený v `SECURITY.md` aplikace) a věcného vlastníka aplikace. Raději jednou zbytečně než jednou pozdě.
3. **Vyměnit klíče a zajistit stopy.** Změnit všechny přístupové údaje, které mohly být dotčeny. Zajistit logy dříve, než se přepíšou.
4. **Poučit se.** Projít celý incident, zapsat, co se stalo a proč, a upravit pravidla nebo kostru tak, aby se to neopakovalo.

## Nejčastější případ: klíč nebo heslo v repozitáři

- Klíč je potřeba považovat za vyzrazený, i když byl v repozitáři jen chvíli a repozitář je soukromý.
- Nestačí ho z kódu smazat dalším commitem, v historii zůstává. **Klíč se musí zneplatnit a vydat nový.**
- Teprve potom se řeší úklid historie, a to vždy s IT.
