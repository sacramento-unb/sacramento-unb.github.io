import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve("dist");
async function files(path) {
  return (await Promise.all((await readdir(path, { withFileTypes: true })).map(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : resolve(path, entry.name)))).flat();
}
const htmlFiles = (await files(root)).filter(path => path.endsWith(".html"));
assert.equal(htmlFiles.length, 13, "Expected thirteen static pages");
const titles = new Set();
let references = 0;
for (const path of htmlFiles) {
  const html = await readFile(path, "utf8");
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: exactly one h1`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), `${path}: unique nonempty title`);
  titles.add(title);
  for (const name of ["description", "twitter:card"]) assert.match(html, new RegExp(`<meta name="${name}" content="[^"]+"`));
  assert.match(html, /<link rel="canonical" href="https:\/\/sacramento-unb.github.io\//);
  assert.match(html, /<meta property="og:image" content="https:\/\/sacramento-unb.github.io\/brand\/social-card.png"/);
  assert.doesNotMatch(html, /gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|\/home\/vitor\/|localhost|127\.0\.0\.1/);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1], `https://sacramento-unb.github.io/${path.slice(root.length + 1).replace(/index\.html$/, "")}`);
    if (url.origin !== "https://sacramento-unb.github.io") continue;
    let target = resolve(root, "." + url.pathname);
    try { if ((await stat(target)).isDirectory()) target = resolve(target, "index.html"); } catch {}
    assert.ok((await stat(target)).isFile(), `${path}: missing ${url.pathname}`);
    if (url.hash) {
      const linked = await readFile(target, "utf8");
      assert.ok(linked.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `missing anchor ${url.hash}`);
    }
    references++;
  }
}
const sitemap = await readFile(resolve(root, "sitemap-0.xml"), "utf8");
assert.ok(!sitemap.includes("404.html"), "404 must not be in sitemap");
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 12);
assert.match(await readFile(resolve(root, "robots.txt"), "utf8"), /Sitemap: https:\/\/sacramento-unb.github.io\/sitemap-index.xml/);
console.log(`${htmlFiles.length} pages: unique SEO metadata, structured local links/assets/anchors (${references} references), sitemap and public-bundle checks passed.`);
