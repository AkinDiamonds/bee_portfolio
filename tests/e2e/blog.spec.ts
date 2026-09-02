import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Latest Blogs Section', () => {
  test('renders section header, view blog pill button, and blog cards', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('section[aria-label="Latest Blogs"]');
    await expect(section).toBeVisible();

    const heading = section.locator('h2');
    await expect(heading).toContainText(/Latest Blogs/i);

    const viewBlogLink = section.getByRole('link', { name: /view blog/i });
    await expect(viewBlogLink).toBeVisible();
    await expect(viewBlogLink).toHaveAttribute('href', '/blog');

    const articles = section.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('section[aria-label="Latest Blogs"]')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
