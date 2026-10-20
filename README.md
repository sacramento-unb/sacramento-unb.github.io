# Vitor Sacramento portfolio

Local Astro source for the proposed `sacramento-unb.github.io` portfolio.

## Local verification

```bash
npm ci
npm run check
npm run build
```

`src/data/projects.ts` is the publication allowlist. It contains four public
projects approved by the owner; each case study preserves the audited
limitations and experimental status of the implementation.

## Publication boundary

The GitHub Pages workflow is manual-only. Do not create the remote repository,
push this source, enable Pages or run the workflow without explicit approval.
The private `github-modernization` control directory must never be copied into
the public repository.
