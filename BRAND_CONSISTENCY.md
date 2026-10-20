# Brand consistency

The supplied brand book and its companion strategy, quick guide, design tokens
and original SVGs define the identity. Agency Jung was inspected as the process
reference named in the request; its clients' identities were not adopted.

| Element | Initial deviation | Applied correction | Evidence |
|---|---|---|---|
| Symbol | Hero rotated by −8° despite the no-tilt rule | Original positive/negative SVGs at natural proportions; no transform, effect or extra logo contour | `BaseLayout.astro`, home figure and source SVGs |
| Palette | Theme-dependent inverse colors made the brand image caption and footer inconsistent; contact emphasis failed contrast | Atlas, Mineral, Copper, Sand, Paper, Ink and Slate centralized; fixed dark feature surfaces use Paper and light Copper | `src/styles/tokens.css`, `global.css` |
| Small text | Copper on the card surface failed AA | Card indices use the theme text token; dark copper is used on Paper, light copper on Atlas | axe before/after and screenshots |
| Fonts | Noto declared but absent on visitors' machines | Pinned local WOFF2 assets from Fontsource, Sans preload and font-display swap | `BaseLayout.astro`, build assets, license notices |
| Reading hierarchy | Serif page headings conflicted with the preferred Sans hierarchy; hero oversized | Sans headings/interface; Serif only for long reading; Mono only for short metadata | shared CSS and all-route screenshots |
| Key visual | 2,949,353-byte public PNG and generic overlays | Original artwork preserved in source, three responsive WebP outputs, descriptive alt text and explicit abstract-image wording | `src/assets/`, Astro Image in both home routes |
| Graphic language | Unused monogram, orbital rings, axes and gradient CSS remained | Removed unused decoration; retained official curve-point-line signature and territory grid | CSS diff |
| Verbal identity | Generic statements and audit-process copy dominated | Approved territory/data/intelligence positioning, specific practice and work; no invented credentials | home, About, Expertise and case studies |

The horizontal signature is retained as a supplied asset. The compact responsive
header uses the official standalone symbol and live text; the symbol stays 44px,
above the brand minimum of 20px. Protection is provided by the header gap and
surrounding space. The fixed footer uses the negative version on Atlas.

The quick guide recommends at most two families per composition, whereas the
full strategy defines three functional families. Home/interface uses Sans + Mono;
long-form pages additionally use Serif in reading blocks, following the fuller
specification. No extra display family has been introduced.

All three Fontsource packages contain SIL OFL 1.1 licenses. Notices are copied to
`public/fonts/`. No project license was created or changed.

Visual review covers each of the twelve pages at desktop/mobile in light/dark.
The source illustration is decorative brand artwork; it does not claim a real
place, geographic dataset, analytical result or client deliverable.
