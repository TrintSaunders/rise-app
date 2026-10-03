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

## Decided (Hayden, 2026-10-03)

1. **Hosting:** Cloudflare Pages, from the `website/` folder.
2. **Titles:** discreet on the home page ("Rise: grace for the fight for
   purity"); plain search wording inside future articles.
3. **Analytics:** Cloudflare Web Analytics only (cookieless), switched on
   in the Pages project; no code on the site.
4. **Founders:** Trint and Hayden by name, with a photo and the story in
   their own words. The section is built and hidden until both arrive.
5. **Phase 3:** not yet decided; recommended to start with the allies
   page soon after launch.

## Design direction: Opal's playbook, Rise's soul (2026-10-03, Hayden)

Hayden asked for the site reimagined after Opal's (opal.so). Taken from
Opal: a dark, cinematic, scroll-paced page; a two-line headline over a
night sky; a bold statement that lights up as you read; one feature per
"chapter" with a large phone; a drifting gallery (their gems, our verses);
a counter (their hours saved, our honest zeros); FAQ; a closing call.
Not taken: their brand, art, or claims. No invented testimonials, ratings,
or user counts; add real ones only once they exist.

The site is now Night Watch only (deep indigo, gold accent), matching the
app at the hour it matters most. Motion respects Reduce Motion, and with
JavaScript off every section is simply visible.

Home sections, in order: hero ("Fall seven times. Rise again."),
statement, six chapters (SOS, Allies, the dawn arc, Rise Again, Patterns,
the Armory), drifting verses, privacy zeros, who makes Rise, FAQ, finale
("The sun rose again. So will you.").

## Review, 2026-10-03

Lighthouse (mobile), every page: Performance 98–100, Accessibility 100,
Best Practices 100, SEO 100. Home LCP 3.3s → 2.3s, layout shift 0.

- **Fonts are self-hosted** (`website/fonts/`, SIL Open Font License).
  Loading them from Google sent every visitor's IP to Google, which broke
  the "no trackers" promise, and blocked rendering for about 2 seconds.
- Screenshots served at 600px with the 880px versions for sharp screens
  (`srcset`); a 64px icon for header and footer.
- Footer text contrast raised; jump links clear the sticky header;
  complete title, description, and link-preview tags on every page;
  structured data for the app on the home page; decorative verse
  marquees have a screen-reader version; cache rules for fonts, CSS, and
  `stats.json` in `_headers`.
- Hayden's asks: the "Scroll" cue is gone, and the three privacy cards
  became **one journey count**: "[number] people have started their
  journey with Rise", a real count of App Store first-time downloads set
  in `website/stats.json` (TODO "Keep the website's number current").
  Until there's a number it reads "Day 1: The first people start their
  journey at launch." The page reads the file on every visit; the number
  itself is updated by hand monthly for now.
- **To make it update itself (optional, later):** a nightly GitHub Action
  using the App Store Connect API key Trint already has (stored as a repo
  secret) reads the Analytics Reports API and rewrites `stats.json`.
  Apple's reports lag about a day, so "live" means daily. Aggregate
  numbers from Apple only; the app still tracks no one.

## Built so far (phase 1)

Preview it locally with `npm run preview:site` (http://localhost:8081).

`website/`: home, support (with backup steps and the 988 crisis line),
privacy (with backups and the website's analytics), plain-language terms
(draft: have the attorney review it with the LLC), a 404 page,
`robots.txt`, `sitemap.xml`, security and caching headers (`_headers`),
and a link-preview image (`img/og.png`, uses the current icon; regenerate
when the icon is chosen). `docs/index.html` and the Markdown pages keep
serving the GitHub Pages address until the switch; after it, `website/` is
the only source.

## Still to come

- Founders' story and photo (both of you; then remove `hidden` on the
  founders section and save the photo as `website/img/founders.jpg`).
- Phase 2 when the app is approved and Stripe exists: App Store badge,
  `/give`, `/press`, universal links.
