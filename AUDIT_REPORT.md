# Portfolio audit, corrections and validation

Audit date: 2026-10-20. Local baseline: `2fdfd26`. Working branch:
`feat/portfolio-quality-audit`. Public baseline at inspection: `a85d45c`.
All numbers below refer to actual local production-build measurements, unless
explicitly identified as remote evidence. No remote write was performed.

## Executive result

The existing Astro architecture was retained. Reproducible browser testing found
horizontal overflow at 320px and serious contrast violations. The fixes also
correct the tilted brand mark, unavailable fonts, oversized imagery, theme
resilience, empty-content routes, social metadata and deployment validation.
The final route/theme/viewport audit reports no overflow, broken image, runtime
error, broken internal link or automated WCAG-tagged violation. No P0 or P1 issue
remains known within the inspected scope. This is not a full WCAG certification.

The largest content gaps require source material: an approved CV, dated career
and education timeline, direct contact address, articles and event records. They
are explicitly described instead of filled with invented facts.

## Actual architecture

| Concern | Observed implementation and decision |
|---|---|
| Framework/language | Astro 7.4.1, TypeScript 6.0.3; static output; no React runtime in the portfolio |
| Build/dependencies | Vite through Astro; npm lockfile, `npm ci`; dependencies pinned; no framework migration |
| Structure | Shared `BaseLayout.astro`, twelve route outputs, typed editorial project data, CSS tokens and public brand assets |
| Components | Shared shell covers navigation, theme, footer, SEO, local fonts and social metadata; page-specific code remains local |
| Design | “Coordenadas de síntese”; approved palette, original positive/negative symbols and Noto families |
| Media | Source PNG moved to build assets; Astro outputs responsive WebP; explicit image dimensions; no original PNG served |
| Routes | Home, About, Expertise, Contact, Projects, four cases, Writing, Portuguese intro and 404; existing paths preserved |
| SEO | Per-page descriptions/titles/canonical; OG/Twitter image; limited Person JSON-LD; equivalent-home hreflang; sitemap/robots; 404 noindex |
| Verification | No original test suite; added thirteen visitor tests, static reference/bundle checks, all-route axe/viewport audit and Lighthouse |
| Delivery | Existing GitHub Pages retained, root base path correct for user site; manual-only deployment; new PR/manual quality workflow |
| Security | Static pages; no credentials, form, analytics, runtime private API, third-party scripts or data service added |
| Documentation | README replaced with actual setup, commands and maintenance; five accompanying audit/change/future documents |
| Unused code | Removed obsolete monogram/orbital decorations, inverse-color coupling and gradient styles; supplied logo library retained |

The original `npm ci`, typecheck and production build passed. Original dependency
audit reported zero advisories. Before edits, the production preview was captured
on all routes in light/dark at 390/1440px and checked at all eight requested and
intermediate widths. The 48 baseline screenshots are retained locally.

## Issues and corrections

| Priority | Evidence / initial problem | Implemented change | Related files |
|---|---|---|---|
| P1 | Home and About overflowed at 320px in both themes (4 matrix failures) | Minmax grid tracks, readable heading scale, wrapping brand/nav/CTAs; 200% text check | `global.css`, `visitor.spec.ts` |
| P1 | axe found serious contrast issues: 3 route/theme rule occurrences, 6 nodes | Fixed feature-surface colors; card indices use accessible text color; hover/focus use matching surfaces | `tokens.css`, `global.css` |
| P1 | Logo rotated −8° and negative symbol on light footer | Original symbol proportions, no inclination; fixed Atlas footer with negative logo | layout, shared CSS, both home routes |
| P1 | Theme initialization could throw on blocked storage; no-JS button inert | Guard storage reads/writes, validate stored theme, honor OS preference; hide controls until active; synchronize pressed state | `BaseLayout.astro` |
| P2 | Noto depended on fonts installed on the visitor's device | Local Fontsource WOFF2, one primary preload, swap, OFL notices | layout, package lock, `public/fonts/` |
| P2 | Home loaded a 2,949,353-byte PNG | Responsive WebP outputs, eager priority for hero, original kept out of public output | Astro Image, `src/assets/` |
| P2 | Homepage dominated by oversized copy and audit-process language | Shorter personal proposition, clear work/approach/contact paths | home and shared typography |
| P2 | No active nav, generic repeated case links, missing useful empty filter state | Current-page indicator, specific names, domain/technology selects and live result count | layout, project index |
| P2 | Case architecture was only a paragraph | Four accessible ordered diagram flows, evidence and anchor navigation; all original case content retained | project data and `[slug].astro` |
| P2 | Portuguese route was a placeholder; Writing had only an empty notice | Functional Portuguese introduction; real case-study reading links and teaching themes | pt-BR and Writing routes |
| P2 | Education/trajectory/contact paths lacked useful context | Approved supplied biography used carefully; missing CV/timeline exposed honestly | About, Expertise, Contact |
| P2 | No social image, Twitter card, home alternates, 404 noindex | Branded 1200×630 social image, metadata, safe static JSON-LD, scoped alternates and 404 canonical | layout, social asset, config |
| P2 | Deploy only built; no tests or link gate | Type/build/link gate before upload; PR/manual quality workflow with E2E/dependency checks; least job permissions | workflows and verification scripts |
| P3 | Repeated tokens and dead graphic rules | Central token file, functional fonts and removal of unused styles | `src/styles/` |

No unrelated repository source, license, pin, domain, client information or
professional contract was changed. Public project descriptions remain
experimental and distinguish tests from hardware/browser/integration checks.

## Measured comparison

| Area | Initial state | Final state | Evidence |
|---|---|---|---|
| Branding | Tilted official symbol, font fallback, inconsistent surfaces | Original symbol, local Noto, centralized approved colors | `BRAND_CONSISTENCY.md`, 48 final captures |
| UX/UI | No active route; narrow filtering; placeholder content | Clear routes, combined filters, diagrams, useful professional/Portuguese content | `UX_UI_REVIEW.md`, visitor tests |
| Responsiveness | 4 overflow cases at 320px | 0 across 192 route/theme/width combinations; 200% text at 320px passed | browser JSON and E2E |
| Accessibility | 3 axe rule occurrences (6 nodes); mobile Lighthouse 96 | 0 axe violations in 24 page/theme audits; Lighthouse 100 | axe 4.14.0 and manual keyboard/visual review |
| Performance | Mobile Lighthouse 100; LCP 0.90s; CLS 0; TBT 0; 2,957,814 resource bytes | Mobile 100, LCP 1.80s; desktop 100, LCP 0.40s; CLS/TBT 0; 121,890 bytes | Lighthouse 13.5.0 JSON |
| SEO | Lighthouse 100 but incomplete social/i18n metadata and 404 policy | Lighthouse 100; complete social card, scoped alternates, correct 404 | build assertions and Lighthouse |
| Security | npm advisories 0; no form/backend | npm advisories 0 including audit tooling; no external runtime requests or secret-pattern hits | npm audit, bundle/runtime scan |
| Code quality | Typed Astro compiled; no regression suite | Zero type/template errors or hints; shared tokens; reproducible checks | `npm run check`, scripts and tests |
| Build | 12 static pages built | 12 static pages built; 246 local references checked | `build` and `test:links` |
| Functionality | No automated journeys; no meaningful Portuguese intro | 13 E2E tests passed; source-dependent recruiter CV journey remains partial | visitor tests; UX review |

Performance transfer fell approximately 95.9%. The measured mobile LCP increased
from 0.90s to 1.80s after self-hosted fonts and changed content; it remains below
2.5s. This is reported as measured, not as a claim that every timing improved.
The first desktop diagnostic accidentally retained mobile throttling; it was
discarded and the final desktop run uses Lighthouse's official desktop preset.
The recorded mobile/desktop scores come from the files in `docs/qa/summary.json`.

These are local laboratory navigation measurements with simulated CPU/network,
not field data, the public revised site's scores or a performance guarantee.
No field INP was measured; TBT is not substituted for INP. Desktop baseline was
not measured. No standalone unit-test count or invented coverage is claimed.

## Manual checks and limits

- Reviewed all twelve routes through desktop/mobile screenshot sheets in both
  themes; compared the baseline captures with the corrected layout.
- Used the in-app browser for real filter selection and the public route layout;
  it contains an Electron CSP warning from its own shell. Standalone production
  browser audits recorded zero application console/runtime errors.
- Keyboard-only testing covered skip link → main focus, header traversal,
  theme activation and native filter selection. Text zoom/reduced motion,
  theme reload and denied localStorage were also tested.
- axe incomplete contrast entries were decorative arrow/theme characters with
  meaningful accessible labels, not unreviewed text. Theme surface ratios were
  calculated: Ink/Paper 13.82, Slate/Paper 5.58, dark Copper/Paper 4.62,
  light Copper/Atlas 5.76, muted/Atlas 8.27; card text 12.91 light and 9.91 dark.
- The four allowlisted repositories were rechecked through GitHub API: all
  public, not archived. The GitHub profile and repository links are the only
  external user destinations; no private data is fetched at runtime.
- A targeted private-repository-name scan against the local inventory is kept
  outside the public source, with no private names copied into this report.
- No physical screen reader, Safari/Firefox, authenticated contact interaction,
  client project verification or enrollment record was tested. These limits
  remain explicit rather than implied by the automated scores.

## Deployment and handoff

The existing public Pages run `39467925794` remains successful at `a85d45c` and
was checked read-only. No domain, account, permission setting or remote branch
was modified. The modified workflows are reviewed locally; they have not run on
GitHub in this revision. Publishing the new reviewed branch requires the owner's
approval because the prior publication authorization specifically named
`a85d45c`. The current five pins, including `dem-drainage`, remain untouched.

The six required documents are present. Only source-dependent or separately
approved work is left in `FUTURE_IMPROVEMENTS.md`.

References: [WCAG 2.2 reference](https://www.w3.org/WAI/WCAG22/quickref/),
[Lighthouse documentation](https://developer.chrome.com/docs/lighthouse/overview),
[Astro Pages deployment](https://docs.astro.build/en/guides/deploy/github/),
[Playwright configuration](https://playwright.dev/docs/test-configuration),
[Agency Jung portfolio](https://www.agenciajung.com.br/portfolio).
