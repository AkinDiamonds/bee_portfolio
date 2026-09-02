import { expect, test } from '@playwright/test';

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

for (const route of ['/', '/blog', '/blog/visualizing-with-antigravity']) {
  for (const viewport of viewports) {
    test(`${route} has no horizontal overflow or console errors at ${viewport.width}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.setViewportSize(viewport);
      await page.goto(route);
      expect(errors).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1);
    });
  }
}
