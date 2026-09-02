import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Footer Section', () => {
  test('renders bee quote line, social icon links, and copyright notice', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify bee humor quote & eval-driven subtext
    await expect(footer).toContainText(/haunted by a bee/i);
    await expect(footer).toContainText(/eval-driven/i);

    // Verify social links
    const linkedin = footer.getByRole('link', { name: /linkedin/i });
    const github = footer.getByRole('link', { name: /github/i });
    const email = footer.getByRole('link', { name: /email/i });

    await expect(linkedin).toBeVisible();
    await expect(github).toBeVisible();
    await expect(email).toBeVisible();

    // Verify copyright notice and monolith playground
    await expect(footer).toContainText(/Simeon Akinrinola. All rights reserved/i);
    await expect(footer.locator('#bee-playground')).toBeAttached();
    await expect(footer.locator('#bee-playground')).toContainText('SIMEON.');
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('footer')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
