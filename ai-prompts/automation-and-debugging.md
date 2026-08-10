# AI Prompts – Automation and Debugging

## Entry 1 — Cart API add item
- **Prompt:** Implement cart add for Toolshop API after create cart returns id.
- **AI Response Summary:** Fallback chain: POST `/carts/{id}` with `product_id`, then POST `/carts`, then `{id}` key variant.
- **Debugging Outcome:** Handles documented API inconsistency across practice guides; reduces 404/405 failures.

## Entry 2 — Double confirm checkout
- **Prompt:** UI invoice requires pressing Confirm twice — implement in CheckoutPage.
- **AI Response Summary:** `confirmPaymentTwice()` clicks `[data-test="finish"]` twice after COD selection.
- **Debugging Outcome:** Matches assessment special instruction for invoice generation.

## Entry 3 — Login smoke assertion
- **Prompt:** customer2 user may not display "Jane Doe" — fix flaky assertion.
- **AI Response Summary:** Assert `nav-profile` visible instead of hardcoded display name.
- **Debugging Outcome:** Removed brittle text match for seeded users.
