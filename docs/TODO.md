# To do: Trint and Hayden

The shared checklist for getting Rise launched as a real company. Check a
box when it's done and push, so the other person (and both AIs) can see.
Bigger plans live in UPDATES.md; the day-to-day log is PROGRESS.md.

**Owners:** 🤝 together · 🅣 Trint · 🅗 Hayden · 🤖 an AI with the repo
(ask it, it does the work, you review).

Start with the LLC (it unlocks Stripe, the Apple company account, and the
bank). Everything else can run in parallel.

---

## 🤝 Together (sit down for this one)

### 1. Form the LLC

*About 2 hours together, plus a few days of waiting on the state. Before
anything that takes money (Stripe, the Apple company account).*

- [ ] **Decide the basics first** (30 minutes, talk it through):
  - Name, for example "Rise Again Apps LLC". The App Store can still say
    Rise-Again.
  - State: usually the state you live in. If you live in different
    states, ask the attorney which one; Delaware and Wyoming add fees and
    paperwork for a company like this.
  - Ownership split (for example 50/50) and **vesting**: shares are earned
    over time (often 4 years, with a 1-year "cliff"), so if someone leaves
    early they don't keep half.
  - Who decides what, how you break a tie, and what happens if one of you
    leaves.
- [ ] **Check the name is free:** search your state's Secretary of State
  business database, and do a quick search at tmsearch.uspto.gov.
- [ ] **File the Articles of Organization** online with the state (fees vary
  by state, roughly $50–$300). You'll need a **registered agent**: one of
  you at a home address (it becomes public record) or a registered-agent
  service (about $100 a year) to keep home addresses private.
- [ ] **Sign an operating agreement.** Must include: the ownership split
  and vesting, both of you **assigning the app, code, designs, name, and
  domain to the LLC**, decision rules, and a buyout clause. Best: a
  small-business attorney (often $500–$1,500). Fine to start from a
  template and have an attorney review it.
- [ ] **Get the EIN** (the company's tax ID): irs.gov → "Apply for an EIN
  online". Free, about 10 minutes. Save the confirmation letter (PDF).
- [ ] **Open a business bank account** (both of you go, with IDs, the
  articles, the EIN letter, and the operating agreement).
- [ ] **Calendar the yearly state report** so the LLC stays in good
  standing.
- [ ] Note: the federal "BOI" report has not been required for US
  companies since March 2025. Double-check that on fincen.gov when you file.

**Done when:** you have the state approval, a signed operating agreement,
the EIN letter, and a bank account. Then tasks 🅣5, 🅣6, and 🅗4 can start.

---

### 2. Founders' story and photo for the website
*Can be done apart, but agree on it together.*
- [ ] Write 3 to 5 sentences in your own words: who you are, why this
  fight matters to you, why mercy and not shame. The same words open the
  app's welcome pages later (UPDATES.md #1).
- [ ] One photo of the two of you, at least 1200px wide, natural light.
- [ ] Send both to Claude: it adds them to the site and turns the section
  on.

---

### 3. Keep the website's journey count current (after launch, 5 minutes a month)
*Either of you. The site shows "Day 1" until there's a real number. Can be
automated later (WEBSITE.md, review notes).*
- [ ] App Store Connect → Rise-Again → **Analytics** → Acquisition →
  total **first-time downloads** (all time).
- [ ] Edit `website/stats.json`: set `"menRising"` to that number (no
  quotes) and `"updated"` to today, like `"2026-11-01"`. Commit and push;
  Cloudflare publishes it in about a minute.
- [ ] Never estimate or round up. It's a promise of honesty, like the app.

---

## 🅣 Trint

### 1. Store build 10 and submit for review
- [ ] Follow "Next for Trint" at the top of PROGRESS.md (new build, never
  an over-the-air update to build 9; TestFlight pass; listing; submit).

### 2. Let Cloudflare publish the website from GitHub (5 minutes)
*Needed for 🅗2. Only the repo's owner can approve this.*
- [ ] When Hayden starts the Cloudflare Pages setup, GitHub will ask the
  repo owner to approve the Cloudflare app. Approve it **for the
  rise-app repository only**.
- [ ] While in GitHub: Settings → Collaborators → give Hayden **Admin**
  (it failed through the API; the website shows the real reason).

### 3. Point App Store Connect at the new website
*After 🅗2 is live.*
- [ ] App Store Connect → Rise-Again → App Information: Privacy Policy URL
  `https://riseagainapp.com/privacy`.
- [ ] Version page: Support URL `https://riseagainapp.com/support`,
  Marketing URL `https://riseagainapp.com`.

### 4. Request the Family Controls entitlement
- [ ] developer.apple.com → Account → Request entitlement → Family
  Controls (distribution). Needed for 1.1's guardrails; it can take weeks.

### 5. Move the Apple account to the LLC
*After the LLC.*
- [ ] Get a free **D-U-N-S number** for the LLC (Apple links to the
  lookup and request form at developer.apple.com/support/D-U-N-S). Can
  take up to about 2 weeks.
- [ ] Contact Apple Developer Support to convert the individual
  membership to an organization (or transfer the app to a new
  organization account). The store will then show the LLC as the seller.
- [ ] Add Hayden to the Apple team (App Manager or Admin).

### 6. Bible licensing check before anything paid
- [ ] Email Crossway (ESV permissions) and The Lockman Foundation (NASB)
  describing Rise: free app, verse quotations with notices, a future
  optional tip jar and paid tier. Ask whether that needs a license.
  Forward the replies to the repo (summarize in PROGRESS.md).

### 7. Move the repo to a company GitHub organization
*After the LLC and after the website is on the domain.*
- [ ] Create a free GitHub organization (for example `riseagainapp`),
  make both of you owners, and transfer `rise-app` into it. Fixes the
  admin problem for good. Tell the AI afterward so it updates links.

---

## 🅗 Hayden

### 1. Website decisions (with Claude)
- [ ] Answer the open questions in WEBSITE.md (pages, voice, the "why we
  made Rise" story). Claude then builds the pages.

### 2. Put the website on riseagainapp.com (about 20 minutes)
*Your domain is already on Cloudflare (your emails route through it).
Needs 🅣2. Claude must have built the `website/` folder first.*
- [ ] Cloudflare dashboard → **Workers & Pages** → Create → **Pages** →
  Connect to Git → pick `TrintSaunders/rise-app` (Trint approves, 🅣2).
- [ ] Settings: project name `rise-site`, production branch `main`,
  framework preset **None**, build command empty, **output directory
  `website`**. Deploy.
- [ ] Project → **Custom domains** → add `riseagainapp.com`, then
  `www.riseagainapp.com`. Cloudflare adds the DNS records itself.
  **Don't touch the MX records** (they carry support@ and hello@).
- [ ] Project → **Metrics** (or Analytics) → turn on **Web Analytics**.
  It's cookieless and counts visits without identifying anyone.
- [ ] Open https://riseagainapp.com/support and /privacy to check, then
  tell Claude ("the site is live") so it switches the app's links and
  asks Trint for 🅣3.

### 3. Claim the social media handles (about 45 minutes)
- [ ] Check `@riseagainapp` everywhere at once (instantusername.com).
  Backups if taken: `@riseagain.app`, `@riseagainhq`.
- [ ] Create, in this order: **Instagram** (switch to a Creator or
  Business account), **TikTok**, **YouTube**, **X**, **Facebook Page**,
  **Threads** (from Instagram). Use **hello@riseagainapp.com** for every
  signup.
- [ ] Turn on two-factor with an authenticator app on each.
- [ ] Save every login in a **shared password manager** (Bitwarden's free
  two-person organization, or 1Password) so Trint has access too.
- [ ] Profile: the app icon, the name "Rise", the link
  `https://riseagainapp.com`, and this bio (edit freely):
  *Grace for the fight for purity. Mercy, not shame. Free app, coming
  soon. Proverbs 24:16*
- [ ] Don't post yet; the design agent (🅗5) makes the first posts.

### 4. Set up Stripe for the website's giving page
*After the LLC (needs the EIN and the bank account).*
- [ ] stripe.com → sign up with hello@riseagainapp.com → business type
  **LLC**, the EIN, the business bank account.
- [ ] Settings → Branding: the icon and gold `#E9B44C`. Statement
  descriptor: `RISE AGAIN`.
- [ ] **Payment Links** → New → product "Support Rise" → **let customers
  choose what to pay** (suggest $10) → confirmation message: "Thank you.
  Gifts to Rise aren't tax-deductible; they keep it free for the next man."
- [ ] Copy the link and give it to Claude for the website's giving page.
- [ ] Not in the app: Apple's rules don't allow it there (see UPDATES.md
  #2). The app's tip jar comes later through Apple.

### 5. Set up the graphic design agent (with Claude)
- [ ] Ask Claude: "build the social design kit from TODO.md". It builds:
  - `brand/BRAND.md`: colors, fonts, voice, what to post and never post.
  - Post templates (square and portrait) rendered as images, in the same
    look as the app and the App Store screenshots.
  - A reusable Claude skill in the repo, so any session can be asked
    "make next week's posts" and drop images plus captions into
    `social/drafts/` for you to review.
- [ ] Review the first batch, pick a posting tool (Meta Business Suite is
  free for Instagram and Facebook; TikTok posts from its own app).
- [ ] Rule: **a human approves every post**. Nothing posts automatically.

---

## 🤖 For an AI with the repo (ask it when you're ready)

- [x] **Build `website/`** phase 1: home, support, privacy, terms, 404,
  sitemap, link preview (2026-10-03).
- [ ] **Switch the app's links** to riseagainapp.com (`lib/links.ts`)
  after 🅗2, and update STORE_LISTING.md's URLs.
- [ ] **Social design kit** (🅗5).
- [x] **Terms of Use page** drafted at `website/terms.html` (attorney to
  review with the LLC). Still to link from "you & settings".
- [ ] **Giving page** with the Stripe link (🅗4), marked "not
  tax-deductible".
- [x] 988 crisis line on the support and terms pages.
- [ ] **Decision pending:** also add a quiet 988 line inside the app (SOS
  help page and "you & settings")? Recommended.
