import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Cat Portfolio Agent', () => {
  test('renders global cat agent with accessible trigger', async ({ page }) => {
    await page.goto('/');

    const agent = page.locator('aside[aria-label="Cat portfolio agent"]');
    await expect(agent).toBeVisible();

    const catButton = agent.locator('div[role="button"]');
    await expect(catButton).toBeVisible();
    await expect(catButton).toHaveAttribute('aria-label', /portfolio agent cat/i);
  });

  test('opens the minimalist agent modal, prefills prompts, and closes with Escape', async ({ page }) => {
    await page.goto('/');

    const catButton = page.locator('aside[aria-label="Cat portfolio agent"] div[role="button"]');
    await catButton.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal.getByRole('heading')).toHaveCount(0);
    await expect(modal.getByText(/meow|portfolio assistant/i)).toHaveCount(0);

    const input = modal.locator('input#agent-message');
    await expect(input).toBeFocused();

    const latestProject = modal.getByRole('button', { name: "What is Simeon's latest project?" });
    await latestProject.click();
    await expect(input).toHaveValue("What is Simeon's latest project?");

    await expect(modal.locator('button[aria-label="Send message"]')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);
  });

  test('keeps the global cat available when the footer is in view', async ({ page }) => {
    await page.goto('/');

    // Global agent initially attached
    const globalAgent = page.locator('aside[aria-label="Cat portfolio agent"]');
    await expect(globalAgent).toBeVisible();

    // Scroll directly to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    await expect(globalAgent).toBeVisible();
    await expect(page.locator('#bee-landing-pad div[role="button"]')).toHaveCount(0);
  });

  test('renders cleanly on mobile viewport (375px) without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const globalAgent = page.locator('aside[aria-label="Cat portfolio agent"]');
    await expect(globalAgent).toBeVisible();

    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });

  test('passes axe accessibility checks on agent and modal', async ({ page }) => {
    await page.goto('/');

    // Check with global agent visible
    let axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);

    // Open chat modal and check again
    const catButton = page.locator('aside[aria-label="Cat portfolio agent"] div[role="button"]');
    await catButton.click();
    await expect(page.locator('div[role="dialog"]')).toBeVisible();

    axe = await new AxeBuilder({ page }).include('div[role="dialog"]').analyze();
    expect(axe.violations).toEqual([]);
  });
});
