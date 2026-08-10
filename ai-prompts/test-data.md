# AI Prompts – Test Data

## Entry 1 — Registration payload
- **Prompt:** Generate API register payload meeting Toolshop rules (password complexity, dob, address).
- **AI Response Summary:** `registerPayload()` with `Welcome01!`, dob `1990-05-15`, US address.
- **Validation Notes:** Unique email via timestamp + random suffix to avoid collisions.

## Entry 2 — Invoice billing body
- **Prompt:** Use assessment example invoice POST body with cart_id and cash-on-delivery.
- **AI Response Summary:** `invoicePayload(cartId)` with billing fields and `payment_details: {}`.
- **Validation Notes:** Matches PDF example (`billing_country: TG`, postal `1234AA`).

## Entry 3 — UI billing address
- **Prompt:** Align UI checkout address with API billing data for traceability.
- **AI Response Summary:** Shared values in `data/testData.json` and CheckoutPage fill helper.
- **Validation Notes:** Country field handles select vs input dynamically.
