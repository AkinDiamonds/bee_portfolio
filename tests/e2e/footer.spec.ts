import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Footer Section', () => {
  test('renders the contained monolith and footer contact links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify the approved bee humor line without a dead teaser link.
    await expect(footer).toContainText(/haunted by a bee/i);
    await expect(footer).not.toContainText(/eval-driven/i);
    await expect(footer.locator('a[href="#bee"]')).toHaveCount(0);

    // Verify supplied contact destinations.
    const linkedin = footer.getByRole('link', { name: /linkedin/i });
    const github = footer.getByRole('link', { name: /github/i });
    const email = footer.getByRole('link', { name: /email/i });

    await expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/simeon-akinrinola');
    await expect(github).toHaveAttribute('href', 'https://github.com/AkinDiamonds');
    await expect(email).toHaveAttribute('href', 'mailto:simeonakinrinola7@gmail.com');

    // Verify the accessible wordmark and inert O landing handoff.
    await expect(footer).toContainText(/Simeon Akinrinola. All rights reserved/i);
    await expect(footer.locator('#bee-playground')).toBeAttached();
    await expect(footer.locator('#bee-playground')).toContainText('SIMEON.');
    await expect(footer.locator('#bee-playground').getByText('Simeon.', { exact: true })).toBeAttached();
    await expect(footer.locator('#bee-landing-pad')).toHaveAttribute('data-bee-landing-zone', 'center');
    await expect(footer.locator('[data-bee-accent="true"]')).toHaveText('.');
    await expect(footer).toHaveCSS('border-top-width', '1px');
  });

  test('keeps the O landing pad aligned and contained at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const landingPad = page.locator('#bee-landing-pad');
    const wordmark = page.locator('#bee-playground > span[aria-hidden="true"]');
    const bounds = await landingPad.boundingBox();
    const wordmarkBounds = await wordmark.boundingBox();

    expect(bounds).not.toBeNull();
    expect(wordmarkBounds).not.toBeNull();
    expect(bounds?.width).toBeGreaterThan(0);
    expect(bounds?.height).toBeGreaterThan(0);
    expect(bounds?.x).toBeGreaterThanOrEqual(wordmarkBounds?.x ?? 0);
    expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
      (wordmarkBounds?.x ?? 0) + (wordmarkBounds?.width ?? 0),
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });

  test('shows a visible focus treatment on social links', async ({ page }) => {
    await page.goto('/');
    const linkedin = page.getByRole('link', { name: /linkedin/i });
    await linkedin.focus();
    await expect(linkedin).toBeFocused();
    await expect(linkedin).toHaveCSS('outline-style', 'solid');
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('footer')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
