# QA AI Practical Assessment — assigment-ttn

Playwright-based UI and API test automation for **Practice Software Testing Toolshop v2.4**, submitted as part of the QA AI Capability Exercise.

| Attribute | Value |
|-----------|-------|
| Application | Toolshop v2.4 (Practice Software Testing) |
| UI URL | https://practicesoftwaretesting.com |
| API base | https://api.practicesoftwaretesting.com |
| API docs | https://api.practicesoftwaretesting.com/api/documentation |
| Automation root | `PrismStructure/` |
| Assessment branch | `assesment` |
| GitHub | https://github.com/ankitsingh4-commits/assigment-ttn |

---

## 1. Project overview

This repository delivers QA coverage for the Toolshop ecommerce application:

| Layer | Count | IDs | Location |
|-------|-------|-----|----------|
| Manual | 8 | TC-MAN-01 … TC-MAN-08 | `FunctionalTestCase.csv` (repo root) |
| UI automation | 8 | TC-UI-01 … TC-UI-08 | `PrismStructure/tests/ui/` |
| API automation | 8 | TC-API-01 … TC-API-08 | `PrismStructure/tests/api/` |
| **Total automated** | **16** | 7 smoke + 9 regression | — |

Automation uses **Playwright** (`@playwright/test` ^1.49.0) with JavaScript in a Prism-inspired layered layout:

- **Page Object Model** — `PrismStructure/pages/`
- **API client wrappers** — `PrismStructure/api/`
- **Fixtures** — `PrismStructure/fixtures/uiFixtures.js`
- **Shared utilities** — `PrismStructure/utils/`
- **Static and generated test data** — `PrismStructure/data/` and `PrismStructure/utils/dataGenerator.js`

Tests are tagged in titles with `@smoke` or `@regression` and filtered via npm scripts and `--grep`.

Additional project documentation: `project-info.md`, `requirement-risk-analysis.md`, `PrismStructure/README.md`, and AI prompt history in `ai-prompts/`.

---

## 2. Prerequisites

- **Node.js** 18 or later and **npm**
- **Git**
- Network access to:
  - `https://practicesoftwaretesting.com` (UI)
  - `https://api.practicesoftwaretesting.com` (API)

---

## 3. Installation

All commands below are run from the `PrismStructure/` directory.

```powershell
cd PrismStructure
npm install
npx playwright install chromium
```

Playwright is configured to run **Chromium** (Desktop Chrome profile) as the sole browser project.

### Windows: browser install location

If Playwright cannot find installed browsers (for example, after a custom install path or restricted user profile), set `PLAYWRIGHT_BROWSERS_PATH` before install and test runs:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "$env:USERPROFILE\.cache\ms-playwright"
npx playwright install chromium
```

Use the same variable in the session when running tests if your environment requires it.

---

## 4. Configuration

Environment variables are **optional**. Defaults are loaded from `PrismStructure/data/testData.json` via `PrismStructure/utils/env.js`.

### `.env.example`

Copy the example file and adjust values as needed (do not commit a real `.env`):

```powershell
cd PrismStructure
copy .env.example .env
```

`PrismStructure/.env.example` contents:

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | UI base URL (Playwright `baseURL`) |
| `API_BASE_URL` | API root for `ApiClient` |
| `USER_EMAIL` | Override default login email |
| `USER_PASSWORD` | Override default login password |

### Defaults from `utils/env.js`

| Variable | Default when unset |
|----------|-------------------|
| `BASE_URL` | `https://practicesoftwaretesting.com` |
| `API_BASE_URL` | `https://api.practicesoftwaretesting.com` |
| `USER_EMAIL` | `testData.json` → `defaultUser.email` |
| `USER_PASSWORD` | `testData.json` → `defaultUser.password` |

`playwright.config.js` reads `BASE_URL` for Playwright `use.baseURL`. API modules read `API_BASE_URL` through `env.js`.

### Demo credentials (public SUT seed user)

These are practice-site demo credentials in `PrismStructure/data/testData.json`, not production secrets:

| Field | Value |
|-------|-------|
| Email | `customer2@practicesoftwaretesting.com` |
| Password | `welcome01` |

Override at runtime with `USER_EMAIL` and `USER_PASSWORD` if needed.

---

## 5. Test-data location

| Source | Path | Purpose |
|--------|------|---------|
| Static JSON | `PrismStructure/data/testData.json` | Default user, UI register fields, billing address, search terms, invalid password, API register/invoice payloads |
| Generators | `PrismStructure/utils/dataGenerator.js` | `uniqueEmail`, `uniquePassword`, `uniqueRegisterUser`, `registerPayload`, `invoicePayload` |
| Environment | `PrismStructure/utils/env.js` | `BASE_URL`, `API_BASE_URL`, credential overrides |
| Manual cases | `FunctionalTestCase.csv` | Eight manual test cases (TC-MAN-01 … TC-MAN-08) |

**Design notes:**

- Flows that need fresh users call `uniqueRegisterUser()` or `ToolshopFlow.registerUniqueUser()` to avoid registration collisions.
- Regression flows that need a stable account use `getDefaultUser()` (`customer2@practicesoftwaretesting.com`).
- UI billing (`billingAddress`) and API invoice (`apiInvoice`) share Zoey Shore / Hesselbury / Florida values for traceability.

---

## 6. Test commands

Run all commands from `PrismStructure/`. Script names match `PrismStructure/package.json` exactly.

### Full suite and by tag

```powershell
# Full suite (all 16 automated tests)
npm test

# By tag — all tiers
npm run test:smoke
npm run test:regression
```

| Script | Underlying command |
|--------|-------------------|
| `npm test` | `playwright test` |
| `npm run test:smoke` | `playwright test --grep @smoke` |
| `npm run test:regression` | `playwright test --grep @regression` |

### UI tests

```powershell
npm run test:ui
npm run test:ui:smoke
npm run test:ui:regression
```

| Script | Underlying command |
|--------|-------------------|
| `npm run test:ui` | `playwright test tests/ui` |
| `npm run test:ui:smoke` | `playwright test tests/ui --grep @smoke` |
| `npm run test:ui:regression` | `playwright test tests/ui --grep @regression` |

### API tests

```powershell
npm run test:api
npm run test:api:smoke
npm run test:api:regression
```

| Script | Underlying command |
|--------|-------------------|
| `npm run test:api` | `playwright test tests/api` |
| `npm run test:api:smoke` | `playwright test tests/api --grep @smoke` |
| `npm run test:api:regression` | `playwright test tests/api --grep @regression` |

### Smoke vs regression coverage

| Tag | Count | Scenarios |
|-----|-------|-----------|
| `@smoke` | 7 | TC-UI-01–04, TC-API-01–03 |
| `@regression` | 9 | TC-UI-05–08, TC-API-04–08 |

### Manual tests

Execute cases from `FunctionalTestCase.csv` at the repository root.

---

## 7. Report generation and location

Reporting is configured in `PrismStructure/playwright.config.js`:

| Reporter | Output |
|----------|--------|
| `list` | Console during run |
| `html` | `PrismStructure/reports/html/` (`open: 'never'`) |
| `json` | `PrismStructure/reports/execution-report.json` |

Playwright artifacts (traces, screenshots, video) are written to `PrismStructure/reports/test-results/` (`outputDir`).

Open the HTML report after a run:

```powershell
npm run report
```

| Script | Underlying command |
|--------|-------------------|
| `npm run report` | `playwright show-report reports/html` |

**Generated paths (not committed):**

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure/reports/html/index.html` |
| JSON execution report | `PrismStructure/reports/execution-report.json` |
| Traces, screenshots, video | `PrismStructure/reports/test-results/` |

`PrismStructure/.gitignore` excludes `reports/html/`, `reports/test-results/`, `playwright-report/`, `*.log`, `.env`, and `node_modules/`.

---

## 8. Repository structure

```
assigment-ttn/
├── FunctionalTestCase.csv       # 8 manual test cases
├── project-info.md              # Detailed assessment documentation
├── requirement-risk-analysis.md # Requirement-to-risk mapping
├── README.md                    # This file
├── ai-prompts/                  # AI prompt history (5 markdown files)
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── PrismStructure/              # Playwright automation framework
│   ├── pages/                   # Page Object Model (10 modules incl. BasePage)
│   │   ├── BasePage.js
│   │   ├── HomePage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── ProductPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── InvoicePage.js
│   │   ├── ProfilePage.js
│   │   └── NavBar.js
│   ├── api/                     # API client layer (6 modules)
│   │   ├── ApiClient.js
│   │   ├── AuthApi.js
│   │   ├── ProductApi.js
│   │   ├── CartApi.js
│   │   ├── InvoiceApi.js
│   │   └── ToolshopFlow.js
│   ├── fixtures/
│   │   └── uiFixtures.js        # Injects page objects into UI tests
│   ├── utils/
│   │   ├── env.js               # Environment and testData loader
│   │   ├── dataGenerator.js     # Unique emails/passwords/payloads
│   │   ├── apiAssertions.js     # Shared API assertion helpers
│   │   └── price.js
│   ├── data/
│   │   └── testData.json        # Static test data
│   ├── tests/
│   │   ├── ui/
│   │   │   ├── smoke.spec.js    # TC-UI-01 … TC-UI-04
│   │   │   └── regression.spec.js # TC-UI-05 … TC-UI-08
│   │   └── api/
│   │       ├── smoke.spec.js    # TC-API-01 … TC-API-03
│   │       └── regression.spec.js # TC-API-04 … TC-API-08
│   ├── reports/                 # Generated after test runs
│   ├── playwright.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
└── .cursor/                     # Cursor rules for this assessment
```

**Playwright config highlights** (`playwright.config.js`):

- `testDir`: `./tests`
- `testMatch`: `**/*.spec.js`
- `baseURL`: `process.env.BASE_URL` or `https://practicesoftwaretesting.com`
- `workers`: 1, `retries`: 1, `timeout`: 60000 ms
- `trace` / `screenshot` / `video`: retain on failure

---

## 9. Known application behavior

### Cash on Delivery (COD) — double Confirm for invoice

On **Toolshop v2.4**, completing a Cash on Delivery checkout and generating an invoice requires clicking **Confirm twice** after selecting the payment method:

1. First Confirm — shows “Payment was successful”.
2. Second Confirm — completes the order and shows “Thanks for your order”.
3. A new invoice then appears under **My Invoices**.

A **single** Confirm does not fully complete the order and does not generate a new invoice. This is covered by:

- Manual: **TC-MAN-06** (double confirm) and **TC-MAN-07** (single confirm)
- UI: **TC-UI-04** (E2E with double confirm) and **TC-UI-08** (single confirm only)
- Automation: `CheckoutPage.confirmPaymentTwice()` in `PrismStructure/pages/CheckoutPage.js`

### Other behaviors reflected in tests

- Invalid login shows an error and keeps the user signed out (TC-UI-05, TC-API-05).
- Product search with no matches shows an empty state (TC-UI-07).
- API invoice creation rejects missing or invalid bearer tokens (TC-API-06).
- Cart API add-item patterns may vary across practice guides; `CartApi` uses fallback request shapes.

---

## 10. Troubleshooting

| Symptom | Likely cause | What to try |
|---------|--------------|-------------|
| `Executable doesn't exist` / browser not found | Chromium not installed or custom browser path on Windows | Run `npx playwright install chromium`; set `PLAYWRIGHT_BROWSERS_PATH` (see [Installation](#windows-browser-install-location)) |
| Timeouts or connection errors | External SUT unavailable or slow | Retry later; confirm network access to practicesoftwaretesting.com and api.practicesoftwaretesting.com |
| Registration or login failures on repeat runs | Email already registered | Tests use `uniqueRegisterUser()` / `uniqueEmail()` for fresh users; for seeded user, use `customer2@practicesoftwaretesting.com` |
| Checkout does not complete / no invoice | Single Confirm only | Use double Confirm for COD (see [Known application behavior](#9-known-application-behavior)) |
| API cart or invoice 404/405 | Endpoint or payload mismatch | See `CartApi` fallback logic; confirm `API_BASE_URL` matches `https://api.practicesoftwaretesting.com` |
| Stale or missing HTML report | Report not generated or gitignored | Re-run tests from `PrismStructure/`; open with `npm run report` |
| Credential override ignored | Wrong working directory | Set `USER_EMAIL` / `USER_PASSWORD` in shell or `PrismStructure/.env` before `npm test` |
| Flaky UI assertions after login | Profile display name varies for seeded users | Automation asserts `nav-profile` visibility rather than a fixed display name |

**Debug artifacts:** On failure, Playwright retains trace, screenshot, and video under `PrismStructure/reports/test-results/`. Open traces with:

```powershell
npx playwright show-trace reports/test-results/<test-folder>/trace.zip
```

---

## Related documentation

- `project-info.md` — Full assessment summary, scope, AI usage, and reuse guidance
- `PrismStructure/README.md` — Framework-focused quick reference
- `requirement-risk-analysis.md` — P0–P2 risk mapping to test IDs
- `ai-prompts/` — Cursor prompt history used during development
