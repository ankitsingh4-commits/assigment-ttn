# QA AI Practical Assessment — assigment-ttn

Toolshop UI + API test automation for the QA AI Capability Exercise (Playwright + Cursor).

## Repository Layout

```
assigment-ttn/
├── FunctionalTestCase.csv
├── project-info.md
├── readme.md
├── ai-prompts/
├── PrismStructure/          # Playwright automation (Prism-inspired)
│   ├── pages/
│   ├── api/
│   ├── fixtures/
│   ├── utils/
│   ├── data/
│   ├── tests/ui/
│   ├── tests/api/
│   └── reports/             # Generated after test run
└── .cursor/
```

## Prerequisites

- **Node.js** 18+ and npm
- **Git**
- Network access to `practicesoftwaretesting.com` and `api.practicesoftwaretesting.com`

## Framework

**Playwright** with TypeScript, Page Object Model, and API client layer (`PrismStructure/`). Tags: `@smoke`, `@regression`.

## Setup

```powershell
cd PrismStructure
npm install
npx playwright install chromium
```

### Environment (optional)

| Variable | Default |
|----------|---------|
| `BASE_URL` | `https://practicesoftwaretesting.com` |
| `API_BASE_URL` | `https://api.practicesoftwaretesting.com` |
| `USER_EMAIL` | `customer2@practicesoftwaretesting.com` |
| `USER_PASSWORD` | `welcome01` |

## Test Data

- `PrismStructure/data/testData.json` — default user and billing address
- `PrismStructure/utils/dataGenerator.ts` — unique registration emails and invoice payloads

## Run Commands

From `PrismStructure/`:

```powershell
# Full suite
npm test

# Smoke (all)
npm run test:smoke

# Regression (all)
npm run test:regression

# UI only
npm run test:ui
npm run test:ui:smoke
npm run test:ui:regression

# API only
npm run test:api
npm run test:api:smoke
npm run test:api:regression

# Open HTML report
npm run report
```

## Reports Location

| Report | Path |
|--------|------|
| HTML report | `PrismStructure/reports/html/index.html` |
| JSON execution report | `PrismStructure/reports/execution-report.json` |
| Traces / screenshots | `PrismStructure/reports/test-results/` |

## Manual Tests

Execute cases from `FunctionalTestCase.csv` at repo root.

## Branch

Active development branch: `assesment`

## GitHub

https://github.com/ankitsingh4-commits/assigment-ttn
