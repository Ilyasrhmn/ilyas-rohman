import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";
const executablePath =
  process.env.PLAYWRIGHT_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ headless: true, executablePath });

try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2300);

  assert.equal(await page.locator("[data-certificate-gallery]").count(), 1);
  assert.equal(await page.locator("[data-certificate-card]").count(), 11);
  assert.deepEqual(await page.locator("[data-certificate-caption]").allTextContents(), [
    "Inherited Light", "Red Earth Theory", "Soft Sovereignty", "Gathering Weather",
    "Worn Horizon", "The Fifth Fire", "Ancestor Season", "A Field Listening",
    "Language of Dust", "Between Sweetgrass", "Open Country",
  ]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  assert.deepEqual(await page.locator("[data-certificate-slide]").evaluateAll((slides) =>
    slides.slice(0, 4).map((slide) => getComputedStyle(slide).width)), ["290px", "330px", "270px", "450px"].map((width) => Math.min(parseInt(width), 375 * .7) + "px"));
  await mkdir("test-results", { recursive: true });
  await page.locator("[data-certificate-card]").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/achievements-gallery-mobile.png" });

  await page.locator("[data-certificate-card]").first().click();
  await page.waitForURL(/\?cert=/);
  assert.equal(await page.locator('[role="dialog"]').count(), 1);
  assert.equal(await page.locator("[data-certificate-detail-image]").count(), 1);
  await page.waitForTimeout(2600);
  assert.equal(await page.locator('[role="dialog"]').isVisible(), true);
  assert.equal(await page.locator(".certificate-content__title").textContent(), "Inherited Light");
  await page.screenshot({ path: "test-results/achievements-detail-mobile.png" });
  await page.keyboard.press("Escape");
  await page.waitForURL((url) => !url.searchParams.has("cert"));
  await page.locator('[role="dialog"]').waitFor({ state: "detached", timeout: 5000 });
  await page.locator("[data-certificate-card]").first().click();
  await page.waitForURL(/\?cert=/);
  await page.locator(".certificate-content__back").click();
  await page.waitForURL((url) => !url.searchParams.has("cert"));
  await page.locator('[role="dialog"]').waitFor({ state: "detached", timeout: 5000 });
  await page.goBack();
  await page.waitForURL(/\?cert=/);
  assert.equal(await page.locator('[role="dialog"]').isVisible(), true);
  await page.goBack();
  await page.waitForURL((url) => !url.searchParams.has("cert"));
  await page.locator('[role="dialog"]').waitFor({ state: "detached", timeout: 5000 });
  await page.locator("[data-certificate-card]").first().click();
  await page.locator(".certificate-content__back").click();
  await page.locator('[role="dialog"]').waitFor({ state: "detached", timeout: 5000 });
  await page.locator("[data-certificate-card]").first().click();
  await page.waitForTimeout(2400);
  assert.equal(await page.locator('[role="dialog"]').isVisible(), true);
  await page.keyboard.press("Escape");
  await page.locator('[role="dialog"]').waitFor({ state: "detached", timeout: 5000 });

  await page.goto(`${baseUrl}/achievements?cert=problem-solving-basic`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('[role="dialog"]').count(), 1);
  assert.equal(await page.locator('[role="dialog"]').isVisible(), true);
  assert.equal(await page.locator('[role="dialog"] img').getAttribute("alt"), "Problem Solving (Basic) Certificate certificate from HackerRank");
  await page.keyboard.press("Escape");
  await page.waitForURL((url) => !url.searchParams.has("cert"));

  for (const viewport of [{ width: 320, height: 700 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2300);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.locator("[data-certificate-card]").last().scrollIntoViewIfNeeded();
    await page.getByText("That's the whole shelf.").scrollIntoViewIfNeeded();
    assert.equal(await page.getByText("That's the whole shelf.").isVisible(), true);
    if (viewport.width === 1440) {
      assert.deepEqual(await page.locator("[data-certificate-slide]").evaluateAll((slides) =>
        slides.slice(0, 4).map((slide) => getComputedStyle(slide).width)), ["290px", "330px", "270px", "450px"]);
      await page.locator("[data-certificate-card]").first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "test-results/achievements-gallery-desktop.png" });
      await page.locator("[data-certificate-card]").first().click();
      await page.waitForTimeout(2600);
      await page.screenshot({ path: "test-results/achievements-detail-desktop.png" });
      await page.keyboard.press("Escape");
      await page.locator('[role="dialog"]').waitFor({ state: "detached" });
    }
    assert.equal(await page.getByText("That's the whole shelf.").count(), 1);
    assert.equal(await page.getByRole("button", { name: /back to top/i }).count(), 1);
  }
  assert.deepEqual(errors, []);

  const reducedPage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await reducedPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedPage.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
  await reducedPage.locator("[data-certificate-card]").first().click();
  await reducedPage.waitForURL(/\?cert=/);
  assert.equal(await reducedPage.locator("[data-certificate-flight]").count(), 0);
  await reducedPage.close();

  await page.close();
  console.log("Achievements gallery QA passed");
} finally {
  await browser.close();
}
