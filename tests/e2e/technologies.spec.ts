import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Technologies / TechStack Section', () => {
  test('renders section heading, canvas particle stage mount point, and 3 category columns', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Technologies"]');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText(/Technologies/i);

    // Verify canvas particle stage div exists for future WebGL mounting
    const canvasStage = section.locator('#canvas-particle-stage');
    await expect(canvasStage).toBeAttached();

    // Verify 3 categories
    const categories = section.locator('h3');
    await expect(categories).toHaveCount(3);
    await expect(categories.nth(0)).toContainText(/Frontend/i);
    await expect(categories.nth(1)).toContainText(/Backend & DevOps/i);
    await expect(categories.nth(2)).toContainText(/AI Engineering/i);
  });

  test('no horizontal scroll at 375px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const section = page.locator('section[aria-label="Technologies"]');
    await expect(section).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Technologies"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
