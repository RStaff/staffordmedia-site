import { test, expect } from '@playwright/test';

test('hero art removed and Abando logo inline with name', async ({ page }) => {
  await page.goto('/');

  // No decorative hero images
  await expect(page.locator('img[src*="hero"]')).toHaveCount(0);

  // Inline logo + name (inside the same wrapper)
  const title = page.locator('[data-testid="abando-title"]');
  await expect(title).toBeVisible();

  const logo = title.locator('img[src*="abando-logo"]');
  const name = title.locator('span:text("Abando")');

  await expect(logo).toBeVisible();
  await expect(name).toBeVisible();

  // Logo should be left of the name
  const lb = await logo.boundingBox();
  const nb = await name.boundingBox();
  expect(lb!.x + lb!.width).toBeLessThan(nb!.x);
});
