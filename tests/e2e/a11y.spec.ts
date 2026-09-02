import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/blog', '/blog/visualizing-with-antigravity']) {
  test(`has no serious accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const seriousOrCritical = results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
    expect(seriousOrCritical).toEqual([]);
  });
}
