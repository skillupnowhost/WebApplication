# MyLoginn Astrology — Build Specification

**Module name:** "MyLoginn Astrology" (sub-product under the existing MyLoginn platform)
**Audience:** Developer implementing this feature in the `e:\MyLoginn` Next.js codebase
**Status:** Design spec — not yet implemented. Build in the phases listed in §13.

---

## 1. What we're building

A self-service horoscope engine where a user enters their birth details once and instantly gets a divine, professionally designed astrology report — with no astrologer involved. The user controls three independent choices:

| Axis | Options |
|---|---|
| **Depth** | Single-page summary **or** full multi-page horoscope (deep dive) |
| **Voice / style** | Human storytelling · Professional printed report · Dynamic animated (on-screen) |
| **Language** | English, Tamil (extensible to more) |

All astrology (rashi/zodiac, nakshatra, dasha-based age predictions in 5-year bands, numerology, Ashtakoot marriage matching) is **computed from real astronomical data**, not hardcoded lookup tables — this follows the existing [[no-static-data-rule]] convention already enforced across MyLoginn (courses, internships, projects are all DB-driven; astrology must be *calculation*-driven the same way static content is forbidden).

The report renders on-screen (styled per the chosen voice) and is downloadable as a pixel-perfect PDF in A4, A5, or A3, with a "MyLoginn Astrology" header on every page.

---

## 2. Where this lives in the app

New top-level route group, sibling to `courses/`, `tutoring/`, `internships/`:

```
src/app/astrology/
  page.tsx                     # landing: what it is, CTA to start
  new/page.tsx                 # the intake wizard (birth details → choices)
  [reportId]/page.tsx          # on-screen report viewer (styled per voice/depth)
  [reportId]/print/page.tsx    # print-only route, no chrome — the thing Playwright renders to PDF
  match/page.tsx               # marriage-matching intake (two birth profiles)
  match/[matchId]/page.tsx     # match report viewer

src/app/api/astrology/
  profiles/route.ts            # POST create birth profile
  reports/route.ts             # POST generate report (profile + style + depth + language)
  reports/[id]/route.ts        # GET report JSON
  reports/[id]/pdf/route.ts    # GET → streams the rendered PDF (page size as query param)
  match/route.ts               # POST compute Ashtakoot match between two profiles

src/lib/astrology/
  ephemeris.ts                 # planetary longitude calculations (wraps astronomy-engine)
  ayanamsa.ts                  # Lahiri ayanamsa correction (tropical → sidereal)
  panchanga.ts                 # rashi, nakshatra, tithi derivation from sidereal longitudes
  dasha.ts                     # Vimshottari Dasha timeline → 5-year age-band predictions
  numerology.ts                # life-path / name-number calculations
  matching.ts                  # Ashtakoot Guna Milan (36-point compatibility)
  geocode.ts                   # birth location string → { lat, lon, timezone }
  narrative.ts                 # turns raw chart data into per-language, per-style prose
  pdf.ts                       # Playwright-driven HTML→PDF renderer

src/components/astrology/
  BirthDetailsForm.tsx
  StyleDepthLanguagePicker.tsx
  ReportHeader.tsx              # "MyLoginn Astrology" masthead, reused across all styles
  reportStyles/
    StorytellingReport.tsx
    PrintReport.tsx
    AnimatedReport.tsx
  print/
    PrintPage.tsx               # @page-aware page wrapper (A4/A5/A3)

src/app/admin/astrology/
  page.tsx                      # admin: view generated reports, narrative phrase banks, language coverage
```

This mirrors the existing pattern (`src/app/courses`, `src/lib/tutoring-access.ts`, `src/app/admin/*` via `EntityManager`/`EntityScreen`) rather than inventing a new structure.

---

## 3. User journey

1. **Landing** (`/astrology`) — divine, animated hero (reuse `AnimatedText`, `Reveal`/`RevealGroup`, `aurora-blob`, `card-shine` from the existing design system). CTA → `/astrology/new`.
2. **Intake wizard** (`/astrology/new`), multi-step, `react-hook-form` + `zod` (already project conventions):
   - **Step 1 — Required birth details:** full name, date of birth, time of birth (with an "I don't know my exact time" toggle → falls back to noon and flags predictions as approximate), place of birth (free-text → geocoded).
   - **Step 2 — Optional fields:** parents' names, occupation, gender, any custom note. All optional; none block generation.
   - **Step 3 — Choices:** depth (single-page / full report), voice (storytelling / professional print / animated), language (English / Tamil / …).
   - Submit → `POST /api/astrology/profiles` then `POST /api/astrology/reports`.
3. **Report viewer** (`/astrology/[reportId]`) — renders the chosen style component, with a persistent "Download PDF" button (page-size selector: A4 default, A5, A3) and a "Change style/language" affordance that **re-renders from the same stored calculation** (no recomputation needed — see §4).
4. **Marriage matching** (`/astrology/match`) — pick/enter two profiles → Ashtakoot score, dosha flags, narrative compatibility summary.

---

## 4. Data model (Prisma additions)

Calculation is deterministic and inputs are static once birth details are set, so we **compute once, store the structured result, and render many times** (different style/language/depth are just presentation over the same `ChartData`). This avoids re-running ephemeris math on every page view/PDF export.

```prisma
enum ReportDepth {
  SUMMARY
  FULL
}

enum ReportVoice {
  STORYTELLING
  PROFESSIONAL
  ANIMATED
}

model AstrologyProfile {
  id            String   @id @default(cuid())
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])

  fullName      String
  gender        String?
  birthDate     DateTime          // stored as UTC instant
  birthTimeKnown Boolean  @default(true)
  birthPlace    String            // raw user input, e.g. "Madurai, Tamil Nadu, India"
  latitude      Float
  longitude     Float
  timezone      String            // IANA tz, e.g. "Asia/Kolkata"

  parentsNames  String?           // optional
  occupation    String?           // optional
  customNotes   String?           // optional

  chart         ChartData?
  createdAt     DateTime @default(now())

  @@index([userId])
}

model ChartData {
  id              String   @id @default(cuid())
  profileId       String   @unique
  profile         AstrologyProfile @relation(fields: [profileId], references: [id])

  ayanamsaUsed    Float             // Lahiri value applied, for auditability
  planetsJson     String            // sidereal longitude + rashi + nakshatra per planet (JSON)
  ascendantJson   String            // lagna details (JSON)
  dashaJson       String            // full Vimshottari Dasha timeline (JSON)
  numerologyJson  String            // life-path, name-number, lucky details (JSON)
  computedAt      DateTime @default(now())

  reports         HoroscopeReport[]
}

model HoroscopeReport {
  id           String       @id @default(cuid())
  chartDataId  String
  chartData    ChartData    @relation(fields: [chartDataId], references: [id])

  depth        ReportDepth
  voice        ReportVoice
  language     String               // "en" | "ta" | ...
  narrativeJson String              // rendered section text for this depth/voice/language
  createdAt    DateTime @default(now())

  @@index([chartDataId])
}

model MatchRequest {
  id            String   @id @default(cuid())
  profileAId    String
  profileBId    String
  ashtakootJson String            // full 36-point breakdown + doshas
  narrativeJson String            // per-language compatibility summary
  language      String
  createdAt     DateTime @default(now())
}
```

`User` gains one relation line: `astrologyProfiles AstrologyProfile[]`.

Regenerating a report in a different voice/language is just `POST /api/astrology/reports` with an existing `chartDataId` — cheap, no ephemeris recomputation, consistent with instant style-switching in the UI.

---

## 5. Calculation engine

All astronomy happens in pure TypeScript/JS — **no native bindings** (Swiss Ephemeris's native `swisseph` package requires a C build toolchain, which is a poor fit for this Windows dev environment and for Vercel/serverless deploy). Instead:

| Concern | Library / method |
|---|---|
| Planetary tropical longitudes (Sun, Moon, Mercury…Saturn, Rahu/Ketu via lunar nodes) | [`astronomy-engine`](https://www.npmjs.com/package/astronomy-engine) — pure JS, no native deps, actively maintained, npm-installable on Windows with zero build step |
| Tropical → sidereal (Vedic) correction | Lahiri ayanamsa, implemented directly as a polynomial formula in `src/lib/astrology/ayanamsa.ts` (well-documented, ~15 lines, no external dependency) |
| Rashi (sign), Nakshatra, Pada | Derived by dividing sidereal longitude into 12×30° (rashi) and 27×13°20′ (nakshatra) bands — `panchanga.ts` |
| Vimshottari Dasha (age-banded predictions) | Standard algorithm from Moon's nakshatra position at birth; deterministic 120-year cycle split across 9 planetary periods — `dasha.ts`. This is what powers the "every 5-year range" predictions: each 5-year window is labeled with its ruling Dasha/Antardasha planet, and narrative text is keyed off planet + house combination |
| Numerology | Life-path number from birth date digit-sum; name-number via Chaldean or Pythagorean mapping (config flag) — `numerology.ts` |
| Ashtakoot Guna Milan (marriage matching) | Classic 8-factor, 36-point compatibility (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) computed from both partners' Moon rashi/nakshatra — `matching.ts` |
| Birth-place → lat/lon | OpenStreetMap Nominatim geocoding (`https://nominatim.openstreetmap.org/search`), server-side, cached by input string in a small lookup table (add a `GeocodeCache` model, or reuse a simple key-value table) — no API key required, but respect Nominatim's usage policy (1 req/sec, custom User-Agent) |
| Lat/lon → IANA timezone | [`tz-lookup`](https://www.npmjs.com/package/tz-lookup) — pure JS, offline, no API key |
| Historic UTC offset at birth instant (handles pre-1980s India timezone/DST quirks) | `luxon`'s `IANAZone` — add `luxon` as a dependency (small, well-maintained, already implicitly compatible with the date handling patterns used in `streak.ts`'s Asia/Kolkata day-key logic) |

**Why this stack over an external astrology API:** per your calc-engine decision, calculations happen in-process so results are reproducible, auditable (the `ayanamsaUsed` field lets you prove which convention was applied), free of per-request third-party cost, and don't create a hard runtime dependency on an external vendor's uptime for a core product feature.

**Known scope boundary to flag to the developer:** this stack computes **sidereal Vedic astrology** (Lahiri ayanamsa) as the primary system, since Tamil-language astrology is inherently Vedic. If Western tropical astrology is also wanted later, the same `ephemeris.ts` tropical longitudes can be used directly (skip the ayanamsa step) — flag as a `system: "VEDIC" | "WESTERN"` field on `AstrologyProfile` if/when that's needed; out of scope for v1.

---

## 6. The three "voice" styles

All three consume the *same* `ChartData` — they differ only in **tone of the generated narrative** and **visual presentation**, not in underlying facts.

1. **Storytelling** (`StorytellingReport.tsx`) — warm, second-person prose ("You entered this world under a Scorpio moon, which quietly asks you to feel things deeply before you let others see it…"). Longform paragraphs, minimal tables. Best for on-screen reading.
2. **Professional / printed report** (`PrintReport.tsx`) — structured, clinical, table/grid heavy (planet position tables, Dasha timeline as a chart-like table, clean serif/sans typographic hierarchy). This is the style optimized for print — see §8.
3. **Dynamic animated** (`AnimatedReport.tsx`) — on-screen only (excluded from PDF export), uses `framer-motion` for a revealing chart wheel, animated planet glyphs (reusing the `Animated*` icon component pattern per [[animated-icon-conventions]]: gradient SVG, `useId()`-prefixed defs, infinite loop), scroll-triggered `Reveal` sections per life area.

Narrative text itself (`narrative.ts`) is **not** a hardcoded string bank per [[no-static-data-rule]] — generate it via the existing `openai` dependency (already in `package.json`) with a structured prompt: feed the computed `ChartData` JSON + chosen language + chosen voice + depth as context, ask for the narrative sections back as JSON matching a `zod` schema. Cache the result in `HoroscopeReport.narrativeJson` so regenerating the same report doesn't re-call the model. Admin (`/admin/astrology`) can regenerate a single section if the copy needs a manual touch-up.

---

## 7. Depth: single-page summary vs. full report

- **Summary** (`ReportDepth.SUMMARY`): one page. Sun/Moon/Ascendant rashi, top 3 personality traits, current Dasha period headline, lucky number/color, one-paragraph life theme. This is the page users see first regardless of depth choice — think of it as page 1 of the full report too.
- **Full** (`ReportDepth.FULL`): everything in Summary as page 1, then:
  - Page 2: full planetary position table + house-by-house breakdown
  - Page 3: Vimshottari Dasha timeline broken into 5-year age bands from birth to 80, each with a narrative paragraph (this satisfies "age-based predictions every 5-year range")
  - Page 4: numerology deep-dive
  - Page 5 (only if a spouse/partner profile was supplied): marriage-matching Ashtakoot breakdown
  - Page 6 (optional, populated only if occupation/parents'-names were supplied): personalized notes referencing those optional fields — career-house analysis tied to stated occupation, family-house notes tied to parents being named. **This page is entirely omitted (not a blank page) when optional fields are empty** — no gaps in the printed sequence.

---

## 8. Print & PDF pipeline (A4 / A5 / A3, pixel-perfect)

**Approach:** server-side headless-browser rendering, not client `window.print()`. The project already has `playwright` as a devDependency — promote it to a runtime dependency and use it as the PDF engine. This guarantees the PDF matches on-screen CSS exactly (same Chromium engine renders both), avoiding the classic "print CSS looks different per-browser" problem.

1. `GET /api/astrology/reports/[id]/pdf?size=A4` launches a headless Playwright Chromium instance server-side, navigates to the internal `[reportId]/print` route (no nav/footer chrome, just `PrintReport` content), and calls `page.pdf({ format: size, printBackground: true })`, streaming the buffer back with `Content-Type: application/pdf`.
2. `PrintPage.tsx` wraps every printed page in a container styled via CSS `@page` rules matched to the requested size:
   ```css
   @page { size: A4; margin: 14mm 12mm; }
   ```
   with `A4`/`A5`/`A3` selected by a `data-size` attribute driving a CSS custom property (`--page-w`, `--page-h`) so layout (grid columns, font sizes, table density) scales per format rather than just clipping — A5 uses a tighter single-column layout, A3 allows a 2-column planetary table plus a larger chart-wheel graphic.
3. Every printed page includes the `ReportHeader` masthead ("MyLoginn Astrology" wordmark + subtle divine motif) via `position: running(header)` / CSS `@page` margin-box content, so it repeats identically on every page without manual repetition in the DOM — this is what guarantees "no gaps, perfect alignment across all pages."
4. Page-break control: every content section (`.report-section`) gets `break-inside: avoid;`; explicit section boundaries get `break-before: page;` — this is what prevents a paragraph or table row from being sliced across a page edge.
5. The **animated** voice is explicitly excluded from PDF generation (motion has no print equivalent) — if a user requests a PDF while viewing the animated style, silently render the Professional style for the PDF and say so in the UI ("PDF exports use the Professional layout").

---

## 9. Multi-language support

- `language` is a plain string column (`"en"`, `"ta"`, extensible) on `HoroscopeReport` and `MatchRequest` — not an enum, so adding a language is a data change, not a schema migration.
- All narrative text is generated per-language at report-creation time (§6) and cached — no client-side i18n string swapping needed for report content.
- Static UI chrome (buttons, labels, form field names) uses a small `src/lib/astrology/i18n.ts` dictionary keyed the same way the rest of the app would do UI copy (keep this separate from the DB-cached narrative content — UI chrome is fine as code constants per the [[no-static-data-rule]] "decorative/UI-only" exemption, same as `heroOrbit.ts`).
- Tamil typography: printed reports need a Tamil-supporting font stack (`Noto Sans Tamil` or similar) loaded via `next/font` for both screen and the Playwright print render (verify the headless Chromium instance actually has the font available — bundle it locally rather than relying on system fonts, since the render happens in a server environment that may not have Tamil fonts installed by default).

---

## 10. Validation & API contract

- Every intake field validated with `zod` (existing convention, see `src/lib/validation.ts`) — birth date/time/place required; parents'/occupation/notes explicitly `.optional()`.
- Geocoding failures (place not found) must not hard-block report generation — fall back to a manual lat/lon entry field rather than erroring out.
- `POST /api/astrology/reports` is idempotent per `(chartDataId, depth, voice, language)` — re-requesting an identical combination returns the existing `HoroscopeReport` instead of regenerating (saves OpenAI calls).

---

## 11. Admin surface

Extend the existing `EntityManager`/`EntityScreen` pattern (`src/components/admin/entityConfigs.tsx`) with an `astrologyReports` entity: read-only list/detail view of generated reports for support/QA purposes, plus a "regenerate narrative" action per report for manual copy fixes.

---

## 12. Dependencies to add

```
astronomy-engine   (runtime) — ephemeris / planetary positions
tz-lookup          (runtime) — lat/lon → IANA timezone
luxon              (runtime) — historic UTC offset resolution
playwright         (move from devDependencies to dependencies) — PDF rendering
```

No dependency on a paid third-party astrology API, per your earlier decision.

---

## 13. Phased delivery plan

**Phase 1 — Core engine + summary report**
Prisma migration (§4) → `ephemeris.ts`/`ayanamsa.ts`/`panchanga.ts` → intake wizard (birth details only, no optional fields yet) → Professional-style single-page summary report on-screen → A4 PDF export only.

**Phase 2 — Full report + Dasha predictions**
`dasha.ts` (5-year age bands) → numerology → full multi-page report → optional-fields page 6 → A5/A3 sizing.

**Phase 3 — Voice variety + language**
Storytelling and Animated styles → OpenAI-generated narrative pipeline → Tamil language support end-to-end (including print font verification).

**Phase 4 — Marriage matching**
Second-profile intake → Ashtakoot engine → match report + PDF.

Each phase should be independently demoable and testable before moving to the next — do not start Phase 3's narrative-generation work until Phase 1/2's calculation engine is verified accurate against a couple of known reference charts (spot-check against a trusted panchang/almanac for at least 2–3 real birth details before trusting the math).

---

## 14. Open decisions still needed from the product owner (flag before Phase 3+)

- Exact wording/tone guidelines for the "divine" voice (any phrases or astrologer-style disclaimers required, e.g. "for entertainment/self-reflection purposes")
- Whether Tamil astrology terms (rashi/nakshatra names) should display in Tamil script even within the English-language report, or English transliteration only
- Pricing/access model — is this free, one-time paid per report, or gated behind an existing course/tutoring tier (`FeeTier` enum already exists in schema and could be reused)
