---
name: Heirloom Modernism
colors:
  surface: '#fff8f4'
  surface-dim: '#e1d8d2'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2eb'
  surface-container: '#f6ece5'
  surface-container-high: '#f0e6e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#56423f'
  inverse-surface: '#34302b'
  inverse-on-surface: '#f8efe8'
  outline: '#8a716e'
  outline-variant: '#ddc0bc'
  surface-tint: '#a23d33'
  primary: '#6c1510'
  on-primary: '#ffffff'
  primary-container: '#8b2c24'
  on-primary-container: '#ffa89d'
  inverse-primary: '#ffb4aa'
  secondary: '#7c5800'
  on-secondary: '#ffffff'
  secondary-container: '#fec658'
  on-secondary-container: '#735200'
  tertiary: '#003e3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#055753'
  on-tertiary-container: '#88cbc5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#82261e'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f5be51'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#acefe9'
  tertiary-fixed-dim: '#90d3cd'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#fff8f4'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
  madder-red: '#8B2C24'
  kumkum: '#B23A2C'
  pandya-gold: '#C8962C'
  brass: '#97701C'
  temple-ivory: '#FAF5EC'
  sandstone: '#EDE2CF'
  pearl: '#F4EDE1'
  granite: '#221E1A'
  stone: '#6E655A'
  peacock: '#155F5B'
  pitch-green: '#3E5C2E'
typography:
  display:
    fontFamily: Fraunces
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Fraunces
    fontSize: 40px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  huge: 64px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system embodies the philosophy of **"Swiss bones, Tamil soul."** It is a high-end fusion of Helvetian structural discipline and Pandya heritage warmth. The aesthetic is defined as **Heirloom Modernism**: a style that is restrained, premium, and meticulously engineered, yet deeply rooted in cultural craftsmanship.

The brand personality is that of a "gracious host"—confident, knowledgeable, and exacting. It prioritizes generous whitespace (Swiss precision) and avoids clutter, using rich colors and meaningful motifs (Tamil soul) to provide skin and character to the rigid underlying grid. The emotional response should be one of calm, reliability, and timeless quality.

## Colors

The palette is anchored by **Temple Ivory** and **Sandstone** backgrounds to ensure a warm, parchment-like foundation—pure white and cold greys are strictly prohibited. 

- **Primary (Madder Red):** The workhorse brand color used for primary actions and hero elements.
- **Secondary (Pandya Gold):** Treated strictly as a metal accent. Use it for hairlines, icon strokes, and small display flourishes. It should never be used for large fills or body text.
- **Neutral (Granite/Stone):** A warm, near-black for high-contrast typography and a muted grey for secondary information.
- **Accents:** **Peacock** is reserved for technical/AI contexts to provide a cooler, intellectual depth without losing the warmth of the system.

**Accessibility Note:** Ensure Granite or Madder Red is used for text on Ivory/Sandstone surfaces. Gold text is only permitted on Granite backgrounds at large display sizes.

## Typography

The typographic system follows a strict "Serif for Soul, Grotesque for Bones" rule. 

- **Fraunces** is used for all headlines and display text, bringing a characterful, heritage voice. Use "Soft" or "High-Optical" settings where available.
- **Inter** handles all functional UI and body text, representing Swiss precision and legibility.
- **JetBrains Mono** is utilized specifically for data-heavy sections, such as cricket statistics or import fees, to emphasize technical accuracy.
- **Hind Madurai** (noted for implementation) should be used for all native Tamil script requirements.

Maintain an 8px rhythm for vertical spacing. Headlines should have tighter leading (1.1–1.2) while body text remains airy (1.6) for maximum readability against the warm backgrounds.

## Layout & Spacing

The design system utilizes a **12-column fluid grid** for desktop, reflowing to 4 columns for mobile. The layout philosophy is rooted in **disciplined asymmetry**—elements are perfectly aligned to the grid but positioned to allow for generous whitespace and "breathing room."

- **Spacing Rhythm:** All margins, paddings, and gaps must be multiples of the 8px base unit. 
- **Desktop:** 32px outer margins with 24px gutters to emphasize a premium, spacious feel.
- **Mobile:** Margins reduce to 16px, with gutters staying at 16px.
- **Alignment:** Predominantly left-aligned for text. Section transitions can use "Gopuram steps" (stepped offsets) to break vertical monotony while maintaining grid integrity.

## Elevation & Depth

Hierarchy is conveyed through **tonal layers** and **ambient shadows**. 

- **Surfaces:** Use `Temple Ivory` for the base canvas and `Sandstone` for cards or section blocks to create a subtle shift in depth without heavy borders.
- **Shadows:** Avoid all cold or neutral grey shadows. Use soft, warm-tinted shadows that simulate natural light hitting a physical surface (e.g., `rgba(34, 30, 26, 0.08)`). Shadows should be extra-diffused with a high blur radius and low opacity.
- **Dividers:** Use thin `Pandya Gold` hairlines or "Kolam hairlines" (dotted geometric rules) as section dividers. These should feel like jewelry—delicate and precise.

## Shapes

The shape language balances warmth and composure. A **roundedness of 2** (8px to 12px) is the standard for most UI elements.

- **Standard Radius (8px):** Used for input fields, buttons, and small components.
- **Large Radius (12px):** Reserved for cards and container modules.
- **Motifs:** Incorporate the **Twin-Fish mark** as symmetric line-art and the **Pearl** (small circle) as a recurring element for loading states, bullet points, and the "i" dot in branding.

## Components

- **Buttons:** 
  - *Primary:* Madder Red fill with Temple Ivory text. Use a 10px radius. 
  - *Secondary:* 1px Gold border with Granite text and a transparent fill.
- **Cards:** Use Sandstone surfaces with a 12px radius. Depth can be achieved through either a subtle warm shadow or a 1px Gold hairline border at 20% opacity—never use both.
- **Input Fields:** Temple Ivory fill with a 1px Stone border. Upon focus, the border transitions to Pandya Gold.
- **Chips/Tags:** Sandstone background with Granite text. For the AI vertical, use a Peacock-colored pill to denote technical categories.
- **Lists:** Use the "Pearl" motif (gold dot) as a list marker to reinforce the premium heritage aesthetic.
- **Special AI Component:** Use Peacock fills sparingly for "Technical Insight" blocks within the AI/Notes vertical, maintaining high Granite-on-Ivory contrast for the content itself.