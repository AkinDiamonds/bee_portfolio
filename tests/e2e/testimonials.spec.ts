import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Testimonials Section', () => {
  test('renders section label and first testimonial quote', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Testimonials"]');
    await expect(section).toBeVisible();

    // Section label is present (aria-hidden but in DOM)
    const label = section.locator('p[aria-hidden="true"]');
    await expect(label).toContainText(/nice things great persons said about me/i);

    // First blockquote is visible
    const quote = section.locator('blockquote');
    await expect(quote).toBeVisible();
    await expect(quote).not.toBeEmpty();
  });

  test('avatar track has correct number of buttons and navigates quotes', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Testimonials"]');
    const avatarBtns = section.locator('[role="tab"]');

    // Should have 3 testimonials
    await expect(avatarBtns).toHaveCount(3);

    // First avatar is selected
    const firstBtn = avatarBtns.nth(0);
    await expect(firstBtn).toHaveAttribute('aria-selected', 'true');

    // Click second avatar and verify selection changes
    const secondBtn = avatarBtns.nth(1);
    await secondBtn.click();
    await page.waitForTimeout(300);
    await expect(secondBtn).toHaveAttribute('aria-selected', 'true');
    await expect(firstBtn).toHaveAttribute('aria-selected', 'false');
  });

  test('is keyboard navigable — avatar buttons are focusable and activatable', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Testimonials"]');
    const secondBtn = section.locator('[role="tab"]').nth(1);

    await secondBtn.focus();
    await expect(secondBtn).toBeFocused();
    await secondBtn.press('Enter');
    await page.waitForTimeout(300);
    await expect(secondBtn).toHaveAttribute('aria-selected', 'true');
  });

  test('no horizontal scroll at 375px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const section = page.locator('section[aria-label="Testimonials"]');
    await expect(section).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Testimonials"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
