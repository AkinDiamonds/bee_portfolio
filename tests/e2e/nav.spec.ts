import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Nav Section', () => {
  test('renders logo/name with correct home link on all viewports', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('header a[href="/"]');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('Simeon Akinrinola');
  });

  test('desktop navigation renders blog and contact flyout on desktop', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Desktop navigation is only visible on desktop viewports');
    await page.goto('/');

    const blogLink = page.locator('header nav a[href="/blog"]');
    await expect(blogLink).toBeVisible();

    const contactBtn = page.getByRole('button', { name: /contact/i });
    await expect(contactBtn).toBeVisible();
  });

  test('mobile navigation renders and toggles properly at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const toggleBtn = page.getByRole('button', { name: /toggle menu/i });
    await expect(toggleBtn).toBeVisible();

    await toggleBtn.click();
    const mobileNav = page.getByRole('navigation', { name: 'Mobile Navigation Drawer' });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Blog' })).toBeVisible();

    await toggleBtn.click();
    await expect(mobileNav).not.toBeVisible();
  });

  test('passes axe accessibility checks', async ({ page }) => {
    await page.goto('/');
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('header')
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
