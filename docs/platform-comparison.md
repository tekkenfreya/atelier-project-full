# Kyrill Skincare — Platform Comparison Report

> **Date:** 2026-03-04
> **Purpose:** Evaluate Shopify vs Custom Stack for the Kyrill skincare e-commerce platform
> **Decision:** Custom Stack (Next.js + Stripe + n8n) — see [Recommendation](#recommendation)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Option A: Shopify + Apps](#option-a-shopify--apps)
3. [Option B: Custom Next.js + Stripe + n8n](#option-b-custom-nextjs--stripe--n8n)
4. [Side-by-Side Comparison](#side-by-side-comparison)
5. [Cost Projection at Scale](#cost-projection-at-scale)
6. [Recommendation](#recommendation)
7. [Proposed Business Workflow for Kyrill](#proposed-business-workflow-for-kyrill)

---

## Executive Summary

Kyrill Skincare requires a **personalized consultation quiz**, **custom subscription logic** (bi-monthly & annual at 20% discount across 6 products), and **full brand control** — three areas where Shopify's app ecosystem adds cost and friction without delivering flexibility.

A custom stack built on **Next.js + Stripe + n8n** costs less at every revenue tier, gives full ownership of the customer experience, eliminates third-party transaction fees, and avoids vendor lock-in. The tradeoff is upfront development time, which is already accounted for as the product is being built from scratch.

**Bottom line:** At $10k/mo revenue, the custom stack saves ~$200/mo compared to Shopify. At $25k/mo, the gap widens to ~$500/mo. The custom stack pays for itself from day one.

---

## Option A: Shopify + Apps

### Monthly Cost Breakdown

| Item | Cost |
|---|---|
| Shopify Basic plan | $39/mo |
| Subscription app (Recharge) | $99/mo |
| Quiz app (Octane AI or similar) | $50–150/mo |
| Custom theme / Liquid development | One-time $2,000–5,000 or ongoing theme app fees |
| Shopify transaction fee (3rd-party gateway) | 2.0% per transaction |
| Stripe/payment processing | 2.9% + $0.30 per transaction |
| Email marketing (Klaviyo) | $20–60/mo |
| **Base monthly overhead** | **~$210–350/mo + transaction fees** |

### Feature Coverage

| Feature | Built-in? | Notes |
|---|---|---|
| Product catalog | Yes | Standard Shopify functionality |
| Shopping cart & checkout | Yes | Shopify Checkout (limited customization on Basic) |
| Payment processing | Yes | Shopify Payments or 3rd-party + 2% fee |
| Subscription management | No — app required | Recharge ($99/mo) or Bold ($25/mo + per-txn fees) |
| Personalized consultation quiz | Partial — apps exist | Octane AI ($50–150/mo) handles basic quizzes; cannot do AI-driven ingredient formulation |
| Custom ingredient selection | No — heavy customization | Requires Liquid/metafield hacks or custom app |
| Automated workflows (email, retry) | Partial — app required | Klaviyo/Flow limited vs dedicated automation |
| Full brand/design control | Limited | Liquid templates, no full-stack flexibility |

### Downsides

- **Vendor lock-in:** Data, theme, and workflow all tied to Shopify's ecosystem. Migration is painful.
- **App bloat:** Core business features (quiz, subscriptions) require paid third-party apps that add latency, cost, and failure points.
- **Transaction fees stack:** Shopify's 2% fee on top of Stripe's 2.9% + $0.30 when using a third-party gateway. Shopify Payments avoids the 2% but limits gateway choice.
- **Quiz exists but doesn't fit Kyrill's model:** Shopify quiz apps (Octane AI $50–150/mo, Prehook, Typeform embeds) *do* support basic product recommendation quizzes — e.g., "answer 5 questions, get recommended one of 3 products." That works for simple stores. However, Kyrill's quiz needs to drive **personalized formulation with AI-driven ingredient selection**, which these apps cannot do:
  - No structured AI output — cannot call a model at `temperature: 0` to generate custom ingredient combinations per customer.
  - No dynamic ingredient mapping — apps only map answers to pre-set product recommendations, not custom formulas.
  - Limited branching depth — Prose-level quizzes (25+ questions, 80+ interdependent factors like climate + diet + stress) exceed what conditional quiz apps support.
  - No persistent data integration — quiz results need to tie to customer profiles and inform future formula refinements across subscription cycles. App data lives in isolated silos.
  - **Workaround:** You could build a custom Shopify app (App Bridge + Remix) with a fully custom quiz, but then you're doing custom development *inside* Shopify's constraints — paying Shopify fees for the privilege of building it yourself anyway.
- **Checkout customization locked:** Shopify Checkout is only fully customizable on Shopify Plus ($2,300/mo). Basic/Standard plans have minimal checkout control.
- **Subscription flexibility:** Recharge/Bold handle standard subscribe-and-save, but custom logic (20% across exactly 6 products, bi-monthly + annual plans) requires workarounds or custom app development within Shopify's constraints.

### Estimated Monthly Cost by Revenue Tier

| Revenue | Shopify + Apps | Transaction Fees (4.9% + $0.30) | Total |
|---|---|---|---|
| $5,000/mo (~70 orders) | ~$250 | ~$266 | **~$516** |
| $10,000/mo (~140 orders) | ~$250 | ~$532 | **~$782** |
| $25,000/mo (~350 orders) | ~$300 | ~$1,330 | **~$1,630** |

*Transaction fee calculation: 2.9% Stripe + 2.0% Shopify 3rd-party fee = 4.9% + $0.30/txn. Average order ~$72 (half routine ~$145, half single product ~$40).*

---

## Option B: Custom Next.js + Stripe + n8n

### Monthly Cost Breakdown

| Item | Cost |
|---|---|
| VPS hosting (Hetzner CX21 or similar) | $5–20/mo |
| Domain + DNS (Cloudflare) | ~$1/mo (domain ~$12/yr) |
| Stripe payment processing | 2.9% + $0.30 per transaction |
| Stripe Billing (subscriptions) | +0.7% per recurring transaction |
| n8n (self-hosted on same VPS or cloud) | $0 self-hosted / $20–50 cloud |
| Transactional email (Resend, Postmark) | $0–20/mo (free tier covers early volume) |
| Vercel (if using for Next.js hosting) | $0–20/mo (free tier or Pro) |
| **Base monthly overhead** | **~$6–110/mo + transaction fees** |

### Feature Coverage

| Feature | Coverage | Notes |
|---|---|---|
| Product catalog | Custom-built | Full control over data model and display |
| Shopping cart & checkout | Custom + Stripe Checkout | Stripe handles PCI compliance, we control the UX |
| Payment processing | Stripe | 2.9% + $0.30 — no additional platform fees |
| Subscription management | Stripe Billing | Native recurring billing, pause/cancel/skip via API |
| Personalized consultation quiz | Custom-built | Full control: branching logic, structured AI output, dynamic ingredient mapping |
| Custom ingredient selection | Custom-built | Direct database integration, no workarounds |
| Automated workflows | n8n | Abandoned cart, dunning, reminders, fulfillment — all custom |
| Full brand/design control | Complete | React components, Tailwind, no template constraints |

### Downsides

- **Upfront development time:** Building cart, checkout flow, quiz, and subscription management from scratch requires significant initial effort (already in progress).
- **Self-managed infrastructure:** Server maintenance, deployments, backups, and monitoring are your responsibility (mitigated by managed services like Vercel + managed DB).
- **No app marketplace:** Every integration (shipping, taxes, analytics) must be built or connected via API — but this also means no app bloat.
- **Security responsibility:** Must handle auth, input validation, and rate limiting correctly (Stripe handles payment security/PCI).

### Estimated Monthly Cost by Revenue Tier

| Revenue | Platform Costs | Transaction Fees (2.9% + $0.30) | Sub Fee (+0.7%) | Total |
|---|---|---|---|---|
| $5,000/mo (~70 orders) | ~$30 | ~$166 | ~$18* | **~$214** |
| $10,000/mo (~140 orders) | ~$50 | ~$332 | ~$35* | **~$417** |
| $25,000/mo (~350 orders) | ~$80 | ~$830 | ~$88* | **~$998** |

*Subscription fee estimated at ~50% of revenue being recurring (subscriptions). Stripe Billing adds 0.7% only on recurring charges.*

---

## Side-by-Side Comparison

| Criteria | Shopify + Apps | Custom Stack |
|---|---|---|
| **Monthly base cost** | $210–350 | $6–110 |
| **Transaction fees** | 4.9% + $0.30 | 2.9% + $0.30 (+0.7% subs) |
| **Quiz customization** | Limited (app-based) | Unlimited (custom-built) |
| **Subscription flexibility** | App-dependent, workarounds needed | Full control via Stripe Billing API |
| **Checkout customization** | Locked (Plus required for full) | Complete control |
| **Design freedom** | Liquid templates | React + Tailwind (unlimited) |
| **Vendor lock-in** | High | None |
| **Time to launch** | Faster (weeks) | Slower (months) — already in progress |
| **Scalability** | Shopify handles infra | Self-managed (Vercel/serverless scales easily) |
| **Data ownership** | Shopify owns the platform | Full ownership |
| **SEO control** | Moderate | Full |
| **Automation** | Limited (Flow + apps) | Full (n8n — unlimited workflows) |
| **Ongoing maintenance** | Low (Shopify manages) | Moderate (self-managed) |

---

## Cost Projection at Scale

### Monthly cost comparison at three revenue tiers:

| Monthly Revenue | Shopify + Apps | Custom Stack | Savings with Custom |
|---|---|---|---|
| **$5,000** | ~$516 | ~$214 | **$302/mo ($3,624/yr)** |
| **$10,000** | ~$782 | ~$417 | **$365/mo ($4,380/yr)** |
| **$25,000** | ~$1,630 | ~$998 | **$632/mo ($7,584/yr)** |

### Key observations:

- The custom stack is **cheaper at every revenue tier** — the gap grows with scale.
- Shopify's 2% third-party gateway fee alone costs $100/mo at $5k revenue, $500/mo at $25k. This fee disappears entirely with custom.
- Shopify Payments eliminates the 2% fee but locks you into Shopify's payment processing and limits international gateway options.
- At $25k/mo revenue, the annual savings (~$7,500) covers significant development investment.

---

## Recommendation

### Go custom: Next.js + Stripe + n8n

**Why:**

1. **Cost efficiency** — Lower at every revenue level, with savings that compound as the business grows. No app subscription fees eating into margins.

2. **Quiz is the product** — Kyrill's consultation quiz is the core differentiator (inspired by Prose's 25+ question model). A third-party quiz app cannot deliver the depth, branching logic, and structured AI output needed for personalized ingredient selection. This must be custom-built regardless of platform.

3. **Subscription flexibility** — The 20% discount across 6 products on bi-monthly/annual plans is non-standard. Stripe Billing handles this natively via API. Shopify subscription apps would require workarounds and compromise the UX.

4. **Full ownership** — No vendor lock-in, no platform risk, no surprise fee changes. The codebase, data, and customer relationships belong entirely to Kyrill.

5. **Brand experience** — Custom checkout flow, no "Powered by Shopify" footprint, pixel-perfect design control from landing page to order confirmation.

6. **Already in progress** — Development has started on the custom stack. Switching to Shopify now would mean abandoning work and accepting permanent limitations.

**When Shopify would make sense (but doesn't here):**
- If there were no quiz / personalization requirement
- If subscriptions were simple subscribe-and-save on a single product
- If speed-to-market were the only priority and the founder had no technical capability
- If budget for ongoing development were zero

None of these apply to Kyrill.

---

## Proposed Business Workflow for Kyrill

*Adapted from the Prose.com direct-to-consumer model.*

### Customer Journey

```
Landing Page
    │
    ▼
Consultation Quiz
(skin type, concerns, lifestyle, environment, goals)
    │
    ▼
Personalized Formula Recommendation
(AI-driven ingredient selection, temperature: 0)
    │
    ▼
Product Selection
(Cleanser, Serum, Moisturizer — individual or full routine)
    │
    ▼
Cart + Subscription Option
(one-time purchase OR bi-monthly/annual plan at 20% off for 6 products)
    │
    ▼
Stripe Checkout
(secure payment, subscription billing setup)
    │
    ▼
Order Confirmation
(email with order details, expected delivery, routine instructions)
```

### Subscription Flow

```
Choose Plan
(bi-monthly or annual)
    │
    ▼
20% Discount Applied
(across all 6 products in the routine)
    │
    ▼
Stripe Billing
(manages recurring charges on schedule)
    │
    ▼
n8n Automation
├── Renewal reminder (7 days before charge)
├── Failed payment retry (3 attempts over 7 days)
├── Skip/pause/cancel self-service
└── Plan modification (swap products, adjust frequency)
    │
    ▼
Next Cycle
(repeat with option to refine formula)
```

### Post-Purchase Experience

```
Order Confirmed
    │
    ▼
Shipping Notification
(tracking link via email)
    │
    ▼
Delivery
    │
    ▼
Review & Refine
(feedback quiz to adjust formula for next order)
    │
    ▼
Review Request
(14 days post-delivery)
    │
    ▼
Next Subscription Cycle
(refined formula ships automatically)
```

### n8n Automation Workflows

| Workflow | Trigger | Action |
|---|---|---|
| **Abandoned cart recovery** | Cart created, no checkout after 1hr | Email reminder with cart contents |
| **Subscription renewal reminder** | 7 days before next charge | Email with order summary, option to modify |
| **Failed payment dunning** | Stripe payment_intent.payment_failed | Retry 3x over 7 days, then pause + notify |
| **Order fulfillment notification** | Order status → shipped | Email with tracking link |
| **Review request** | 14 days post-delivery | Email requesting product review |
| **Formula refinement trigger** | 3+ orders completed | Email inviting re-quiz for formula optimization |
| **Win-back campaign** | No order in 90 days (non-subscriber) | Email with incentive to return |
| **Subscription churn prevention** | Cancel request initiated | Offer pause/skip before confirming cancel |

### Prose.com Reference Data (Pricing & Model Inspiration)

| Metric | Prose | Kyrill (Target) |
|---|---|---|
| Products | Cleanser, Serum, Moisturizer + more | Cleanser ($29), Serum ($64), Moisturizer ($52) |
| Full routine price | ~$145 | ~$145 (matched) |
| Subscription discount | 50% first order + 15% recurring | 20% on 6-product plan |
| Quiz depth | 25+ questions, 80+ factors | Comprehensive (skin type, diet, climate, stress, goals) |
| Production model | Made-to-order, 7–12 day shipping | To be determined |
| Revenue (2024) | $165M | — |
| Retention | 80% revenue from existing customers | Target: subscription-first model |

---

*This report is final. Tech stack decision: Custom (Next.js + Stripe + n8n).*
