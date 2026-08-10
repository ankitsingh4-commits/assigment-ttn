# AI Prompts – Test Design

## Entry 1 — Manual test CSV
- **Prompt:** Generate FunctionalTestCase.csv rows for login, registration, COD checkout, API register/login, API invoice — tag Sanity/Regression.
- **AI Response Summary:** Seven manual cases with traceability to automated TC IDs.
- **Validation Notes:** Added TC-MAN-05 for double-confirm COD explicitly.

## Entry 2 — UI test scenarios
- **Prompt:** Design 3 smoke + 4 regression UI tests with Playwright tags.
- **AI Response Summary:** TC-UI-01 to TC-UI-07 covering catalog, login, product detail, register, E2E purchase, negative login, profile.
- **Validation Notes:** Used stable `data-test` locators from Toolshop conventions.

## Entry 3 — API test scenarios
- **Prompt:** Design 3 smoke + 4 regression API tests for product list, auth, cart, invoice lifecycle.
- **AI Response Summary:** TC-API-01 to TC-API-07 using Playwright request fixture.
- **Validation Notes:** Removed duplicate invoice GET test to stay within count guidance.
