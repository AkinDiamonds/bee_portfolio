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

    // Verify the accessible wordmark and bee accent.
    await expect(footer).toContainText(/Simeon Akinrinola. All rights reserved/i);
    await expect(footer.locator('[data-bee-accent="true"]')).toHaveText('.');
    await expect(footer).toHaveCSS('border-top-width', '1px');
  });

  test('keeps footer content contained at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
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
