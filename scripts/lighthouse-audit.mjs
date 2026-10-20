import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.argv[2] || "final";
const dir = `audit-artifacts/${phase}`;
await mkdir(dir, { recursive: true });
const chrome = await launch({ chromePath: process.env.CHROME_PATH || "/usr/lib/chromium/chromium", chromeFlags: ["--headless", "--no-sandbox", "--disable-extensions"] });
try {
  for (const device of ["mobile", "desktop"]) {
    const options = { port: chrome.port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] };
    const { lhr, report } = await lighthouse(process.env.AUDIT_URL || "http://127.0.0.1:4322/", options, device === "desktop" ? desktopConfig : undefined);
    await writeFile(`${dir}/lighthouse-${device}.json`, report);
    console.log(JSON.stringify({ device, version: lhr.lighthouseVersion, scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])), lcp: lhr.audits["largest-contentful-paint"].numericValue, cls: lhr.audits["cumulative-layout-shift"].numericValue, tbt: lhr.audits["total-blocking-time"].numericValue, bytes: lhr.audits["total-byte-weight"].numericValue }));
  }
} finally { chrome.kill(); }
