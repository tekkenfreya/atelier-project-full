# VAT, Tax & Shipping Guide
**Atelier Rusalka — E-Commerce**

---

## VAT in Europe — How It Works

### The Challenge
Selling skincare online across Europe means dealing with different VAT rates per country.

### EU VAT Rates (Cosmetics / General)

| Country | VAT Rate |
|---|---|
| Bulgaria | 20% |
| Romania | 19% |
| Germany | 19% |
| France | 20% |
| Netherlands | 21% |
| Belgium | 21% |
| Austria | 20% |
| Italy | 22% |
| Spain | 21% |
| Sweden | 25% |
| Poland | 23% |
| UK | 20% (separate from EU post-Brexit) |

### Two Thresholds

**Below €10,000/year in cross-border EU sales:**
- Charge your home country's VAT rate on ALL EU sales
- File VAT returns only in your home country
- Simple and low admin

**Above €10,000/year in cross-border EU sales:**
- Required to charge the customer's LOCAL VAT rate
- Two options: register in every country individually OR use OSS

### OSS (One-Stop-Shop) — Recommended

The EU One-Stop-Shop simplifies cross-border VAT:

- Register once through your home country's tax authority
- File one quarterly return covering all 27 EU countries
- Your home country distributes payments to the other countries
- No need for 27 separate VAT registrations

**How to register:**
1. Go to your home country's tax authority website
2. Apply for the OSS scheme (free)
3. Start charging customer-country VAT rates
4. File quarterly returns through the OSS portal

### UK (Post-Brexit)

- UK is no longer part of the EU VAT system
- If selling to UK customers: register for UK VAT separately (threshold: £85,000/year for domestic, but different for international sellers)
- Alternatively: use a UK fiscal representative or marketplace facilitator

---

## How Stripe Handles Tax

### What Stripe Tax Does
- Automatically calculates the correct VAT rate based on customer location
- Adds tax to the checkout total
- Provides detailed tax reports per country for filing
- Handles reverse charge rules for B2B transactions
- Cost: 0.5% per transaction

### What Stripe Tax Does NOT Do
- Does not register your business for VAT
- Does not file your VAT returns
- Does not pay the tax authorities on your behalf
- You still need an accountant for compliance

### How to Enable (When Ready)
1. Stripe Dashboard → Settings → Tax
2. Enter your business address and tax registration number
3. Add tax registrations for countries where you're registered
4. Turn on automatic tax calculation
5. The checkout will automatically add the correct VAT

### Tax Reports
Stripe generates downloadable reports showing:
- Total tax collected per country
- Number of transactions per country
- Tax rates applied
- Ready for OSS quarterly filing

---

## Shipping Options

### Common Models for Skincare

**Option A: Flat Rate**
- One price everywhere (e.g., €5.00 for all EU orders)
- Simple to manage
- Customers know the cost upfront

**Option B: Free Above Threshold**
- Free shipping above a certain order value (e.g., free over €50)
- Below threshold: flat rate (e.g., €5.00)
- Encourages larger orders — good for the 3-product bundle

**Option C: Zone-Based**
- Domestic: €3.00
- EU: €5.00-€8.00
- UK: €8.00-€12.00
- International: €12.00-€15.00

**Option D: Free Shipping Always**
- Built into product pricing
- Best customer experience
- Simplest checkout flow

### Stripe Shipping Integration
- Create shipping rates in Stripe Dashboard → Products → Shipping rates
- Attach to checkout sessions
- Stripe collects shipping address and adds shipping cost
- Supports free shipping, flat rate, and tiered rates

---

## Recommended Approach for Atelier Rusalka

### Phase 1 (Now — Testing)
- No tax calculation (test mode)
- No shipping rates
- Focus on product/quiz flow

### Phase 2 (Pre-Launch)
- Register for OSS through home country
- Enable Stripe Tax
- Set up flat-rate shipping or free shipping for 3-product bundles
- Get an accountant familiar with EU e-commerce VAT

### Phase 3 (Post-Launch)
- Monitor sales per country
- Optimize shipping rates based on actual costs
- Consider UK VAT registration if UK sales are significant
- File quarterly OSS returns using Stripe reports

---

## Key Decisions for Kyrill

| Decision | Options | Impact |
|---|---|---|
| Business registration country | Bulgaria / Romania / Netherlands | Determines home VAT rate and OSS filing country |
| Shipping model | Flat rate / Free over €50 / Free always | Affects pricing and conversion |
| When to enable Stripe Tax | Before first real sale | Legal requirement for cross-border EU |
| UK sales | Register UK VAT / Don't sell to UK initially | Complexity vs market size |
| Accountant | Find one experienced in EU e-commerce | Required for OSS filing |

---

## Costs Summary

| Item | Cost |
|---|---|
| Stripe processing fee | 1.5% + €0.25 per EU card transaction |
| Stripe Tax | 0.5% per transaction (when enabled) |
| OSS registration | Free |
| UK VAT registration | Free (but adds admin) |
| Accountant (quarterly filing) | Varies (~€200-500/quarter estimate) |

---

*Document for internal planning — not legal or tax advice. Consult a qualified accountant for specific obligations.*
