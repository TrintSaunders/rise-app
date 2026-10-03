# Website plan: riseagainapp.com

Owner: Hayden (with Claude). Status: direction set, decisions open (end
of this file). Tasks live in TODO.md (🅗1, 🅗2, 🤖).

## What the site is for

1. **What Apple requires:** working Support, Privacy, and (soon) Terms
   pages at stable addresses. The app links to them too ("you &
   settings" → help & support).
2. **Turn a visitor into a download:** one clear message and one button.
3. **Giving:** a calm page for people who want to help keep Rise free.
4. **Later, be findable:** helpful pages men find when they search at 1am,
   and pages allies and pastors can share.
5. **Later, the web app** at app.riseagainapp.com.

## Who comes, and what they need

| Visitor | Arrives from | Needs |
|---|---|---|
| A man who's struggling | search, a friend, social | to feel understood fast, trust that it's private, the App Store button |
| An ally (friend, mentor, pastor) | a man sharing Rise, a church | what Rise does, what the "I'm tempted" text means and how to answer it |
| Apple's reviewer, press | App Store Connect, email | support, privacy, terms, a press kit |
| Someone who wants to give | the app, social | why it's free, where money goes, the giving button |

## Direction (recommended)

**Hosting: Cloudflare Pages.** The domain and the support@/hello@ email
routing are already on Cloudflare, so the site lives next to its DNS:
free, fast, HTTPS automatic, a preview link for every change, and room
for a second project (the web app) on app.riseagainapp.com. GitHub Pages
keeps serving the current pages until the switch; after it, Trint can turn
GitHub Pages off.

**Code: a `website/` folder in the repo, plain HTML and CSS.** No
framework, no build step, nothing to break. Only public pages go in it
(the internal docs stay out of the site). Move to Astro later if the
articles section grows past a handful of pages; it deploys the same way.

**Design: the app, on the web.** Cream by day and Night Watch indigo by
night (follows the visitor's light or dark setting), Fraunces and Inter,
gold as the one accent, the real screenshots. Calm, one call to action
per page. The current page (`docs/index.html`) is the starting point.

**Voice:** the app's. A warm older friend, no shame, no em dashes,
Scripture with its reference.

**Privacy:** the site keeps the app's promise. No cookies, no trackers,
no ad pixels. If we measure anything, Cloudflare Web Analytics only
(cookieless, counts visits without identifying anyone).

## Pages, in phases

**Phase 1: before or at launch (Claude builds in about a day once the
decisions below are made)**
- `/` home: hero, three phone screens, what it does, private by design,
  the App Store button (shows "coming soon" until it's live).
- `/support`: questions and answers, support@riseagainapp.com.
- `/privacy`: the existing policy as a real page.
- `/terms`: plain-language Terms of Use (not therapy or medical care,
  limits of liability, Apple's license applies to the app).
- `404` page that points home.
- Basics: page titles and descriptions, a link-preview image for when
  someone shares the site, `sitemap.xml`, `robots.txt`.

**Phase 2: launch week**
- The real App Store badge and link once Apple approves.
- `/give`: the Stripe link (TODO 🅗4), "not tax-deductible".
- `/press`: icon, screenshots, a one-paragraph description, the founders,
  hello@riseagainapp.com.
- **Universal links:** an `apple-app-site-association` file on the domain
  so shared memory-folder links (`riseagainapp.com/f/...`) open Rise
  directly instead of going through the paste step. Needs a matching
  setting in the app's next build.

**Phase 3: the first months**
- `/allies`: how to be an ally. What the text means, how to answer at
  midnight, what not to say. Short, kind, shareable. Nothing else like it
  exists, and every ally a man adds is a visitor.
- `/churches`: for pastors and men's ministry leaders: what Rise is, why
  it's private, how to recommend it.
- `/articles`: a few careful, pastoral pieces that answer what men search
  for ("what to do right after you fall", "why honesty beats streaks",
  "how to tell a friend"). Written slowly, reviewed by both of you.

**Phase 4: later**
- app.riseagainapp.com: the Expo web build as a second Cloudflare Pages
  project. On the web it can't text allies or send reminders, so it's for
  trying Rise out, with a nudge to get the phone app.

## Related setup

- **Replying from support@:** Cloudflare Email Routing only receives. To
  reply as support@riseagainapp.com, add it as a "Send mail as" address
  in Gmail using an SMTP sender (Zoho Mail's free plan or a transactional
  service). Optional; replying from a personal address works meanwhile.
- **Apple:** after the switch, Trint updates the Support, Marketing, and
  Privacy URLs in App Store Connect (TODO 🅣3), and the AI updates
  `lib/links.ts` and STORE_LISTING.md.

## Decisions for Hayden (open)

1. **Hosting:** Cloudflare Pages (recommended) or stay on GitHub Pages?
2. **How public to be in page titles:** findable ("help to quit porn,
   Christian") or discreet ("Rise: grace for the fight for purity")?
   Browser history and shared links show the title. Recommend: discreet
   titles on the home page, findable wording inside the articles.
3. **Analytics:** none, or Cloudflare's cookieless counts? Recommend
   cookieless counts, so you know if launch worked.
4. **The founders:** names and a photo on the home and press pages, or
   just "made by two friends who've been in this fight"? And the "why we
   made Rise" story in your own words (shared with the app's welcome
   pages, UPDATES.md #1).
5. **Phase 3:** start the allies guide and church page soon after launch?
   Recommend yes, allies page first.
