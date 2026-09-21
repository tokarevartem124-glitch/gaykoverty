import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.VISUAL_BASE_URL || 'http://127.0.0.1:4173/index-v2.html?v=ci';
const outDir = path.resolve('visual-checks/latest');
fs.mkdirSync(outDir, { recursive: true });

const report = {
  url: base,
  generatedAt: new Date().toISOString(),
  gitSha: process.env.GITHUB_SHA || null,
  checks: [],
  consoleErrors: [],
  pageErrors: [],
  failedRequests: []
};

const browser = await chromium.launch({ headless: true });

async function runProfile(name, viewport, isMobile = false) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    isMobile,
    reducedMotion: 'no-preference'
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') report.consoleErrors.push({ profile: name, text: msg.text() });
  });
  page.on('pageerror', err => report.pageErrors.push({ profile: name, text: err.message }));
  page.on('requestfailed', req => {
    const failure = req.failure();
    report.failedRequests.push({ profile: name, url: req.url(), error: failure?.errorText || 'request failed' });
  });

  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1800);

  const required = [
    ['header', '.site-header'],
    ['hero', '.hero'],
    ['selector', '#selector'],
    ['catalog', '#catalog'],
    ['product grid', '#productGrid'],
    ['cart button', '#openCart'],
    ['final CTA', '.final-cta']
  ];
  for (const [label, selector] of required) {
    const count = await page.locator(selector).count();
    report.checks.push({ profile: name, check: `exists:${label}`, ok: count > 0 });
  }

  const h1 = page.locator('.hero h1');
  report.checks.push({
    profile: name,
    check: 'hero heading visible',
    ok: await h1.isVisible().catch(() => false)
  });

  const products = page.locator('#productGrid .product');
  await page.waitForTimeout(600);
  report.checks.push({
    profile: name,
    check: 'catalog rendered products',
    ok: (await products.count()) > 0,
    value: await products.count()
  });

  // Capture the real first screen before Playwright auto-scrolls to interactive controls.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, `${name}-hero.png`), fullPage: false });

  // Warm all reveal animations and capture the page in its normal initial state.
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += Math.max(500, Math.floor(viewport.height * 0.8))) {
    await page.evaluate(yPos => window.scrollTo({ top: yPos, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true });

  report.checks.push({
    profile: name,
    check: 'no horizontal overflow',
    ok: await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2),
    value: await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))
  });

  // Functional smoke tests happen after screenshots, so they cannot alter visual baselines.
  const cartButton = page.locator('#openCart');
  if (await cartButton.count()) {
    await cartButton.click();
    await page.waitForTimeout(250);
    const drawerVisible = await page.locator('.drawer.open,.cart-drawer.open,#cartDrawer.open').count();
    report.checks.push({ profile: name, check: 'cart opens', ok: drawerVisible > 0 });
    await page.keyboard.press('Escape').catch(() => {});
  }

  const firstChoice = page.locator('#choices .choice').first();
  if (await firstChoice.count()) {
    await firstChoice.click();
    const next = page.locator('#nextStep');
    if (await next.isEnabled().catch(() => false)) {
      await next.click();
      await page.waitForTimeout(200);
      const step = (await page.locator('#stepNo').textContent())?.trim();
      report.checks.push({ profile: name, check: 'selector advances', ok: step === '02', value: step || null });
    } else {
      report.checks.push({ profile: name, check: 'selector advances', ok: false, value: 'next disabled' });
    }
  }

  await context.close();
}

try {
  await runProfile('desktop', { width: 1440, height: 1000 });
  await runProfile('mobile', { width: 390, height: 844 }, true);
} finally {
  await browser.close();
}

const ignorableRequest = item => /fonts\.googleapis\.com|fonts\.gstatic\.com|respotec\.ru/.test(item.url);
const relevantFailedRequests = report.failedRequests.filter(x => !ignorableRequest(x));
const failedChecks = report.checks.filter(x => !x.ok);
report.summary = {
  totalChecks: report.checks.length,
  failedChecks: failedChecks.length,
  consoleErrors: report.consoleErrors.length,
  pageErrors: report.pageErrors.length,
  relevantFailedRequests: relevantFailedRequests.length,
  passed: failedChecks.length === 0 && report.pageErrors.length === 0 && report.consoleErrors.length === 0 && relevantFailedRequests.length === 0
};
report.relevantFailedRequests = relevantFailedRequests;

fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, 'README.md'), `# Latest visual check\n\nGenerated: ${report.generatedAt}\n\nCommit: \`${report.gitSha || 'local'}\`\n\nStatus: **${report.summary.passed ? 'PASS' : 'FAIL'}**\n\n- Checks: ${report.summary.totalChecks}\n- Failed checks: ${report.summary.failedChecks}\n- Console errors: ${report.summary.consoleErrors}\n- Page errors: ${report.summary.pageErrors}\n- Relevant failed requests: ${report.summary.relevantFailedRequests}\n\nArtifacts: \`desktop-hero.png\`, \`desktop-full.png\`, \`mobile-hero.png\`, \`mobile-full.png\`.\n`);

console.log(JSON.stringify(report.summary, null, 2));
if (!report.summary.passed) process.exitCode = 1;
