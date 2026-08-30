import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Hero Section', () => {
  test('renders name and static role line accurately', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('section[aria-label="Hero Introduction"]');
    await expect(heroSection).toBeVisible();

    const nameHeading = heroSection.locator('h1');
    await expect(nameHeading).toBeVisible();
    await expect(nameHeading).toContainText('TODO: Firstname Lastname');

    const roleLine = heroSection.locator('p');
    await expect(roleLine).toBeVisible();
    await expect(roleLine).toContainText('TODO: Software Engineer');
  });

  test('has no layout shift on load', async ({ page }) => {
    await page.goto('/');

    // Evaluate Cumulative Layout Shift score
    const clsScore = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutEntry = entry as unknown as { hadRecentInput?: boolean; value?: number };
            if (!layoutEntry.hadRecentInput && typeof layoutEntry.value === 'number') {
              cls += layoutEntry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 500);
      });
    });

    expect(clsScore).toBeLessThan(0.1);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Hero Introduction"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
