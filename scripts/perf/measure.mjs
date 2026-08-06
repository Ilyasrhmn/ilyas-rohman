// Repeatable mobile performance measurement.
// Run: npm run perf   (requires `npm run dev` on :3000 in another terminal)
// Playwright is installed on demand and never added to package.json.
import { chromium } from "playwright";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.PERF_BASE || "http://localhost:3000";
const THROTTLE = Number(process.env.PERF_THROTTLE || 4);
const FPS_FLOOR = Number(process.env.PERF_FPS_FLOOR || 45);

const MOBILE = {
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

const FRAME_PROBE = () => {
  window.__frames = [];
  let last = performance.now();
  const loop = () => {
    const now = performance.now();
    window.__frames.push(now - last);
    last = now;
    window.__raf = requestAnimationFrame(loop);
  };
  window.__raf = requestAnimationFrame(loop);
};

const FRAME_STATS = () => {
  cancelAnimationFrame(window.__raf);
  const f = window.__frames.slice(5);
  if (!f.length) return null;
  const sorted = [...f].sort((a, b) => a - b);
  const over = (ms) => f.filter((d) => d > ms).length;
  return {
    avgFps: +(1000 / (f.reduce((a, b) => a + b, 0) / f.length)).toFixed(1),
    p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
    worstMs: +Math.max(...f).toFixed(1),
    jankPct: +((over(32) / f.length) * 100).toFixed(1),
  };
};

const PAGE_STATS = () => {
  const de = document.documentElement;
  const res = performance.getEntriesByType("resource");
  const sum = (list) => Math.round(list.reduce((a, r) => a + (r.transferSize || 0), 0) / 1024);
  const smallTap = [];
  for (const el of document.querySelectorAll("a, button")) {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && (r.height < 44 || r.width < 44)) {
      smallTap.push(`${el.tagName}:${(el.textContent || "").trim().slice(0, 18)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }
  return {
    overflowX: de.scrollWidth - de.clientWidth,
    totalKB: sum(res),
    jsKB: sum(res.filter((r) => r.name.endsWith(".js"))),
    imgKB: sum(res.filter((r) => /\.(png|jpe?g|webp|avif|svg)/.test(r.name))),
    requests: res.length,
    smallTapCount: smallTap.length,
    smallTap: smallTap.slice(0, 8),
  };
};

async function openMobile(browser, route, throttle) {
  const ctx = await browser.newContext(MOBILE);
  const page = await ctx.newPage();
  if (throttle > 1) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: throttle });
  }
  await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  return { ctx, page };
}

async function scrollRun(page, ticks = 25, step = 220) {
  await page.evaluate(FRAME_PROBE);
  for (let i = 0; i < ticks; i++) {
    await page.evaluate((s) => window.scrollBy(0, s), step);
    await page.waitForTimeout(100);
  }
  return page.evaluate(FRAME_STATS);
}

async function idleRun(page, ms = 3000) {
  await page.evaluate(FRAME_PROBE);
  await page.waitForTimeout(ms);
  return page.evaluate(FRAME_STATS);
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const rows = [];
let homeScrollFps = null;

for (const route of ["/", "/projects", "/achievements"]) {
  const { ctx, page } = await openMobile(browser, route, THROTTLE);
  const page_ = await page.evaluate(PAGE_STATS);
  const scroll = await scrollRun(page);
  rows.push({ route, mode: `scroll ${THROTTLE}x`, ...scroll, ...page_ });
  if (route === "/") homeScrollFps = scroll.avgFps;
  await ctx.close();
}

{
  const { ctx, page } = await openMobile(browser, "/", THROTTLE);
  const idle = await idleRun(page);
  rows.push({ route: "/", mode: `idle ${THROTTLE}x`, ...idle });
  await ctx.close();
}

await browser.close();

console.table(
  rows.map((r) => ({
    route: r.route,
    mode: r.mode,
    fps: r.avgFps,
    "jank%": r.jankPct,
    p95ms: r.p95Ms,
    worstms: r.worstMs,
    totalKB: r.totalKB ?? "",
    jsKB: r.jsKB ?? "",
    overflowX: r.overflowX ?? "",
    smallTaps: r.smallTapCount ?? "",
  }))
);

for (const r of rows) {
  if (r.smallTap?.length) {
    console.log(`\nTap targets under 44px on ${r.route}:`);
    for (const t of r.smallTap) console.log("  - " + t);
  }
}

if (homeScrollFps !== null && homeScrollFps < FPS_FLOOR) {
  console.error(`\nFAIL: home scroll ${homeScrollFps} fps is below the ${FPS_FLOOR} fps floor.`);
  process.exit(1);
}
console.log(`\nPASS: home scroll ${homeScrollFps} fps meets the ${FPS_FLOOR} fps floor.`);
