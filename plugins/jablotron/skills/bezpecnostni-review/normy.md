# Normy a hloubka review

Review stojí na **OWASP Top 10:2025** a ke každému nálezu uvádí, kam patří i v dalších rámcích. Tvůrce i auditor tak vidí, které požadavky normy změna splňuje nebo porušuje.

| Rámec | K čemu slouží v review |
|---|---|
| OWASP Top 10:2025 | Deset kategorií rizik, podle nich je seřazený kontrolní seznam ([owasp-top10.md](owasp-top10.md)) |
| OWASP ASVS 5.0 | Ověřitelné požadavky podle úrovně (1–3). Úroveň ASVS se řídí úrovní rizika aplikace (tabulka níže) |
| CWE (MITRE), Top 25 z roku 2025 | Přesné označení slabiny u každého nálezu, například CWE-862 |
| ISO/IEC 27001:2022, příloha A | Opatření, ke kterým je review dokladem (hlavně A.8.25–A.8.29) |
| GDPR | Ochrana osobních údajů: čl. 5 (minimalizace), čl. 25 (ochrana už v návrhu), čl. 32 (zabezpečení zpracování) |
| NIST SSDF (SP 800-218) | Review odpovídá praktikám PW.7 (kontrola kódu) a PW.8 (testování) |
| OWASP Top 10 pro LLM (2025) | Jen u aplikací, které volají AI model |

## Mapování

Hvězdička u CWE označuje slabinu z CWE Top 25 (2025).

| OWASP 2025 | ASVS 5.0 (kapitoly) | Typické CWE | ISO/IEC 27001:2022 příloha A | GDPR |
|---|---|---|---|---|
| A01 Broken Access Control | V8 Authorization, V4 API and Web Service, V3 Web Frontend Security | 862\*, 863\*, 639\*, 284\*, 352\*, 306\*, 601 | A.5.15 Access control, A.8.3 Information access restriction | čl. 32 |
| A02 Security Misconfiguration | V13 Configuration, V3 Web Frontend Security | 693, 1021, 209, 200\*, 489 | A.8.9 Configuration management | čl. 32 |
| A03 Software Supply Chain Failures | V15 Secure Coding and Architecture | 1395, 1104, 494 | A.5.21 Managing information security in the ICT supply chain, A.8.8 Management of technical vulnerabilities | |
| A04 Cryptographic Failures | V11 Cryptography, V12 Secure Communication | 338, 330, 327, 328, 295, 798 | A.8.24 Use of cryptography | čl. 32 |
| A05 Injection | V1 Encoding and Sanitization, V2 Validation and Business Logic, V5 File Handling | 79\*, 89\*, 78\*, 94\*, 77\*, 22\*, 918\*, 20\*, 1333, 1321, 1236, 117 | A.8.28 Secure coding | |
| A06 Insecure Design | V2 Validation and Business Logic, V5 File Handling, V15 Secure Coding and Architecture | 434\*, 770\*, 602, 524, 409 | A.8.26 Application security requirements, A.8.27 Secure system architecture and engineering principles | čl. 25, čl. 5 odst. 1 písm. c |
| A07 Authentication Failures | V6 Authentication, V7 Session Management, V9 Self-contained Tokens | 287, 306\*, 613, 614, 1004, 798 | A.8.5 Secure authentication | čl. 32 |
| A08 Software or Data Integrity Failures | V2 Validation and Business Logic, V15 Secure Coding and Architecture | 502\*, 345, 494, 693 | A.8.25 Secure development life cycle, A.8.32 Change management | |
| A09 Security Logging and Alerting Failures | V16 Security Logging and Error Handling | 778, 532, 117 | A.8.15 Logging, A.8.16 Monitoring activities | čl. 32 |
| A10 Mishandling of Exceptional Conditions | V16 Security Logging and Error Handling, V15 Secure Coding and Architecture | 636, 755, 703, 390, 209 | A.8.28 Secure coding | |
| Firemní pravidla: data a osobní údaje | V14 Data Protection | 200\*, 359, 532 | A.5.34 Privacy and protection of PII, A.8.11 Data masking, A.8.12 Data leakage prevention, A.8.33 Test information, A.8.31 Separation of development, test and production environments | čl. 5, čl. 25, čl. 32 |
| Firemní pravidla: soulad se zadáním a kontroly | V15 Secure Coding and Architecture | 693 | A.8.25 Secure development life cycle, A.8.29 Security testing in development and acceptance, A.8.32 Change management | |

## Hloubka podle úrovně rizika

| Úroveň aplikace | Co review pokryje | Co musí proběhnout navíc |
|---|---|---|
| **L0** | OWASP Top 10 a firemní pravidla pro změněné soubory | – |
| **L1** | Totéž a požadavky **ASVS úrovně 1** v oblastech, kterých se změna týká. Před spuštěním celá aplikace (`celá aplikace`) | Nezávislá kontrola větve, podmínky spuštění |
| **L2** | Požadavky **ASVS úrovně 2** | Odborné code review člověkem, test oprávnění, posouzení ochrany osobních údajů |
| **L3** | ASVS úrovně 2 a vybrané požadavky úrovně 3 (oprávnění, ochrana dat, záznamy) | Bezpečnostní (penetrační) test nezávislou stranou, nezávislé ověření, u vysokého rizika posouzení vlivu na ochranu osobních údajů (čl. 35 GDPR) |

## Co review nenahrazuje

- **Penetrační test** běžící aplikace. Review čte kód, nezkouší útok na nasazenou aplikaci.
- **Odborné review člověkem** od úrovně L2. Agent, který kód kontroluje, je nezávislý na autorovi, ale není bezpečnostní specialista s odpovědností.
- **Audit ISO/IEC 27001.** Zpráva z review je doklad k opatřením A.8.28 a A.8.29, ne certifikace.
- **Kontrolu provozu:** server, síť, zálohy, přístupy správců, monitoring.
- **Právní posouzení** zpracování osobních údajů.
