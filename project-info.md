# Project Information — QA AI Practical Assessment

**Repository:** `assigment-ttn`  
**Primary AI tool:** Cursor (planning, automation, documentation, debugging)  
**Assessment branch:** `assesment`  
**GitHub:** https://github.com/ankitsingh4-commits/assigment-ttn

---

## 1. Project summary

This repository delivers QA coverage for the **Practice Software Testing Toolshop v2.4** ecommerce application as part of the QA AI Capability Exercise. Work spans **8 manual** cases (`FunctionalTestCase.csv`), **8 UI** automated tests (`PrismStructure/tests/ui/`), and **8 API** automated tests (`PrismStructure/tests/api/`), organized with `@smoke` and `@regression` tags.

Automation lives under `PrismStructure/` in a Prism-inspired layered layout: Page Object Model for UI, API client wrappers for REST calls, shared fixtures, static and generated test data, and Playwright reporters for HTML and JSON output. Root-level artifacts include `README.md`, `ai-prompts/`, `requirement-risk-analysis.md`, and this file. There is **no `docs/` folder** in the repository; operational documentation is in `README.md` and `PrismStructure/README.md`.

| Layer | Count | IDs | Location |
|-------|-------|-----|----------|
| Manual | 8 | TC-MAN-01 … TC-MAN-08 | `FunctionalTestCase.csv` |
| UI automation | 8 | TC-UI-01 … TC-UI-08 | `PrismStructure/tests/ui/` |
| API automation | 8 | TC-API-01 … TC-API-08 | `PrismStructure/tests/api/` |
| **Total automated** | **16** | 7 smoke + 9 regression | — |

---

## 2. Application under test

| Attribute | Value |
|-----------|--------|
| Application | Toolshop v2.4 (Practice Software Testing) |
| UI URL | https://practicesoftwaretesting.com |
| API base | https://api.practicesoftwaretesting.com |
| API docs | https://api.practicesoftwaretesting.com/api/documentation |
| Domain flows | Registration, login, product catalog/search, cart, Cash on Delivery checkout, invoice |

**Critical UI behavior (documented in assessment and automation):** invoice generation on checkout requires **double Confirm** after selecting Cash on Delivery. `CheckoutPage.confirmPaymentTwice()` in `PrismStructure/pages/CheckoutPage.js` implements this.

**Demo credentials** (public SUT seed user, not production secrets) are in `PrismStructure/data/testData.json`:

- Email: `customer2@practicesoftwaretesting.com`
- Password: `welcome01`

Overrides are supported via `USER_EMAIL` and `USER_PASSWORD` environment variables (`PrismStructure/utils/env.js`).

---

## 3. Tools used

| Category | Tool / artifact |
|----------|-----------------|
| Language | JavaScript (Node.js 18+) |
| Test runner | Playwright `@playwright/test` ^1.49.0 |
| Browser | Chromium (Desktop Chrome profile) |
| UI pattern | Prism-style Page Object Model (`PrismStructure/pages/`) |
| API pattern | `APIRequestContext` via `ApiClient` + domain APIs (`AuthApi`, `CartApi`, `ProductApi`, `InvoiceApi`, `ToolshopFlow`) |
| Fixtures | `PrismStructure/fixtures/uiFixtures.js` (injects page objects) |
| AI IDE | Cursor |
| Version control | Git, GitHub |
| Reporting | Playwright HTML + JSON reporters (`playwright.config.js`) |
| Locator strategy | `data-test` attributes and role-based selectors (per `.cursor/rules/qa-assessment.mdc`) |

**Note:** The Cursor rule file references TypeScript, but all automation in this repo is **JavaScript** (`*.spec.js`, `*.js` modules).

---

## 4. Scope and acceptance criteria

Scope aligns with the Toolshop customer journey: discover products, authenticate, manage cart quantities and totals, complete COD checkout, and verify invoices on UI and API.

| Acceptance theme | Repo coverage |
|--------------------|---------------|
| User registration | TC-UI-02 (smoke), TC-API-02 (smoke), TC-MAN-01 |
| Valid login | TC-UI-03 (smoke), TC-API-02, TC-MAN-02 |
| Invalid login | TC-UI-05 (regression), TC-API-05, TC-MAN-03 |
| Product catalog | TC-UI-01 (smoke), TC-API-01 |
| Product search | TC-UI-07 (no-match edge), TC-MAN-04 (positive search) |
| Cart (multi-item, quantity) | TC-UI-04 (smoke E2E), TC-API-03/04, TC-MAN-05 |
| COD checkout + invoice | TC-UI-04, TC-API-04, TC-MAN-06 |
| Single confirm (no invoice) | TC-UI-08, TC-MAN-07 |
| Billing validation | TC-MAN-08 (manual only) |
| API auth errors | TC-API-05, TC-API-06 |
| API not-found / validation | TC-API-07, TC-API-08 |
| Profile verification | TC-UI-06, TC-MAN-02 (implicit) |

Detailed requirement-to-risk mapping is in `requirement-risk-analysis.md` at the repository root.

---

## 5. Requirement and risk analysis

High-risk areas identified in `requirement-risk-analysis.md` and reflected in test design:

| Priority | Risk area | Why it matters | Primary tests |
|----------|-----------|----------------|---------------|
| P0 | Authentication | Blocks all logged-in flows | TC-UI-03, TC-API-02, TC-API-05 |
| P0 | COD checkout + double confirm | Revenue path; invoice depends on two confirms | TC-UI-04, TC-UI-08, TC-MAN-06/07 |
| P0 | Cart quantity / totals | Wrong charges or blocked checkout | TC-UI-04, TC-API-04, TC-MAN-05 |
| P1 | Registration | Onboarding funnel | TC-UI-02, TC-API-02, TC-MAN-01 |
| P1 | Profile data | Session / identity trust | TC-UI-06 |
| P2 | Search / catalog | Discovery before purchase | TC-UI-01, TC-UI-07, TC-MAN-04 |
| P1 | API authorization on invoice | Secures order creation | TC-API-06 |
| P1 | Invalid IDs / payloads | API robustness | TC-API-07, TC-API-08 |

**Operational risks:** external SUT availability and latency; API cart-add patterns documented inconsistently across practice guides (addressed in `CartApi` with `POST /carts/{id}`).

---

## 6. UI/API strategy

### UI strategy

- **POM:** `BasePage`, `HomePage`, `LoginPage`, `RegisterPage`, `ProductPage`, `CartPage`, `CheckoutPage`, `ProfilePage`, `NavBar`, `InvoicePage` under `PrismStructure/pages/`.
- **Assertions in specs:** page objects expose locators and actions; expectations remain in `tests/ui/*.spec.js` (matches project rules).
- **Fixtures:** `uiFixtures.js` extends Playwright `test` to inject page objects per test.
- **Data-test locators:** e.g. `[data-test="finish"]`, `[data-test="country"]`, `nav-profile` patterns in pages.
- **Hybrid setup:** smoke login and E2E purchase tests register users via `AuthApi` first to avoid UI registration flakiness, then exercise UI flows.

### API strategy

- **Client layer:** `ApiClient` centralizes base URL, bearer headers, GET/POST/PUT.
- **Domain APIs:** `AuthApi`, `ProductApi`, `CartApi`, `InvoiceApi`.
- **Flow orchestration:** `ToolshopFlow` composes register → login → catalog → cart → invoice for regression scenarios.
- **Shared assertions:** `PrismStructure/utils/apiAssertions.js` (token shape, pagination, cart items, invoice COD fields, 401/404/validation helpers).
- **No browser:** API specs use Playwright `request` fixture only (`tests/api/*.spec.js`).

### Configuration

`PrismStructure/playwright.config.js`:

- `testDir`: `./tests`
- `baseURL`: `https://practicesoftwaretesting.com` (or `BASE_URL`)
- `workers`: 1, `retries`: 1, `timeout`: 60000 ms
- `trace` / `screenshot` / `video`: retain on failure
- Reporters: list, HTML → `reports/html`, JSON → `reports/execution-report.json`
- `outputDir`: `reports/test-results`

---

## 7. Smoke / regression strategy

Tests are tagged in titles with `@smoke` or `@regression` and filtered via `package.json` scripts and `--grep`.

### npm scripts (`PrismStructure/package.json`)

| Script | Command behavior |
|--------|------------------|
| `npm test` | Full suite (16 tests) |
| `npm run test:smoke` | `--grep @smoke` (7 tests) |
| `npm run test:regression` | `--grep @regression` (9 tests) |
| `npm run test:ui` / `test:ui:smoke` / `test:ui:regression` | UI subset |
| `npm run test:api` / `test:api:smoke` / `test:api:regression` | API subset |
| `npm run report` | `playwright show-report reports/html` |

### Smoke (sanity) — 7 automated cases

Fast confidence that catalog, auth, cart creation, and core E2E purchase path work.

| ID | Tier | Scenario |
|----|------|----------|
| TC-UI-01 | UI | Homepage product catalog visible |
| TC-UI-02 | UI | Registration with valid credentials |
| TC-UI-03 | UI | Login with valid credentials |
| TC-UI-04 | UI | E2E: cart, quantity update, COD, double confirm, invoice |
| TC-API-01 | API | List products (paginated) |
| TC-API-02 | API | Register + login returns bearer token |
| TC-API-03 | API | Authenticated user creates cart |

Manual smoke: **TC-MAN-02** (valid login).

### Regression — 9 automated + 7 manual cases

Broader negative, edge, and lifecycle coverage.

| ID | Tier | Scenario |
|----|------|----------|
| TC-UI-05 | UI | Invalid login error, user stays signed out |
| TC-UI-06 | UI | Profile shows seeded user name fields |
| TC-UI-07 | UI | Search with no matches shows empty state |
| TC-UI-08 | UI | Single confirm does not complete order / no new invoice |
| TC-API-04 | API | Full lifecycle: auth → cart → invoice |
| TC-API-05 | API | Invalid login returns unauthorized |
| TC-API-06 | API | Invoice rejects missing/invalid bearer token |
| TC-API-07 | API | Invalid cart/product IDs return not found |
| TC-API-08 | API | Invoice missing required fields → validation errors |

Manual regression: **TC-MAN-01, 03–08** (registration, invalid login, search, cart edge, COD flows, billing validation).

---

## 8. Positive / negative / edge coverage

| Type | UI automation | API automation | Manual (`FunctionalTestCase.csv`) |
|------|---------------|----------------|-----------------------------------|
| **Positive** | Catalog, register, login, full COD purchase (TC-UI-01–04) | List products, register/login, create cart, full lifecycle (TC-API-01–04) | TC-MAN-01, 02, 04, 05, 06 |
| **Negative** | Invalid login (TC-UI-05) | Wrong password (TC-API-05), bad tokens (TC-API-06), validation errors (TC-API-08) | TC-MAN-03, 08 |
| **Edge** | Empty search (TC-UI-07), single confirm only (TC-UI-08) | Invalid resource IDs (TC-API-07) | TC-MAN-05 (multi-product + quantity), TC-MAN-07 (single confirm) |

**Gaps (not automated in repo):** TC-MAN-04 (positive product search UI), TC-MAN-08 (missing billing fields), duplicate-email registration, weak-password validation, and dedicated API product-search endpoint tests. `requirement-risk-analysis.md` lists additional manual-only scenarios not implemented as specs.

---

## 9. Test-data strategy

| Source | Path | Purpose |
|--------|------|---------|
| Static JSON | `PrismStructure/data/testData.json` | Default user, UI register fields, billing address, search terms, invalid password, API register/invoice payloads |
| Generators | `PrismStructure/utils/dataGenerator.js` | `uniqueEmail`, `uniquePassword`, `uniqueRegisterUser`, `registerPayload`, `invoicePayload` |
| Environment | `PrismStructure/utils/env.js` | `BASE_URL`, `API_BASE_URL`, credential overrides |
| Runtime uniqueness | Timestamp + random suffix on emails/passwords | Avoids registration collisions on repeated runs |

**Design choices:**

- E2E and API flows that need fresh users call `uniqueRegisterUser()` or `ToolshopFlow.registerUniqueUser()`.
- Regression flows that need a stable seeded account use `getDefaultUser()` (`customer2@practicesoftwaretesting.com`).
- UI billing (`billingAddress`) and API invoice (`apiInvoice`) share Zoey Shore / Hesselbury / Florida values for traceability; API uses `billing_country: "TG"` per assessment example payload.
- `CheckoutPage.fillBillingAddress()` handles country as select when visible.

`PrismStructure/.env.example` documents optional env overrides (`BASE_URL`, `API_BASE_URL`, `USER_EMAIL`, `USER_PASSWORD`); env vars are optional and defaults are documented in `README.md`.

---

## 10. How AI was used

Prompt history is captured in `ai-prompts/` (six markdown files):

| File | AI use |
|------|--------|
| `requirements-and-planning.md` | Extracted assessment deliverables, mapped AC flows, scaffolded PrismStructure layout |
| `test-design.md` | Designed manual CSV, UI/API scenario lists and TC ID scheme |
| `test-data.md` | Built register and invoice payloads aligned to Toolshop rules |
| `automation-and-debugging.md` | Cart API patterns, double-confirm checkout, flaky login assertion fixes |
| `documentation-and-summary.md` | `README.md`, `project-info.md`, root documentation |
| `conversation-log.md` | Session transcript of iterative debugging and validation runs |

**Workflow phases:**

1. **Planning** — Requirement extraction and sanity vs regression split (`requirements-and-planning.md`).
2. **Design** — Traceable TC IDs across manual/UI/API tiers (`test-design.md`, `FunctionalTestCase.csv`).
3. **Automation** — POM pages, API clients, fixtures, and tagged specs generated and refined in Cursor.
4. **Validation** — Tests executed against live SUT; reporters written to `PrismStructure/reports/`.
5. **Debugging** — Trace-on-failure, API status/body inspection, cart endpoint and checkout confirm sequencing (`automation-and-debugging.md`).

---

## 11. Responsible AI and sensitive-data precautions

- **Demo credentials only:** `testData.json` holds public Toolshop practice-site credentials; they are not production secrets. Env overrides avoid hardcoding in CI.
- **No real PII in repo:** Generated emails use `@example.com`; registration uses synthetic names.
- **`.gitignore` patterns** (`PrismStructure/.gitignore`): `node_modules/`, `reports/test-results/`, `reports/html/`, `test-results/`, `playwright-report/`, `*.log`, `.env`, `.DS_Store` — keeps local secrets and ephemeral artifacts out of version control.
- **AI boundary:** Assessment PDF and SUT URLs were shared with AI; production credentials, internal VPN keys, and personal tokens were not included (per `ai-prompts` validation notes).
- **Human validation:** AI-generated tests and docs were run against the live application and edited where SUT behavior differed (e.g., profile display name, cart API shape).

---

## 12. How this workflow can be reused

1. **Clone structure:** Copy `PrismStructure/` folder layout (`pages/`, `api/`, `fixtures/`, `utils/`, `data/`, `tests/ui`, `tests/api`, `reports/`).
2. **Swap SUT config:** Update `testData.json`, `env.js` defaults, and `playwright.config.js` `baseURL`.
3. **Reuse tagging model:** `@smoke` / `@regression` with npm `--grep` scripts for CI tiers.
4. **Reuse AI prompt templates:** `ai-prompts/` files as starting prompts for requirements, test design, data, and debugging on new projects.
5. **Extend POM/API layers:** Add pages or API modules without changing spec assertion style.
6. **Reporting:** Same reporter config produces HTML for humans and JSON for pipelines (`execution-report.json`).
7. **Risk-driven backlog:** `requirement-risk-analysis.md` template maps requirements to P0–P2 and TC IDs for gap analysis.

For a new ecommerce or API-backed app, the same Prism-style separation (UI POM + API clients + flow orchestrator + static/generated data) scales by replacing Toolshop-specific pages and endpoints while keeping Playwright fixtures and grep-based smoke/regression splits.

---

## Repository layout (actual)

```
assigment-ttn/
├── FunctionalTestCase.csv
├── project-info.md
├── README.md
├── requirement-risk-analysis.md
├── ai-prompts/
├── PrismStructure/
│   ├── pages/          (10 page objects + BasePage)
│   ├── api/            (6 modules)
│   ├── fixtures/uiFixtures.js
│   ├── utils/          (env, dataGenerator, apiAssertions, price)
│   ├── data/testData.json
│   ├── tests/ui/       (smoke.spec.js, regression.spec.js)
│   ├── tests/api/      (smoke.spec.js, regression.spec.js)
│   ├── playwright.config.js
│   ├── package.json
│   └── reports/        (generated: html/, execution-report.json, test-results/, *.log)
└── .cursor/
```

**Not present:** `docs/` directory.

---

## Reports structure

After test runs from `PrismStructure/`:

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure/reports/html/index.html` |
| JSON execution report | `PrismStructure/reports/execution-report.json` |
| Traces, screenshots, video | `PrismStructure/reports/test-results/` |
| Run logs (local) | `PrismStructure/reports/run-*.log` |

Open HTML report: `npm run report` from `PrismStructure/`.
