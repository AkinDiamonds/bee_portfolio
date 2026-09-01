import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Work Experience Section', () => {
  test('renders section heading and all experience rows', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Work Experience"]');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText(/Work Experience/i);

    const items = section.locator('ul[role="list"] > li');
    await expect(items).toHaveCount(5);

    // Verify first row content
    const firstRow = items.first();
    await expect(firstRow).toContainText('Amazon');
    await expect(firstRow).toContainText('Design and research');
    await expect(firstRow).toContainText('2020 — 2024');

    // Verify single-year item format
    const stanfordRow = items.nth(2);
    await expect(stanfordRow).toContainText('Stanford University');
    await expect(stanfordRow).toContainText('Exploring internet patterns for neurodiversity');
    await expect(stanfordRow).toContainText('2018');
  });

  test('renders properly at mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const section = page.locator('section[aria-label="Work Experience"]');
    await expect(section).toBeVisible();

    const items = section.locator('ul[role="list"] > li');
    await expect(items).toHaveCount(5);

    // Ensure no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Work Experience"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
