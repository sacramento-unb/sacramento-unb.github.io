# Vitor Sacramento portfolio

Astro source for the `sacramento-unb.github.io` portfolio.

The public baseline is deployed from `af15453`. The current editorial revision
is prepared locally and continues from that history; it is not published until
the owner approves the new visual version.

## Local verification

```bash
npm ci
npm run check
npm run build
```

`src/data/projects.ts` is the publication allowlist. It contains four public
projects approved by the owner; each case study preserves the audited
limitations and experimental status of the implementation.

The visual system in `public/brand/` uses the approved Vitor Sacramento branding
kit: official symbol variants, favicon and the territory-to-data key visual.

## Publication boundary

The GitHub Pages workflow is manual-only. Publishing a new revision requires an
explicit owner approval followed by a reviewed push and a manual workflow run.
The private `github-modernization` control directory must never be copied into
the public repository.
