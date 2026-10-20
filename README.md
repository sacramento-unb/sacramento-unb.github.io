# Vitor Sacramento portfolio

Static professional portfolio in English, with a Portuguese introduction. The
identity follows the supplied “Coordenadas de síntese” brand system. Four approved
public projects have case studies with architecture, evidence and limitations.

## Stack and setup

Astro 7.4.1, TypeScript 6.0.3, Vite through Astro, modern CSS and sitemap 3.7.4.
Node.js 26 and npm are used for verification. The runtime has no backend, GitHub
API calls, analytics, contact service or private credentials.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

```sh
npm run check
npm run build
npm run test:links
npm test
npm audit --audit-level=high
```

`lint` is an alias for Astro's type/template diagnostics; there is no separate
ESLint configuration. The test suite exercises real visitor journeys, filters,
theme persistence, blocked storage, no-JavaScript navigation, keyboard operation,
Portuguese content, 404 recovery and text scaling. There is no separate unit-test
layer: this site's interactive behavior is small and tested in the browser.

Playwright uses a system Chromium at `/usr/lib/chromium/chromium` when available,
or its installed browser otherwise. Set `CHROME_PATH` to override it. On a fresh
machine, run `npx playwright install --with-deps chromium` before `npm test`.
Tests serve the existing `dist/` at port 4322; rebuild before testing changes.

## Full audit and visual evidence

```sh
node scripts/serve-build.mjs
# In another terminal:
npm run audit:browser
npm run audit:performance
```

The browser audit visits every route in both themes at 320, 375, 390, 768, 860,
1024, 1440 and 1920 pixels. It checks geometry, image loads, runtime errors,
same-site links and axe accessibility rules, and saves full-page screenshots at
390 and 1440 pixels. Lighthouse measures the production home in mobile and
desktop configurations. Set `AUDIT_URL` for another local preview target.

Large reports, traces and screenshots live in ignored `audit-artifacts/` and
`test-results/`. Read `AUDIT_REPORT.md`, `BRAND_CONSISTENCY.md`, `UX_UI_REVIEW.md`
and `docs/qa/summary.json` for measured results and their limitations.

## Structure

```text
src/assets/             original brand key visual, optimized during build
src/data/projects.ts    typed, explicit public project allowlist and case studies
src/layouts/            shared shell, navigation, theme, SEO and social metadata
src/pages/              home, profile, expertise, projects, contact, reading, pt-BR
src/styles/             brand tokens and responsive styles
public/brand/           official logo variants, favicon source and social image
public/fonts/           SIL Open Font License notices for bundled Noto fonts
scripts/               build/link checks, local test server and audit tools
tests/                 visitor journeys with Playwright
.github/workflows/     quality checks and manual-only Pages publication
```

Noto Sans Variable is used for headings and interface, Noto Sans Mono for short
metadata, and Noto Serif for longer reading. They are served locally from pinned
Fontsource packages under SIL OFL 1.1. The brand image is an abstract illustration,
not geographic evidence. Astro builds responsive WebP variants from its original
PNG; the original PNG is not copied into the deployed assets.

## Content and maintenance

Edit narratives and diagram steps in `src/data/projects.ts`. Keep implementation,
verified checks and unverified runtime claims distinct. Every project must remain
public and explicitly approved before inclusion. Do not discover or expose the
full GitHub account automatically. Descriptions in About come from the supplied
professional biography; they do not imply specific employment or client contracts.

The Portuguese home is an introduction, not a claim that every page is translated.
Case studies and secondary pages remain in English. Only equivalent home routes
have `hreflang` alternates. No CV file, email, employment chronology or publication
record has been invented to fill missing source material.

## Deployment

Hosting is GitHub Pages at `https://sacramento-unb.github.io/`. This user-site
repository is served at `/`, so no repository-name base path is configured.
`deploy.yml` is manual-only: it checks types, builds and checks links before
uploading the artifact; only the deployment job has Pages/OIDC write permission.
`quality.yml` runs type/build/link, browser tests and dependency checks on PRs or
manual request without deploying.

At the start of this audit the public site was at `a85d45c`; the branding commit
`2fdfd26` and the audit corrections are local reviewable descendants. These new
changes have not been pushed or deployed. Obtain approval for this revision before
publishing it; previous approval targeted `a85d45c`. After approval, publish the
reviewed branch through the normal Git workflow, dispatch Pages on the chosen
ref, then verify the run SHA, public routes and asset loads. Never force-push.

Keep the private modernization control directory and repository clones outside
this public repository. `dist/` is the only publication artifact. Response headers
and cache policy are managed by GitHub Pages; an inert `_headers` file would not
configure them here.
