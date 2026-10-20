import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const phase = process.argv[2] || "final";
const base = process.env.AUDIT_URL || "http://127.0.0.1:4322";
const dir = `audit-artifacts/${phase}`;
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/lib/chromium/chromium", args: ["--no-sandbox"] });
const routes = ["/", "/about/", "/expertise/", "/contact/", "/projects/", "/projects/obs-eye-contact/", "/projects/editor-inteligente-video/", "/projects/yeti-voice/", "/projects/cor-contritum/", "/projects/dem-drainage/", "/writing/", "/pt-br/", "/404.html"];
const widths = [320, 375, 390, 768, 860, 1024, 1440, 1920];
const result = { phase, commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(), date: new Date().toISOString(), routes: [], matrix: [], errors: [], brokenLinks: [], externalRequests: [] };
const context = await browser.newContext();
const page = await context.newPage();
page.on("pageerror", error => result.errors.push(error.message));
page.on("console", message => { if (message.type() === "error") result.errors.push(message.text()); });
page.on("requestfailed", request => result.errors.push(`${request.url()}: ${request.failure()?.errorText}`));
page.on("request", request => { if (!request.url().startsWith(base) && !request.url().startsWith("data:")) result.externalRequests.push(request.url()); });
const links = new Set();
try {
  for (const theme of ["light", "dark"]) {
    await context.addInitScript(value => localStorage.setItem("theme", value), theme);
    for (const route of routes) {
      const response = await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      const name = route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "");
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      result.routes.push({ route, theme, status: response.status(), violations: axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), incomplete: axe.incomplete.map(v => v.id) });
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, h1: document.querySelectorAll("h1").length, brokenImages: [...document.images].filter(img => getComputedStyle(img).display !== "none" && !img.complete || img.complete && img.naturalWidth === 0).map(img => img.getAttribute("src")) }));
        result.matrix.push({ route, theme, width, ...geometry });
        if (width === 390 || width === 1440) await page.screenshot({ path: `${dir}/${name}-${theme}-${width}.png`, fullPage: true });
      }
      (await page.locator("a[href]").evaluateAll(els => els.map(el => el.getAttribute("href")))).forEach(href => links.add(href));
    }
  }
  for (const href of links) {
    if (!href.startsWith("/")) continue;
    const [path, fragment] = href.split("#");
    const response = await context.request.get(base + path);
    if (response.status() >= 400) result.brokenLinks.push({ href, status: response.status() });
    if (fragment) {
      await page.goto(base + path);
      if (!await page.locator(`[id="${fragment}"]`).count()) result.brokenLinks.push({ href, reason: "missing anchor" });
    }
  }
} finally {
  result.errors = [...new Set(result.errors)];
  result.externalRequests = [...new Set(result.externalRequests)];
  await writeFile(`${dir}/results.json`, JSON.stringify(result, null, 2));
  await browser.close();
}
const summary = { phase, pagesAndThemes: result.routes.length, viewportChecks: result.matrix.length, overflow: result.matrix.filter(r => r.overflow).length, brokenImages: result.matrix.filter(r => r.brokenImages.length).length, axeViolations: result.routes.reduce((n, r) => n + r.violations.length, 0), errors: result.errors.length, brokenLinks: result.brokenLinks.length, externalRequests: result.externalRequests.length };
console.log(JSON.stringify(summary, null, 2));
if (phase === "final" && (summary.overflow || summary.brokenImages || summary.axeViolations || summary.errors || summary.brokenLinks || summary.externalRequests)) process.exitCode = 1;
