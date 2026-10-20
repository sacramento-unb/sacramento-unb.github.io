# UX and UI review

## Navigation and composition

The shared header keeps four visible destinations even on narrow screens,
avoiding a script-dependent mobile menu. Current-page indication uses text and an
underline with `aria-current`. Header/footer links, theme control and primary
CTAs have at least 44px interactive height; inline prose links remain inline.

The home now presents Vitor, his proposition, four selected projects, an approach
and contact. It has a compact heading and explicit English/Portuguese introduction
paths. No ornamental animation, analytics or form service was added.

About presents the supplied Geology/UnB qualification and cross-disciplinary
experience without inventing employment, dates, certifications or graduation
details. The candidate's supplied biography is the source, not an independent
verification of degrees. A downloadable CV and dated career history still require
source material. Writing now links to real technical case studies and describes
teaching themes; it does not fabricate a publication or speaker bibliography.

Project filters are built from available domains and technologies. They combine,
announce the result count, show a useful empty state and can be operated with
native keyboard controls. Filters and the theme control are hidden if JavaScript
is disabled; the full project catalogue and navigation remain available.

Each case study has a return link, anchor navigation and an ordered architecture
flow derived from its existing description. Experimental status, actual checks,
hardware/integration limitations and repository links are retained.

## Accessibility and responsive verification

- Before: overflow at 320px on home/About in both themes; contrast violations on
  contact emphasis and card indices.
- After: twelve routes × two themes × eight widths (320, 375, 390, 768, 860,
  1024, 1440, 1920) produced 192 passing geometry checks.
- axe checks covered WCAG 2 A/AA, 2.1 AA and 2.2 AA tags on all twelve routes in
  both themes. Manual work included reading order, visible focus, skip behavior,
  keyboard traversal, image meaning, dark-mode surfaces and clear link actions.
- 200% text sizing was checked at 320px. The header wraps, imagery no longer
  transfers a forced minimum width through aspect-ratio, and long controls wrap.
- No modals or forms exist; modal focus, field errors and form labels therefore
  have no applicable interaction to test.

Zero automated violations is not a claim of full WCAG conformance. A physical
screen-reader session, browser/OS matrix and field-user research were not run.
Automated contrast results marked incomplete were reviewed against the actual
theme surfaces and logo/image roles rather than treated as passing evidence.

## Visitor journeys

| Journey | Result | Evidence or limitation |
|---|---|---|
| A: proposition → projects | Pass | Test follows the home CTA to four public cases |
| B: recruiter → experience/education/CV | Partial by source availability | Education and professional overview found; CV/timeline absence is explicit; no document invented |
| C: project → architecture/results | Pass | Flow, results, limitations and public repository checked |
| D: 320px visitor → contact | Pass | Visible header navigation reaches the GitHub channel |
| E: keyboard only | Pass | Skip to main, header traversal, theme and native filter selection tested |

Additional tests cover combined and empty filter results, theme across reloads,
system dark preference, blocked storage, reduced motion, no-JavaScript navigation,
Portuguese content and 404 recovery. See `tests/visitor.spec.ts`.
