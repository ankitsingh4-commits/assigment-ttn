# PrismStructure — Playwright JavaScript Framework

Prism-inspired layered automation for Toolshop UI and API testing.

## Structure

| Folder | Purpose |
|--------|---------|
| `pages/` | Page Object Model (locators + UI actions) |
| `api/` | Reusable API client wrappers |
| `fixtures/` | Playwright fixtures (page object injection) |
| `utils/` | Environment config and data builders |
| `data/` | Static test data (`testData.json`) |
| `tests/ui/` | UI smoke + regression specs |
| `tests/api/` | API smoke + regression specs |
| `reports/` | HTML and JSON execution reports (generated) |

## Configuration

Copy `.env.example` to `.env` and set URLs or credentials as needed. Defaults load from `data/testData.json`.

| Variable | Purpose |
|----------|---------|
| `BASE_URL` | UI base URL (Playwright `baseURL`) |
| `API_BASE_URL` | API root for `ApiClient` |
| `USER_EMAIL` | Override default login email |
| `USER_PASSWORD` | Override default login password |

## Run

```powershell
cd PrismStructure
npm install
npx playwright install chromium
npm test
npm run test:smoke
npm run test:regression
npm run report
```

Tags `@smoke` and `@regression` are in test titles and filtered via `--grep` npm scripts.
