# AI Prompts – Requirements and Planning

## Entry 1 — Extract assessment deliverables
- **Prompt:** Read QA Practical Assessment PDF. Extract mandatory deliverables, acceptance criteria, test-count limits, tools, submission structure. Do not code yet.
- **AI Response Summary:** Structured 6 sections; flagged ambiguous test-count rule and generic Core AC vs ecommerce SUT mismatch.
- **Validation Notes:** Cross-checked PDF text; noted `test-data.md` required though omitted in one structure diagram.

## Entry 2 — SUT flow mapping
- **Prompt:** Map AC1/AC2 UI and API flows for practicesoftwaretesting.com; tag sanity vs regression.
- **AI Response Summary:** UI: register/login/profile + COD checkout with double confirm. API: register → token → cart → invoice with sample billing payload.
- **Validation Notes:** Confirmed double-confirm rule and `cash-on-delivery` payment method from assessment doc.

## Entry 3 — Framework scaffold
- **Prompt:** Scaffold PrismStructure Playwright project with POM, API clients, @smoke/@regression tags, max 7 cases per tier.
- **AI Response Summary:** Created folder layout, page objects using `data-test` selectors, API layer with Auth/Cart/Product/Invoice.
- **Validation Notes:** Kept assertions in specs; capped manual/UI/API counts within 5–8 guidance.
