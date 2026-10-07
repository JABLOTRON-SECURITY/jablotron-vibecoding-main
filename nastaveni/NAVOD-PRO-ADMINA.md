# Návod k nastavení pro IT

Jednorázové nastavení zabere zhruba **hodinu**, každá další aplikace **pět minut**. Postupujte popořadě.

**Potřebujete:**

- roli **Owner** v organizaci na claude.ai (plán Team nebo Enterprise),
- roli **Owner** v organizaci na GitHubu (plán Team nebo vyšší),
- počítač s Git, GitHub CLI (`gh`, přihlášené účtem ownera) a Node.js 22.12+.

V příkazech nahraďte `<organizace>` názvem vaší organizace na GitHubu (část adresy `https://github.com/<organizace>`).

> **Co tento návod nepokrývá:** provozní prostředí a firemní přihlášení (SSO) pro aplikace ze šablony Next.js. Až o nich Jablotron rozhodne, doplní se do šablony. Do té doby tyto aplikace běží jen na počítačích tvůrců a v produkci se záměrně nespustí. Aplikace pro rozcestník JBT Platform (šablona `jablotron-app-php-template`) mají přihlášení i hosting od platformy; jejich zapojení popisuje krok 5b a `docs/NEW_APP.md` v repu jbtplatform.cz.

---

## 1. Název organizace v balíčku

Rozbalte předávací balíček tak, aby složky `jablotron-vibecoding/`, `jablotron-app-next-template/`, `jablotron-app-php-template/`, `demo-evidence-skoleni/` a `demo-evidence-skoleni-php/` ležely vedle sebe, a v nadřazené složce spusťte:

```bash
node jablotron-vibecoding/nastaveni/rename-org.mjs <organizace>
```

Skript nahradí zástupný název organizace ve všech souborech. Změny commitněte:

```bash
git -C jablotron-vibecoding commit -am "chore: set organization name"
git -C jablotron-app-next-template commit -am "chore: set organization name"
git -C jablotron-app-php-template commit -am "chore: set organization name"
git -C demo-evidence-skoleni commit -am "chore: set organization name"
git -C demo-evidence-skoleni-php commit -am "chore: set organization name"
```

## 2. GitHub: nastavení organizace a týmy

| Kde | Nastavení |
|---|---|
| Settings → Actions → General → Policies | *Allow <organizace>, and select non-<organizace>, actions*: zaškrtnout *Allow actions created by GitHub* a do seznamu doplnit `pnpm/action-setup@*, anchore/sbom-action@*` |
| tamtéž | Zapnout *Require actions to be pinned to a full-length commit SHA* (šablona to splňuje) |
| Settings → Code security → Configurations | Pro všechny i nové repozitáře zapnout **Dependabot alerts** a **Dependabot security updates** |
| Settings → Member privileges | Doporučeno: *Base permissions: No permission* a zakládání repozitářů jen pro ownery. Aplikace nevznikají na vlastní pěst. |

Týmy (soubor `CODEOWNERS` v šabloně na tým `vibecoding-spravci` odkazuje, musí existovat):

```bash
gh api -X POST orgs/<organizace>/teams -f name=vibecoding-tvurci -f privacy=closed
gh api -X POST orgs/<organizace>/teams -f name=vibecoding-spravci -f privacy=closed
gh api -X PUT orgs/<organizace>/teams/vibecoding-tvurci/memberships/<github-ucet> -f role=member
gh api -X PUT orgs/<organizace>/teams/vibecoding-spravci/memberships/<github-ucet> -f role=member
```

| Tým | Kdo |
|---|---|
| `vibecoding-tvurci` | tvůrci |
| `vibecoding-spravci` | sponzor procesu (nebo jím pověřená osoba), schvalovatel, správce provozu, IT. Schvalují změny kontrol a pravidel v aplikacích i v repozitáři `jablotron-vibecoding`. |

## 3. GitHub: centrální repozitář `jablotron-vibecoding`

```bash
gh repo create <organizace>/jablotron-vibecoding --private --description "Vibecoding v Jablotronu: pravidla, plugin a nastavení"
git -C jablotron-vibecoding remote add origin https://github.com/<organizace>/jablotron-vibecoding.git
git -C jablotron-vibecoding push -u origin main
gh api -X PUT orgs/<organizace>/teams/vibecoding-tvurci/repos/<organizace>/jablotron-vibecoding -f permission=pull
gh api -X PUT orgs/<organizace>/teams/vibecoding-spravci/repos/<organizace>/jablotron-vibecoding -f permission=maintain
```

Tvůrci musí mít oprávnění **Read**: Claude Code odtud stahuje plugin jejich vlastním přihlášením ke GitHubu.

Štítky pro formulář nápadů:

```bash
gh label create napad      --repo <organizace>/jablotron-vibecoding --color 0E8A16 --description "Nový nápad na aplikaci"
gh label create schvaleno  --repo <organizace>/jablotron-vibecoding --color 1D76DB
gh label create doplnit    --repo <organizace>/jablotron-vibecoding --color FBCA04
gh label create zamitnuto  --repo <organizace>/jablotron-vibecoding --color B60205
```

**Ochrana `main`** (Settings → Rules → Rulesets → New branch ruleset): cíl *Default branch*, zapnout *Require a pull request before merging* s 1 schválením a *Block force pushes*. Pravidla procesu se tak mění jen se souhlasem druhé osoby.

## 4. GitHub: šablona `jablotron-app-next-template`

Pozor na pořadí: repozitář se musí označit jako šablona **před** prvním pushem, jinak první běh kontrol spadne na nevyplněné chartě.

```bash
gh repo create <organizace>/jablotron-app-next-template --private --description "Šablona interní aplikace"
gh api -X PATCH repos/<organizace>/jablotron-app-next-template -F is_template=true
git -C jablotron-app-next-template remote add origin https://github.com/<organizace>/jablotron-app-next-template.git
git -C jablotron-app-next-template push -u origin main
gh api -X PUT orgs/<organizace>/teams/vibecoding-tvurci/repos/<organizace>/jablotron-app-next-template -f permission=pull
```

V záložce **Actions** musí workflow **Kontroly** doběhnout zeleně. Pokud ne, zkontrolujte krok 2 (povolené akce) a spusťte ho znovu: `gh workflow run Kontroly --repo <organizace>/jablotron-app-next-template`.

**Šablona pro JBT Platform:** stejným postupem založte i `jablotron-app-php-template` (v příkazech nahraďte `jablotron-app-next-template` za `jablotron-app-php-template`). Její kontroly mají stejné názvy jako u šablony Next.js, takže platí stejná pravidla větve `main`. Žádné další akce ani balíčky nepotřebuje.

## 5. Nová aplikace (po schválení nápadu)

Kdykoli schvalovatel schválí nápad, založte repozitář ze šablony. Název malými písmeny s pomlčkami, např. `prehled-reklamaci`.

```bash
APP=prehled-reklamaci
gh repo create <organizace>/$APP --private --template <organizace>/jablotron-app-next-template
gh api -X PATCH repos/<organizace>/$APP -F allow_merge_commit=false -F allow_rebase_merge=false -F allow_squash_merge=true -F delete_branch_on_merge=true
gh api -X POST repos/<organizace>/$APP/rulesets --input jablotron-vibecoding/nastaveni/github/pravidla-main-L1.json
gh api -X PUT repos/<organizace>/$APP/vulnerability-alerts
gh api -X PUT repos/<organizace>/$APP/automated-security-fixes
gh api -X PUT orgs/<organizace>/teams/vibecoding-spravci/repos/<organizace>/$APP -f permission=maintain
gh api -X PUT repos/<organizace>/$APP/collaborators/<github-ucet-tvurce> -f permission=push
```

Na Windows v PowerShellu místo `APP=…` napište `$APP = "prehled-reklamaci"`.

Potom:

1. Pokud má Claude GitHub App přístup jen k vybraným repozitářům, přidejte nový repozitář: GitHub → Settings → GitHub Apps → **Claude** → Configure → Repository access.
2. Pošlete tvůrci odkaz na repozitář a na [tahák](../TAHAK.md).

Pravidla větve `main` pak u aplikace L1 vyžadují: pull request, pět úspěšných kontrol a vyřešené komentáře. Změny kontrolních souborů (`.github/`, `.semgrep/`, `scripts/`, `.claude/`, `pnpm-workspace.yaml` a další podle `CODEOWNERS`) navíc musí schválit tým `vibecoding-spravci`. Tvůrce ani agent tak nemohou „opravit“ červenou kontrolu tím, že ji vypnou.

**Aplikace na úrovni L2:** místo `pravidla-main-L1.json` použijte `pravidla-main-L2.json` a v souboru `.github/CODEOWNERS` aplikace odkomentujte řádek s týmem odborníků. Každou změnu pak musí schválit odborník, ne autor. Aplikace L3 používají stejná pravidla; bezpečnostní test, posouzení vlivu na ochranu osobních údajů a plán incidentů se dokládají v podmínkách spuštění.

### 5b. Aplikace pro rozcestník JBT Platform

Aplikaci, která poběží na `<identifikátor>.jbtplatform.cz`, založte stejně, jen ze šablony PHP a s názvem repozitáře shodným s identifikátorem na rozcestníku (a se subdoménou):

```bash
gh repo create <organizace>/$APP --private --template <organizace>/jablotron-app-php-template
```

Ostatní příkazy kroku 5 platí beze změny. Hosting, databázi, registraci na rozcestníku a secrets pro nasazení připraví správce platformy až před spuštěním, podle README šablony a `docs/NEW_APP.md` v repu jbtplatform.cz. Secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `HUB_TOKEN`) patří do prostředí `produkce` s omezením na větev `main`, ne mezi repository secrets, aby se k nim nedostal pull request ani jiná větev:

```bash
gh api -X PUT repos/<organizace>/$APP/environments/produkce --input - <<<'{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}'
gh api -X POST repos/<organizace>/$APP/environments/produkce/deployment-branch-policies -f name=main -f type=branch
gh secret set FTP_SERVER --env produkce --repo <organizace>/$APP   # stejně FTP_USERNAME, FTP_PASSWORD, HUB_TOKEN
```

Charta PHP aplikace je v `CODEOWNERS`: změnu stavu na `pilot` (která spustí nasazení) musí schválit tým `vibecoding-spravci`. Do té doby workflow Nasazení nic nenahrává: nasazuje jen aplikace, jejichž charta je ve stavu `pilot` nebo `provoz`, a jen po úspěšných kontrolách v `main`.

**Cvičné repozitáře pro workshop:** stejný postup s názvem `cviceni-<jmeno>`. Cvičení běží jako úroveň L0, takže nepotřebují schválený nápad.

## 6. Claude (claude.ai, role Owner)

### a) Licence

Přidělte tvůrcům místa s přístupem ke Claude Code.

Postup práce v pluginu u větších plánů (víc než tři úkoly) pouští na každý úkol samostatné agenty pro provedení a kontrolu. Je to důkladnější, ale čerpá víc z limitu použití. Pokud tvůrci v pilotu narážejí na limity, zvažte místa s vyšším limitem nebo jim doporučte menší plány (agent pak pracuje sám a kontroluje až celou větev).

### b) Politika Claude Code: doručení pluginu a doporučení

Firma už má vlastní politiku Claude Code (Admin Settings → **Claude Code** → **Managed settings**). Nepřepisujte ji, jen do ní zapracujte následující. Politika platí pro všechny uživatele Claude Code ve firmě, proto u každé položky zvažte dopad na vývojáře.

**Nutné, aby tvůrci dostali plugin automaticky** (bez toho si ho každý nainstaluje sám: aplikace Claude → Customize → Plugins → Add marketplace → `jablotron-org/jablotron-vibecoding` → Install):

```json
"extraKnownMarketplaces": {
  "jablotron-vibecoding": {
    "source": { "source": "github", "repo": "jablotron-org/jablotron-vibecoding" },
    "autoUpdate": true
  }
},
"enabledPlugins": {
  "jablotron@jablotron-vibecoding": true,
  "security-guidance@claude-plugins-official": true
}
```

**Doporučené**, pokud to vaše politika ještě neřeší:

| Nastavení | Proč |
|---|---|
| `"permissions": { "disableBypassPermissionsMode": "disable" }` | Agent nedělá kroky bez vědomí člověka. |
| `"permissions": { "deny": ["Read(**/.env)", "Read(**/.env.*)", "Read(**/*.pem)", "Read(**/*.key)", "Read(~/.ssh/**)"] }` | Agent nemá přístup k tajným údajům. |
| `"permissions": { "deny": ["Bash(git push --force*)", "Bash(git commit * --no-verify*)", "Bash(git config core.hooksPath*)"] }` | Druhá vrstva proti obcházení kontrol (první je hook pluginu). |
| `"cleanupPeriodDays": 30` | Přepisy konverzací se na noteboocích nehromadí. |
| `"env": { "DISABLE_FEEDBACK_COMMAND": "1", "CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY": "1" }` | Přepis konverzace včetně kódu se neodesílá jako zpětná vazba. |

Síť, MCP servery a instalaci balíčků nechte podle své politiky. Firemní pravidla pro agenta (jen fiktivní data, žádné napojení na firemní systémy, postup přes skills) načítá plugin na začátku každé konverzace a jsou i v CLAUDE.md šablon, do politiky je dávat nemusíte. Commit do `main`, `--no-verify`, force push a instalaci přes npm blokují hooky pluginu v každém repozitáři.

Ověření: tvůrce restartuje aplikaci Claude, v záložce Code napíše `/jablotron:` a nabídnou se firemní skills (mimo jiné `specifikace`, `plan`, `implementace`, `dokonceni`).

> **Co nastavení na notebooku nezajistí.** Hooky i politika jsou kontrola na straně klienta, ne bezpečnostní hranice: na nespravovaném počítači je zkušený uživatel obejde. A agent spouští kód aplikace na počítači tvůrce, takže vidí totéž co tvůrce. Pokud jsou na jeho notebooku namapované síťové disky, VPN nebo uložená hesla k interním systémům, agent k nim technicky může. Skutečné hranice proto tvoří pravidla větve `main`, kontroly v CI a **oddělené vývojové prostředí bez přístupu k produkčním systémům a datům**. Doporučujeme pro tvůrce samostatný uživatelský účet nebo virtuální počítač bez namapovaných disků a VPN, na Macu případně sandbox (krok 9).

### c) Claude Code Review (AI review pull requestů) – volitelné, v pilotu vypnuté

V pilotu se nepoužívá. Nezávislou AI kontrolu dělá plugin na počítači tvůrce při `/jablotron:dokonceni` (kontrola celé větve a bezpečnostní recenzent v novém kontextu), ještě před vytvořením pull requestu. Claude Code Review na GitHubu je možné zapnout později jako další vrstvu, účtuje se zvlášť:

1. Admin Settings → **Usage**: zapněte usage credits (Code Review se z nich účtuje) a nastavte měsíční limit pro *Claude Code Review*. Jedno review stojí orientačně 15–25 USD.
2. Admin Settings → Claude Code → **Code Review** → **Setup** → nainstalujte **Claude GitHub App** do organizace. Doporučujeme přístup ke všem repozitářům, jinak se každá nová aplikace musí přidávat ručně (krok 5).
3. U každého repozitáře aplikace nastavte *Review Behavior* na **Once after PR creation**. Další review si tvůrce vyžádá komentářem `@claude review`.

Review neblokuje sloučení samo, ale pravidla větve vyžadují **vyřešení všech komentářů**. Tvůrce tak musí každý nález buď opravit, nebo vědomě uzavřít. Pull requesty od Dependabotu review také spouštějí; pokud je to zbytečný náklad, přepněte repozitář na *Manual*.

### d) Přehled využití

Owner v Admin Settings → **Claude Code** zapne **Claude Code analytics** a pak **GitHub analytics** (přihlásit se ke GitHubu a vybrat organizaci; Claude GitHub App z kroku 6c už je nainstalovaná). Na https://claude.ai/analytics/claude-code pak Owner a Admin uvidí aktivní tvůrce, počet relací a sloučené pull requesty s kódem napsaným s Claude Code. Je to podklad pro vyhodnocení pilotu.

### e) Co se děje s daty

- Na plánu Team Anthropic kód ani konverzace z Claude Code nepoužívá k trénování modelů a uchovává je 30 dní.
- Claude Code ukládá přepisy konverzací v čitelné podobě i na počítači tvůrce (`~/.claude/projects/`), aby šlo na práci navázat. Doporučené nastavení `cleanupPeriodDays` je maže po 30 dnech (krok 6b). I proto do konverzace nepatří skutečná data.
- Podrobnosti: dokumentace Claude Code, stránka *Data usage*.

## 7. Notebooky tvůrců

Na Windows i Macu (většinou s admin právy):

| Nástroj | Odkud | Poznámka |
|---|---|---|
| Aplikace Claude | https://claude.com/download | Přihlásit firemním účtem |
| Git | Windows: https://git-scm.com/download/win · Mac: `xcode-select --install` | Na Windows s Git Bash (výchozí volba). Claude Code ho na Windows potřebuje. |
| GitHub CLI | https://cli.github.com | Po instalaci `gh auth login` **a `gh auth setup-git`**. Bez toho Claude Code nestáhne plugin z privátního repozitáře. |
| Node.js 24 LTS | https://nodejs.org | Potřebuje ho i plugin `jablotron` (hooky), tedy i tvůrci PHP aplikací. |
| pnpm | `npm install -g pnpm` | |
| Python 3.12+ | https://www.python.org/downloads/ | Na Windows zaškrtnout *Add python.exe to PATH*. Potřebuje ho bezpečnostní plugin. |
| Microsoft Visual C++ Redistributable (jen Windows) | https://aka.ms/vs/17/release/vc_redist.x64.exe | Většinou už je nainstalovaný. Potřebuje ho vývojová databáze MySQL. |
| PHP 8.1+ (jen tvůrci aplikací pro JBT Platform) | Windows: `winget install PHP.PHP.8.4` · Mac: `brew install php` | Na Windows první spuštění `php tools/setup.php` vytvoří `php.ini` se zapnutými rozšířeními; pak nový terminál a příprava znovu. |

Síť (proxy, firewall) musí propustit: `claude.ai`, `api.anthropic.com`, `github.com`, `api.github.com`, `*.githubusercontent.com`, `registry.npmjs.org`, `ui.shadcn.com`, `pypi.org`, `files.pythonhosted.org`, `cdn.playwright.dev`, `playwright.download.prss.microsoft.com`, `cdn.mysql.com` (vývojová databáze MySQL). Tvůrci PHP aplikací navíc `jbtplatform.cz` (přihlášení na rozcestník).

Kontrolu provede tvůrce v naklonovaném repozitáři příkazem `node scripts/check-env.mjs` a pak jednorázově `pnpm bootstrap` (závislosti, kontrola před commitem, prohlížeč pro testy a vývojová databáze MySQL 8.4: jednou na počítač se stáhne z cdn.mysql.com, 80–280 MB podle systému, s ověřeným otiskem souboru). Databáze běží jen na 127.0.0.1, bez Dockeru a bez instalace. Vyžaduje macOS 15 nebo novější, Windows 10/11 x64 nebo Linux x64. U PHP aplikace stačí `php tools/setup.php`: ověří PHP a rozšíření, zapne kontrolu před commitem a stáhne PHPStan.

## 8. Ověření celého řetězce (15 minut)

1. Založte zkušební aplikaci podle kroku 5 (např. `test-vibecoding`).
2. Jako tvůrce ji naklonujte, spusťte `pnpm bootstrap`, otevřete ji v aplikaci Claude (Code → Local → složka) a spusťte `/jablotron:specifikace`.
3. Nechte agenta vyplnit chartu s fiktivními údaji, vytvořit větev a pull request.
4. Ověřte, že u pull requestu proběhne všech pět kontrol.
5. Zkuste v pull requestu upravit soubor v `.github/`: sloučení musí čekat na schválení týmem `vibecoding-spravci`.
6. Zkušební repozitář smažte.

PHP šablonu ověřte stejně se zkušební aplikací z kroku 5b: `php tools/setup.php`, `php tools/check.php` (všechny čtyři kroky zelené), `/jablotron:specifikace`, pull request s pěti kontrolami. Po sloučení do `main` workflow Nasazení jen oznámí, že aplikace ve stavu `experiment` se nenasazuje.

## 9. Volitelně: sandbox na Macu

Sandbox Claude Code omezí příkazy agenta na složku projektu a na povolené adresy. Funguje na macOS a ve WSL2, na Windows nativně ne. **Před plošným zapnutím ho vyzkoušejte na jednom Macu** (`pnpm dev`, `pnpm test:e2e`, `git push`, `gh pr create`). Pak do své politiky Claude Code (Managed settings) přidejte:

```json
"sandbox": {
  "enabled": true,
  "network": {
    "allowManagedDomainsOnly": true,
    "allowedDomains": [
      "github.com", "*.github.com", "*.githubusercontent.com",
      "registry.npmjs.org", "ui.shadcn.com",
      "cdn.playwright.dev", "playwright.download.prss.microsoft.com",
      "cdn.mysql.com"
    ]
  }
}
```

a uložte.

## 10. Údržba

| Co | Jak |
|---|---|
| **Přehled aplikací** | Před každou čtvrtletní revizí: ve složce repozitáře `jablotron-vibecoding` spusťte `node nastaveni/app-overview.mjs <organizace>`. Sestaví `PREHLED-APLIKACI.md` z chart všech aplikací (úroveň, vlastník, revize po termínu, čekající aktualizace, repozitáře bez charty). Výsledek commitněte. |
| **Plugin** (skills, pravidla) | Změna v `plugins/jablotron/` přes pull request, zvýšit `version` v `plugin.json`. Tvůrcům se aktualizace stáhne sama. |
| **Šablona** | Změny se projeví jen v nově založených aplikacích. Do existujících se přenášejí ručně (typicky `.github/`, `.semgrep/`, `scripts/`). |
| **Kritická oprava knihovny mladší než 7 dní** | pnpm ji odmítne nainstalovat. V `pnpm-workspace.yaml` dané aplikace dočasně přidejte balíček do `minimumReleaseAgeExclude`, po týdnu ho odeberte. |
| **Politika Claude Code** | Doporučení v kroku 6b. Pravidla v pluginu se tvůrcům aktualizují sama. |
| **Revize** | Čtvrtletně podle [šablony revize](../sablony/ctvrtletni-revize.md). |
