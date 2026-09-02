import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Testimonials Section', () => {
  test('renders section label and first testimonial quote', async ({ page }) => {
    await page.goto('/');

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    const section = page.locator('section[aria-label="Testimonials"]');
    await expect(section).toBeVisible();

    const label = section.locator('p').first();
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

    const trackMetrics = await page.evaluate(() => {
      const track = document.querySelector('section[aria-label="Testimonials"] [role="tablist"]') as HTMLElement | null;
      const active = document.querySelector('section[aria-label="Testimonials"] [role="tab"][aria-selected="true"]') as HTMLElement | null;
      if (!track || !active) return null;

      const trackRect = track.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      return {
        trackCenter: trackRect.left + trackRect.width / 2,
        activeCenter: activeRect.left + activeRect.width / 2,
      };
    });

    expect(trackMetrics).not.toBeNull();
    expect(Math.abs(trackMetrics!.activeCenter - trackMetrics!.trackCenter)).toBeLessThan(24);
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

  test('moves one testimonial at a time and wraps with arrow keys without scrolling the page', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section[aria-label="Testimonials"]');
    const firstButton = section.locator('[role="tab"]').first();

    await section.scrollIntoViewIfNeeded();
    await firstButton.focus();
    const scrollPositionBeforeChange = await page.evaluate(() => window.scrollY);
    await firstButton.press('ArrowLeft');
    await expect(section.locator('[role="tab"]').last()).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollPositionBeforeChange);
  });

  test('auto-advances only while the section is visible and pauses when scrolled past', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Testimonials"]');
    await section.scrollIntoViewIfNeeded();

    const getActiveLabel = () => section.locator('[role="tab"][aria-selected="true"]').first().getAttribute('aria-label');
    const initialLabel = await getActiveLabel();
    await expect.poll(getActiveLabel, { timeout: 6500 }).not.toBe(initialLabel);

    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    const pausedLabel = await getActiveLabel();
    await page.waitForTimeout(5000);
    await expect.poll(getActiveLabel, { timeout: 1000 }).toBe(pausedLabel);
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
