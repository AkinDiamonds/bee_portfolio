import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Featured Projects Section', () => {
  test('renders project cards and links to valid case-study routes', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Featured Projects"]');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText('Featured Projects');

    const projectCards = section.locator('article');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = projectCards.nth(i);
      const link = card.getByRole('link', { name: /view case study/i });
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^\/projects\/[a-z0-9-]+$/);

      // Verify navigating to the case study route returns HTTP 200 (not 404)
      const response = await page.request.get(href!);
      expect(response.status()).toBe(200);
    }
  });

  test('navigates to case study page successfully', async ({ page }) => {
    await page.goto('/');
    const firstProjectLink = page
      .locator('section[aria-label="Featured Projects"] article')
      .first()
      .getByRole('link', { name: /view case study/i });

    await firstProjectLink.click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Featured Projects"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
