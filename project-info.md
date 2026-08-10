# Project Information — QA AI Practical Assessment

**Primary AI Tool(s) Used:** Cursor (Auto / Composer for planning docs; Sonnet for Playwright automation)

**Application Under Test:** Practice Software Testing Toolshop — Checkout & Application Flow  
- UI: https://practicesoftwaretesting.com/  
- API: https://api.practicesoftwaretesting.com/api/documentation  

**Assessment Start Date:** 2026-08-10  
**Submission Date:** 2026-08-10  

## Project Summary

End-to-end QA coverage for Toolshop ecommerce: user registration/login, cart management, Cash on Delivery checkout (double confirm for invoice), and API lifecycle (register → token → cart → invoice). Focus is smoke sanity checks plus regression flows for UI and API.

## Tools Used

| Category | Tools |
|----------|-------|
| Browser | Chromium (Playwright) |
| UI Automation | Playwright + TypeScript (Prism-inspired POM) |
| API Automation | Playwright `APIRequestContext` |
| AI IDE | Cursor AI |
| Version Control | Git, GitHub |
| Reporting | Playwright HTML + JSON reporters |

## Setup Summary

1. **Project/SUT context to AI:** Shared assessment PDF, SUT URLs, AC1/AC2 examples, invoice payload, and double-confirm invoice rule in focused chats.
2. **Requirement analysis:** Mapped ACs to sanity vs regression; identified COD + double-confirm as critical path risks.
3. **Test planning:** Split UI (POM + fixtures) and API (client layer); tagged `@smoke` / `@regression`; capped cases at 5–8 per tier.
4. **Manual test design:** `FunctionalTestCase.csv` — positive, negative, edge (invalid login, multi-quantity cart).
5. **Automation design:** PrismStructure folders — `pages/`, `api/`, `fixtures/`, `utils/`, `data/`, `tests/ui`, `tests/api`.
6. **Validate AI output:** Ran against live SUT; adjusted cart API payload patterns and checkout country field handling.
7. **Test data:** Unique emails via timestamp; default seed user `customer2@practicesoftwaretesting.com`; billing JSON in `data/testData.json`.
8. **Debugging:** Playwright trace on failure; API status/body inspection for cart add endpoint variants.
9. **Avoid sharing with AI:** Production credentials, internal VPN keys, personal tokens.
10. **Reuse in real projects:** Same layered structure, prompt history in `ai-prompts/`, grep-based smoke/regression runs.

## UI Coverage (Sanity / Regression)

| ID | Flow | Category |
|----|------|----------|
| TC-UI-01 | Homepage catalog | Sanity |
| TC-UI-02 | Valid login | Sanity |
| TC-UI-03 | Product detail | Sanity |
| TC-UI-04 | Registration | Regression |
| TC-UI-05 | COD purchase + invoice | Regression |
| TC-UI-06 | Invalid login | Regression |
| TC-UI-07 | Profile verification | Regression |

## API Coverage (Sanity / Regression)

| ID | Flow | Category |
|----|------|----------|
| TC-API-01 | List products | Sanity |
| TC-API-02 | Login token | Sanity |
| TC-API-03 | Create cart | Sanity |
| TC-API-04 | Register user | Regression |
| TC-API-05 | Full lifecycle + invoice | Regression |
| TC-API-06 | Invalid login | Regression |
| TC-API-07 | Product search | Regression |

## Risk Notes

- Invoice generation requires **double Confirm** on UI checkout.
- API cart add endpoint has multiple documented patterns; automation handles fallbacks.
- External SUT availability affects execution timing.
