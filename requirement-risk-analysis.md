# Requirement & Risk Analysis — Practice Software Testing Toolshop

**SUT:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com/api/documentation  
**Analysis date:** 2026-08-10  
**Scope:** Customer-facing ecommerce flows (registration through invoice)

---

## Executive summary

Toolshop’s core business value is enabling a registered user to discover products, manage a cart, complete checkout, and receive an invoice. The highest-risk areas are **authentication** (gateway to all logged-in flows), **cart state consistency** (quantity and totals), **checkout with Cash on Delivery**, and **invoice generation** (requires **double confirmation** on UI). Failures in these paths directly block revenue and order traceability.

| Priority | Flows |
|----------|--------|
| P0 — Critical | Login, E2E COD checkout, invoice generation |
| P1 — High | Registration, cart quantity/totals, profile verification |
| P2 — Medium | Product browse/search, negative auth, billing validation |

---

## 1. Registration

| Field | Detail |
|-------|--------|
| **Requirement / AC** | A new user can register with valid first name, last name, email, and password and is authenticated upon success. |
| **Business risk** | Invalid or duplicate accounts pollute user base; weak validation allows unusable credentials. |
| **Failure impact** | Users cannot self-serve onboarding; support burden increases; downstream login/cart flows blocked for new users. |
| **Testing priority** | **P1 — High** |
| **Recommended coverage** | **UI:** valid registration (TC-UI-04). **API:** POST `/users/register` with full payload including dob, phone, address (TC-API-04). |
| **Classification** | **Regression** (not every build; uses unique email data) |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| Duplicate email (negative) | Confusing errors or data corruption | Manual / API |
| Weak password (negative) | Security and support issues | Manual |
| Missing required fields (negative) | Broken UX at funnel entry | Manual |

---

## 2. Authentication (Login)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | A registered user can sign in with valid email and password and access authenticated areas (profile, cart, checkout, invoices). |
| **Business risk** | Auth bypass or silent failures lock legitimate customers out or expose protected routes. |
| **Failure impact** | **Total loss of purchasable sessions** — no cart persistence, no checkout, no invoice access. |
| **Testing priority** | **P0 — Critical** |
| **Recommended coverage** | **UI:** valid login (TC-UI-02, Smoke); invalid password (TC-UI-06, Regression). **API:** POST `/users/login` returns `access_token` (TC-API-02 Smoke); wrong password returns 401 (TC-API-06 Regression). |
| **Classification** | Valid login = **Smoke**; invalid login = **Regression** |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| Empty email/password | Poor UX; possible client-side gaps | Manual |
| Unregistered email | Misleading error messages | Manual |
| Token expiry / session loss mid-checkout | Abandoned carts, duplicate orders | Manual / API |

---

## 3. Profile verification

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After login, the user can view **My profile** and see correct identity data (e.g. email, name). |
| **Business risk** | Wrong profile data erodes trust; may indicate session mix-up. |
| **Failure impact** | User cannot confirm account details; may proceed with wrong billing identity. |
| **Testing priority** | **P1 — High** |
| **Recommended coverage** | **UI:** open profile, assert email and name fields (TC-UI-07, Regression). **API:** GET `/users/me` with bearer token (optional extension). |
| **Classification** | **Regression** |

---

## 4. Product browsing and search

| Field | Detail |
|-------|--------|
| **Requirement / AC** | User can view product catalog on homepage, open product detail, and search for products by name/keyword. |
| **Business risk** | Catalog or search failures prevent product discovery — zero conversion. |
| **Failure impact** | Users cannot find items to purchase; marketing and SEO paths break. |
| **Testing priority** | **P2 — Medium** (browse) / **P1 — High** (search if primary entry) |
| **Recommended coverage** | **UI:** homepage catalog (TC-UI-01 Smoke); product detail from home (TC-UI-03 Smoke). **API:** GET `/products`, GET `/products/search?q=` (TC-API-01, TC-API-07). Search UI = Manual (TC-MAN-08/09). |
| **Classification** | Catalog load = **Smoke**; search edge cases = **Regression** (manual) |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| No search results (negative) | Confusing empty state | Manual |
| Special characters in search (edge) | XSS or broken query handling | Manual |
| Out-of-stock product display | User adds unavailable item | Manual |

---

## 5. Cart state and quantity updates

| Field | Detail |
|-------|--------|
| **Requirement / AC** | Logged-in user can add products to cart, set quantity, and see correct line items and totals before checkout. |
| **Business risk** | **Cart state inconsistency** — wrong quantity, price, or missing items — causes checkout disputes and revenue errors. |
| **Failure impact** | Incorrect charges; checkout blocked; abandoned carts; invoice mismatch. |
| **Testing priority** | **P0 — Critical** (quantity/totals); **P1** (multi-item) |
| **Recommended coverage** | **UI:** add with quantity > 1, verify cart line and proceed (TC-UI-05, Regression). **API:** POST `/carts`, add product, GET `/carts/{id}` (TC-API-03, TC-API-05). |
| **Classification** | **Regression** (full cart logic); smoke only validates catalog → PDP path |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| Quantity = 0 or empty (edge) | Invalid cart state | Manual (TC-MAN-11) |
| Multiple distinct products | Total calculation errors | Manual / future automation |
| Cart after session refresh | Lost cart / duplicate items | Manual |
| Anonymous vs authenticated cart | Wrong cart binding | API |

---

## 6. Checkout — Cash on Delivery

| Field | Detail |
|-------|--------|
| **Requirement / AC** | User completes checkout with valid billing address and selects **Cash on Delivery** (`cash-on-delivery`) as payment method. |
| **Business risk** | Checkout failure = **direct revenue loss**; invalid address data causes fulfillment failures. |
| **Failure impact** | Order not placed; customer sees error at payment step; no invoice created. |
| **Testing priority** | **P0 — Critical** |
| **Recommended coverage** | **UI:** billing form (`data-test` street, city, state, country, postal_code), payment method select, proceed steps (TC-UI-05). **API:** invoice POST with `payment_method: cash-on-delivery` and billing fields (TC-API-05). |
| **Classification** | **Regression** (full path too heavy for smoke) |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| Missing billing fields (negative) | Invalid orders slip through | Manual (TC-MAN-12) |
| Credit card path (alternate) | Payment regression if COD-only scope | Out of scope |
| Browser back during checkout (edge) | Duplicate or lost order state | Manual |

---

## 7. Duplicate confirmation (invoice trigger)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | On checkout completion, user must click **Confirm** (`[data-test="finish"]`) **twice** to successfully generate an invoice. |
| **Business risk** | **Assessment-critical edge case** — single confirm may leave order incomplete without invoice. |
| **Failure impact** | User believes order succeeded but **no invoice** appears under My Invoices; support and reconciliation gaps. |
| **Testing priority** | **P0 — Critical** |
| **Recommended coverage** | **UI:** `confirmPaymentTwice()` in automation (TC-UI-05). **Manual:** single-confirm negative (TC-MAN-10). |
| **Classification** | **Regression** (edge behavior; must be in E2E) |

---

## 8. Invoice generation and verification

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After successful COD checkout (with double confirm), user sees order success message and can view the invoice under **My Invoices** with a visible invoice number. |
| **Business risk** | Missing or incorrect invoices break order audit trail and customer proof of purchase. |
| **Failure impact** | No record of sale; customer cannot verify order; downstream reporting fails. |
| **Testing priority** | **P0 — Critical** |
| **Recommended coverage** | **UI:** assert "Thanks for your order" + `[data-test="invoice-number"]` on My Invoices (TC-UI-05). **API:** POST `/invoices` with `cart_id` and billing payload; GET `/invoices/{id}` (TC-API-05). |
| **Classification** | **Regression** |

### Additional scenarios

| Scenario | Risk if untested | Coverage |
|----------|------------------|----------|
| Invoice list empty after checkout | Silent order failure | Covered by TC-UI-05 |
| Invoice PDF download | Document delivery | Manual |
| API invoice without auth token | Security hole | API negative (manual) |

---

## Traceability matrix

| Flow | Requirement ID | Priority | Smoke | Regression | UI test | API test |
|------|----------------|----------|-------|------------|---------|----------|
| Registration | REQ-REG-01 | P1 | — | ✓ | TC-UI-04 | TC-API-04 |
| Login (valid) | REQ-AUTH-01 | P0 | ✓ | — | TC-UI-02 | TC-API-02 |
| Login (invalid) | REQ-AUTH-02 | P1 | — | ✓ | TC-UI-06 | TC-API-06 |
| Profile | REQ-PROF-01 | P1 | — | ✓ | TC-UI-07 | — |
| Catalog browse | REQ-CAT-01 | P2 | ✓ | — | TC-UI-01, 03 | TC-API-01 |
| Product search | REQ-CAT-02 | P1 | — | ✓ | Manual | TC-API-07 |
| Cart / quantity | REQ-CART-01 | P0 | — | ✓ | TC-UI-05 | TC-API-03, 05 |
| COD checkout | REQ-CHK-01 | P0 | — | ✓ | TC-UI-05 | TC-API-05 |
| Double confirm | REQ-CHK-02 | P0 | — | ✓ | TC-UI-05 | Manual |
| Invoice verify | REQ-INV-01 | P0 | — | ✓ | TC-UI-05 | TC-API-05 |

---

## Risk heat map (summary)

```
Impact →
         Low    Medium    High    Critical
Likelihood
High       —      Search    Auth-   Checkout
                    gaps     invalid  failure
Medium     —      Profile   Cart     Invoice
                    drift    qty      missing
Low        —        —      Register  —
                              dup email
```

**Top 5 risks to test first:**
1. Login failure blocks entire purchase funnel  
2. Cart quantity/total mismatch before payment  
3. COD checkout does not complete  
4. Single confirm does not generate invoice  
5. Invoice not listed after successful checkout  

---

## Recommended test execution order

1. **Smoke (3 UI + 3 API)** — SUT up, auth works, catalog reachable  
2. **Regression E2E (TC-UI-05)** — Full purchase + double confirm + invoice  
3. **Regression auth/profile/register** — TC-UI-04, 06, 07 + API counterparts  
4. **Manual negative/edge** — TC-MAN-08 through TC-MAN-12  

---

## Assumptions and dependencies

- External SUT availability (no VPN required for public Toolshop)  
- Default seed user: `customer2@practicesoftwaretesting.com` / `welcome01`  
- Registration tests require unique emails per run  
- Invoice generation behavior validated against assessment rule: **confirm twice**  
- API cart-add endpoint may accept multiple payload shapes; automation uses fallback chain  

---

## Out of scope (this analysis)

- Admin/PIM/reporting flows  
- Credit card payment path  
- OAuth social login  
- Performance/load testing  
- Security penetration testing (beyond basic negative auth)
