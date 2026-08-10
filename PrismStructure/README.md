# PrismStructure — Playwright Framework

Prism-inspired layered automation for Toolshop UI + API.

## Structure

| Folder | Purpose |
|--------|---------|
| `pages/` | Page Object Model (UI actions + locators) |
| `api/` | API client wrappers |
| `fixtures/` | Playwright test fixtures |
| `utils/` | Env config, data generators |
| `data/` | Static test data JSON |
| `tests/ui/` | UI smoke + regression specs |
| `tests/api/` | API smoke + regression specs |
| `reports/` | HTML/JSON reports (generated) |

## Run

```powershell
npm install
npx playwright install chromium
npm test
```

See root `readme.md` for smoke/regression command variants.
