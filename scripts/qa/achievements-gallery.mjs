import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";
const executablePath =
  process.env.PLAYWRIGHT_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ headless: true, executablePath });

async function assertHeroAlignedWithFirstCertificate(page) {
  const distance = await page.evaluate(() => {
    const hero = document.querySelector("[data-achievements-hero-content]");
    const certificate = document.querySelector("[data-certificate-image]");
    return Math.abs(hero.getBoundingClientRect().left - certificate.getBoundingClientRect().left);
  });
  assert.equal(distance < 7, true, `Hero and first certificate differ by ${distance.toFixed(1)}px`);
}

try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2300);

  assert.equal(await page.locator("[data-certificate-gallery]").count(), 1);
  assert.equal(await page.locator("[data-certificate-card]").count(), 11);
  assert.equal(await page.evaluate(() => {
    const hero = document.querySelector("h1")?.closest("section");
    const gallery = document.querySelector("[data-certificate-gallery]")?.closest("section");
    const threshold = document.querySelector("[data-achievements-threshold]");
    return Boolean(hero && gallery && threshold &&
      (hero.compareDocumentPosition(gallery) & Node.DOCUMENT_POSITION_FOLLOWING) &&
      (gallery.compareDocumentPosition(threshold) & Node.DOCUMENT_POSITION_FOLLOWING));
  }), true);
  assert.deepEqual(await page.locator("[data-certificate-caption]").allTextContents(), [
    "Inherited Light", "Red Earth Theory", "Soft Sovereignty", "Gathering Weather",
    "Worn Horizon", "The Fifth Fire", "Ancestor Season", "A Field Listening",
    "Language of Dust", "Between Sweetgrass", "Open Country",
  ]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
  await assertHeroAlignedWithFirstCertificate(page);
  assert.deepEqual(await page.locator("[data-certificate-slide]").evaluateAll((slides) =>
    slides.slice(0, 4).map((slide) => Math.round(slide.getBoundingClientRect().width / innerWidth * 100))), [80, 85, 74, 84]);
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
  assert.equal(await page.locator(".certificate-content__verify").textContent(), "Verify Belajar Dasar Pemrograman JavaScript ↗");
  assert.equal(await page.locator(".certificate-content").evaluate((el) => getComputedStyle(el).backgroundColor),
    await page.locator("[data-certificate-gallery]").evaluate((el) => getComputedStyle(el.closest("section")).backgroundColor));
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

  for (const viewport of [
    { width: 320, height: 700 }, { width: 768, height: 1024 },
    { width: 1024, height: 768 }, { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2300);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await assertHeroAlignedWithFirstCertificate(page);
    if (viewport.width === 1440) {
      await page.screenshot({ path: "test-results/achievements-hero-aligned-desktop.png" });
    }
    await page.locator("[data-certificate-card]").last().scrollIntoViewIfNeeded();
    await page.getByText("That's the whole shelf.").scrollIntoViewIfNeeded();
    assert.equal(await page.getByText("That's the whole shelf.").isVisible(), true);
    assert.equal(await page.getByText("Everything below is the full list, ordered by track.").count(), 0);
    if (viewport.width === 1440) {
      await page.locator("[data-achievements-threshold]").evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(1100);
      const lightColor = await page.locator("[data-achievements-threshold] > div").evaluate((el) => getComputedStyle(el).backgroundColor);
      await page.locator("[data-achievements-threshold]").evaluate((el) => el.scrollIntoView({ block: "end" }));
      await page.waitForTimeout(1100);
      const darkColor = await page.locator("[data-achievements-threshold] > div").evaluate((el) => getComputedStyle(el).backgroundColor);
      const brightness = (color) => color.match(/\d+/g).slice(0, 3).map(Number).reduce((a, b) => a + b, 0);
      assert.equal(brightness(lightColor) > brightness(darkColor) + 300, true);
      assert.equal(await page.locator("body").getAttribute("data-nav-theme"), "world-a");
      await page.screenshot({ path: "test-results/achievements-closing-desktop.png" });
    }
    if (viewport.width === 1440) {
      const widths = await page.locator("[data-certificate-slide]").evaluateAll((slides) =>
        slides.map((slide) => slide.getBoundingClientRect().width));
      assert.equal(Math.min(...widths) >= 340, true);
      assert.equal(Math.max(...widths) - Math.min(...widths) > 180, true);
      await page.locator("[data-certificate-card]").first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.screenshot({ path: "test-results/achievements-gallery-desktop.png" });
      await page.locator("[data-certificate-card]").first().click();
      await page.waitForTimeout(2600);
      assert.equal(await page.locator(".certificate-content__title").evaluate((el) => el.getBoundingClientRect().top < innerHeight * .55), true);
      await page.screenshot({ path: "test-results/achievements-detail-desktop.png" });
      await page.keyboard.press("Escape");
      await page.locator('[role="dialog"]').waitFor({ state: "detached" });
    }
    assert.equal(await page.getByText("That's the whole shelf.").count(), 1);
    assert.equal(await page.locator("footer").evaluate((el) => getComputedStyle(el).backgroundColor), "rgb(16, 22, 18)");
    assert.equal(await page.getByRole("button", { name: /back to top/i }).count(), 1);
  }
  assert.deepEqual(errors, []);

  const reducedPage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await reducedPage.emulateMedia({ reducedMotion: "reduce" });
  await reducedPage.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
  assert.equal(await reducedPage.locator("body").getAttribute("data-nav-theme"), "world-b");
  await reducedPage.locator("[data-certificate-card]").first().click();
  await reducedPage.waitForURL(/\?cert=/);
  assert.equal(await reducedPage.locator("[data-certificate-flight]").count(), 0);
  await reducedPage.keyboard.press("Escape");
  await reducedPage.locator("[data-achievements-threshold]").evaluate((el) => el.scrollIntoView({ block: "start" }));
  await reducedPage.waitForTimeout(200);
  assert.equal(await reducedPage.locator("body").getAttribute("data-nav-theme"), "world-a");
  await reducedPage.close();

  await page.close();
  console.log("Achievements gallery QA passed");
} finally {
  await browser.close();
}
