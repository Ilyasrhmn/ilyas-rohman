import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3000";
const executablePath =
  process.env.PLAYWRIGHT_CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ headless: true, executablePath });

try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });

  assert.equal(await page.locator("[data-certificate-gallery]").count(), 1);
  assert.equal(await page.locator("[data-certificate-card]").count(), 11);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);

  await page.locator("[data-certificate-card]").first().click();
  await page.waitForURL(/\?cert=/);
  assert.equal(await page.locator('[role="dialog"]').count(), 1);
  assert.equal(await page.locator("[data-certificate-detail-image]").count(), 1);
  assert.equal(await page.getByText("What it covered").count(), 1);
  await page.keyboard.press("Escape");
  await page.waitForURL((url) => !url.searchParams.has("cert"));
  await page.waitForTimeout(150);
  assert.equal(await page.locator('[role="dialog"]').count(), 0);

  await page.goto(`${baseUrl}/achievements?cert=problem-solving-basic`, { waitUntil: "networkidle" });
  assert.equal(await page.locator('[role="dialog"]').count(), 1);
  assert.equal(await page.getByText("Problem Solving (Basic) Certificate").count() > 0, true);
  await page.keyboard.press("Escape");
  await page.waitForURL((url) => !url.searchParams.has("cert"));

  for (const viewport of [{ width: 320, height: 700 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseUrl}/achievements`, { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    await page.locator("[data-certificate-card]").last().scrollIntoViewIfNeeded();
    assert.equal(await page.getByText("That's the whole shelf.").count(), 1);
    assert.equal(await page.getByRole("button", { name: /back to top/i }).count(), 1);
  }

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
