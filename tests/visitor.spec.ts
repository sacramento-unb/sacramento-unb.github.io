import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("A: positioning leads to the project selection", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("applied intelligence");
  await page.getByRole("link", { name: "Explore projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator(".project-card")).toHaveCount(5);
  await expect(page.locator('.site-header a[aria-current="page"]')).toHaveText("Projects");
});

test("B: recruiter finds verified education and the CV availability boundary", async ({ page }) => {
  await page.goto("/about/");
  await page.getByRole("link", { name: "Professional overview" }).click();
  await expect(page.locator("#profile")).toContainText("Universidade de Brasília");
  await expect(page.getByRole("heading", { name: "Experience and approach" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Professional contact and CV" })).toBeVisible();
  await expect(page.locator(".prose")).toContainText("downloadable CV, employment timeline and enrollment dates are not published");
});

test("C: technical visitor opens an architecture and its evidence", async ({ page }) => {
  await page.goto("/projects/");
  await page.getByRole("link", { name: "OBS Eye Contact", exact: true }).click();
  await expect(page.locator(".flow li")).toHaveCount(4);
  await page.getByRole("link", { name: "Results", exact: true }).click();
  await expect(page.locator("#results + p")).toContainText("Five unit tests passed");
  await expect(page.locator("#limits + p")).toContainText("hardware");
  await expect(page.locator(".case-meta a")).toHaveAttribute("href", "https://github.com/sacramento-unb/obs-eye-contact");
});

test("D: contact remains reachable at the narrowest mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.locator(".site-header").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.getByRole("link", { name: "View my GitHub profile" })).toHaveAttribute("href", "https://github.com/sacramento-unb");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("E: skip link, navigation, theme and filters work with keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.goto("/projects/");
  await page.keyboard.press("Tab"); // skip
  await page.keyboard.press("Tab"); // brand
  await page.keyboard.press("Tab"); // Projects
  await expect(page.locator('.site-header a[href="/projects/"]')).toBeFocused();
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Dark theme" })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Dark theme" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Domain", { exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("1 project");
});

test("combined filters, no results and reset affect visible cards", async ({ page }) => {
  await page.goto("/projects/");
  await page.getByLabel("Technology", { exact: true }).selectOption("Python");
  await expect(page.locator(".project-card:visible")).toHaveCount(3);
  await page.getByLabel("Domain", { exact: true }).selectOption("ai");
  await expect(page.locator(".project-card:visible")).toHaveCount(1);
  await page.getByLabel("Technology", { exact: true }).selectOption("Rust");
  await expect(page.locator(".project-card:visible")).toHaveCount(0);
  await expect(page.locator("#no-projects")).toBeVisible();
  await page.getByLabel("Domain", { exact: true }).selectOption("all");
  await page.getByLabel("Technology", { exact: true }).selectOption("all");
  await expect(page.locator(".project-card:visible")).toHaveCount(5);
});

test("theme persists, and storage restrictions do not break interaction", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Dark theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage disabled"); } }); });
  await page.reload();
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("system preference and reduced motion are respected", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});

test("without JavaScript the whole catalogue and navigation remain available", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4322/projects/");
  await expect(page.locator(".project-card:visible")).toHaveCount(5);
  await expect(page.locator("[data-filter-controls]")).toBeHidden();
  await expect(page.locator(".theme-toggle")).toBeHidden();
  await page.locator(".site-header").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("real question");
  await context.close();
});

test("Portuguese introduction provides real content and honest English destinations", async ({ page }) => {
  await page.goto("/pt-br/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByRole("link", { name: "Conhecer os projetos" }).click();
  await expect(page.locator("#projetos .work-row")).toHaveCount(5);
  await expect(page.locator("#projetos")).toContainText("estudos de caso completos estão em inglês");
});

test("404 is not indexed and recovery works", async ({ page }) => {
  const missing = await page.goto("/missing-page/");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This coordinate has no page");
  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await page.getByRole("link", { name: "Back home" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4322/");
});

test("200% text sizing at 320px does not hide content or create horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await page.addStyleTag({ content: "html {font-size: 200%}" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test("automated accessibility gate includes WCAG 2.2 tags", async ({ page }) => {
  await page.goto("/projects/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});
