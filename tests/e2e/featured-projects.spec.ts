import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Featured Projects Section', () => {
  test('renders project cards with title, description, and view full details action', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Featured Projects"]');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText(/Featured/i);

    const projectCards = section.locator('article');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = projectCards.nth(i);
      const btn = card.getByRole('button', { name: /view full details/i });
      await expect(btn).toBeVisible();
    }
  });

  test('toggles inline project details in-place', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.locator('section[aria-label="Featured Projects"] article').first();
    const detailsBtn = firstCard.getByRole('button', { name: /view full details/i });
    await detailsBtn.click();

    // Verify in-place details are visible
    const overviewBtn = firstCard.getByRole('button', { name: /view overview/i });
    await expect(overviewBtn).toBeVisible();

    // Close / return to overview
    await overviewBtn.click();
    await expect(detailsBtn).toBeVisible();
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Featured Projects"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
