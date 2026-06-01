# iDeSi — Design Language v1

**Guiding metaphor:** the Pandya pearl route, modernized — a trade route between India and Switzerland.
**Governing principle:** *Swiss bones, Tamil soul.* Helvetian discipline in the structure; Pandya warmth in the skin.

---

## 1. Essence

iDeSi is the umbrella for several ventures — travel, cricket, AI, import — but one feeling has to carry across all of them: **warm, rooted, and quietly premium.** Not loud, not corporate-cold, not touristy-clichéd. Think *heirloom modernism*: an object made with care, passed down, but engineered with precision.

- **Personality:** the gracious host who is also exacting. Generous warmth, zero clutter.
- **One-line brief for any designer or AI tool:** "Swiss-grid precision and restraint, dressed in Pandya temple gold and deep madder red, warm and heritage-rich, premium without being flashy."

---

## 2. The fusion rule (how to balance India ↔ Switzerland)

Keep the two poles in their lanes so the fusion reads as *intentional*, not busy:

| Swiss bones (structure) | Tamil soul (skin) |
|---|---|
| Grid, alignment, generous whitespace | Color: gold + madder + warm neutrals |
| Restraint — few elements, lots of air | Ornament: kolam line-work, twin-fish, pearl |
| Clean neo-grotesque type for everything functional | Characterful serif for headlines |
| Precision, symmetry, calm | Texture, craft, hospitality |

**Rule of thumb:** if a screen feels too cold, add warmth through *color and a single motif* — never through clutter. If it feels too busy, the fix is always *more whitespace and fewer ornaments*, never less color.

---

## 3. Color system

### Core palette

| Token | Name | Hex | Role |
|---|---|---|---|
| `--madder` | Madder Red | `#8B2C24` | Primary brand color, primary buttons, hero blocks |
| `--kumkum` | Kumkum | `#B23A2C` | Brighter red accent, used sparingly (alerts, highlights) |
| `--gold` | Pandya Gold | `#C8962C` | Metal accent — borders, rules, icons, display flourishes |
| `--brass` | Brass | `#97701C` | Gold depth — hover/pressed states on gold elements |
| `--ivory` | Temple Ivory | `#FAF5EC` | Primary light background |
| `--sandstone` | Sandstone | `#EDE2CF` | Secondary surface, cards, section bands |
| `--pearl` | Pearl | `#F4EDE1` | Subtle highlight / lightest tint |
| `--granite` | Granite | `#221E1A` | Primary text, warm near-black (never pure #000) |
| `--stone` | Stone | `#6E655A` | Secondary text, captions, muted UI |

### Tertiary accents (per-vertical, used in small doses)

| Token | Name | Hex | Where |
|---|---|---|---|
| `--peacock` | Peacock | `#155F5B` | AI vertical — cooler, technical |
| `--pitch` | Pitch Green | `#3E5C2E` | Cricket vertical — functional sport accent |

### Usage rules (important)

- **Gold is a metal, not a fill.** Use it for thin borders, hairline rules, icon strokes, small fills, and display accents. Large flat gold fields look cheap. On dark (`--granite`) backgrounds gold can be a hero color.
- **Madder is the workhorse brand color.** Primary CTAs, hero panels, key headings.
- **Backgrounds stay warm and light** (`--ivory` / `--sandstone`). Avoid stark white and avoid cold greys entirely.
- **Accessibility:** `--granite` and `--madder` both pass on `--ivory`/`--sandstone` for text. **Gold does NOT** have enough contrast for small body text on light — never set body copy in gold. Gold text only on `--granite`, or at large display sizes.
- Keep any single screen to **two of the three "loud" colors max** (madder, kumkum, gold). Neutrals do the heavy lifting.

---

## 4. Typography

Three families. Serif for soul, grotesque for bones, Tamil for heritage. All available on Google Fonts (so they work directly in Stitch).

| Role | Font | Notes |
|---|---|---|
| **Display / Headlines** | **Fraunces** | Warm, characterful "old-style" serif. Use the soft/high-optical settings. Heritage voice. *(Alt for a more classical luxe feel: Cormorant.)* |
| **Body & all UI** | **Inter** | Swiss neo-grotesque. Clean, neutral, precise. Carries the structure. |
| **Tamil script** | **Hind Madurai** | For any Tamil text — and a literal nod to your Pandya/Madurai roots. |
| **Numerals / data** | **JetBrains Mono** | Cricket stats, prices, import-fee calculators — anything tabular/technical. |

### Scale (8pt rhythm)

- Display: Fraunces, 48–72px, weight 500–600, tight leading (1.05–1.15)
- H1: Fraunces, 32–40px
- H2: Fraunces, 24–28px
- H3 / lead: Inter, 18–20px, weight 600
- Body: Inter, 16px, weight 400, leading 1.6
- Small / caption: Inter, 13–14px, `--stone`

**Pairing rule:** serif headlines, everything else sans. Don't set serif at body sizes — it loses the Swiss crispness.

---

## 5. Logo & motifs

The visual heritage kit — used **sparingly**, like seasoning.

- **Twin-fish mark (இரட்டை மீன்):** the Pandya royal emblem — two mirrored carp. Render as minimal, symmetric line-art in gold. This is your primary symbol; its symmetry is exactly where Swiss precision and Tamil heritage meet. Great for the app icon, favicon, and section seals.
- **The "i" dot as a pearl:** in the *iDeSi* wordmark, the dot over the "i" becomes a small gold pearl. Pearls also reappear as bullet markers, loading dots, and active-state indicators.
- **Kolam hairlines:** thin dotted/geometric gold rules as section dividers and corner flourishes — derived from Tamil floor-art, but kept to the grid. Use as a *line*, never as a busy pattern.
- **Gopuram steps:** the stepped temple-tower silhouette as a subtle structural motif — stepped card stacks, stepped section transitions.

**Wordmark:** `iDeSi` — lowercase `i`, capital `D` and `S`. Set in Fraunces or a refined custom letterform. Pearl dot on the `i`.

---

## 6. Layout & spacing (the Swiss bones)

- **Grid:** 12-column, generous outer margins, wide gutters. Let things breathe.
- **Spacing base:** 8px. Use 8 / 16 / 24 / 32 / 48 / 64 / 96.
- **Alignment:** predominantly left-aligned, structured. Disciplined asymmetry is welcome; chaos is not.
- **Corner radius:** modest — 8–12px. Soft enough to feel warm, composed enough to avoid the "pill everything" look. Never fully sharp, never fully round.
- **Elevation:** low, warm, soft shadows (e.g. `0 8px 24px rgba(34,30,26,0.08)`). No hard or cold drop shadows.

---

## 7. Components

- **Primary button:** `--madder` fill, `--ivory` text, 10px radius, no border. Hover → slightly darker madder.
- **Secondary button:** transparent fill, 1px `--gold` border, `--granite` text. Hover → faint `--pearl` fill.
- **Cards:** `--sandstone` or `--ivory` surface, 1px hairline border in gold at ~20% opacity *or* a soft warm shadow (pick one, not both), 12px radius.
- **Inputs:** `--ivory` fill, 1px `--stone` border, gold focus ring. 8px radius.
- **Dividers:** thin gold hairlines, or kolam-dotted rules for special sections.
- **Tags / chips:** sandstone fill, granite text; vertical-accent color for category.

---

## 8. Imagery & photography

- **Look:** warm natural light, real texture, golden-hour grading. Swiss landscapes shot *warm*, not crisp-cold. Indian craft shown in detail (hands, materials, provenance).
- **Travel:** aspirational, couples in Swiss settings, warm tone — never generic stock.
- **Import:** show provenance — the object, the maker, the material.
- **Avoid:** over-saturated "exotic India" clichés, mandala overload, cold blue tech gradients, sterile corporate stock.
- A little film grain is acceptable — it reads as heritage, not noise.

---

## 9. Voice & tone

Warm, confident, knowledgeable — a host's hospitality (*virundhombal*) meets Swiss reliability.

- We **curate, vouch, host** — we don't "sell" or hype.
- Sentences are clear and unhurried. Confident, never breathless.
- A touch of Tamil/Swiss specificity where it earns its place; never costume.

---

## 10. Motion

Gentle and eased. Slow, warm reveals. Nothing bouncy or springy. Transitions ~200–350ms, ease-in-out. Motion should feel *considered*, like the rest of the brand.

---

## 11. Per-vertical flavoring (shared core, flexible accents)

All four share the core system above; each leans on one accent so it has its own character while staying family.

- **Travel** — Pandya **Gold**-forward. Aspirational, spacious, warm. Sun on the Alps.
- **Cricket** — **Kumkum** energy + `--pitch` green as functional accent. A touch more dynamic; mono numerals for stats.
- **AI** — **Peacock** + Granite. Cooler and more technical within the warm family; cleaner, more grid-forward.
- **Import** — **Madder** + brass. Trade, craft, provenance; emphasize material and origin.

---

## 12. Ready-to-paste Stitch theme prompt

Prepend this to any per-screen prompt you give Google Stitch, then describe the specific screen:

> **Design system:** A warm, heritage-rich, premium brand called iDeSi that fuses Swiss structural precision with Tamil/Pandya warmth — "Swiss bones, Tamil soul." Use a 12-column grid with generous whitespace and an 8px spacing rhythm. Colors: backgrounds in warm Temple Ivory (#FAF5EC) and Sandstone (#EDE2CF); primary brand and primary buttons in deep Madder Red (#8B2C24); gold (#C8962C) used only as a thin metal accent for borders, rules, and icons (never as body text or large fills); text in warm near-black Granite (#221E1A) with Stone (#6E655A) for secondary text. Headlines in the Fraunces serif (warm, characterful); all body and UI text in Inter. Corner radius 8–12px, low soft warm shadows, no cold greys, no pure white or black. Tone: gracious, calm, confident. Aesthetic: heirloom modernism — restrained, premium, never flashy.

Then add, e.g.: *"Design a [landing page / booking flow / product grid] for the [travel/cricket/AI/import] section, leaning on the [gold/kumkum+green/peacock/madder] accent."*

---

*v1 — a starting point, not scripture. The hexes and fonts are tuned to your brief but built to be refined.*
