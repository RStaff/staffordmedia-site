import { test, expect } from '@playwright/test';

test.describe('Homepage hero layout', () => {
  test('desktop: approach panel right; mobile: approach panel stacks', async ({ page }) => {
    // --- Desktop ---
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const intro = page.getByRole('heading', {
      level: 1,
      name: 'Improve the work that keeps your business moving.',
    }).locator('..');
    const approach = page.getByRole('heading', {
      level: 2,
      name: 'Start with the problem. Build the right next step.',
    }).locator('../..');

    await expect(intro).toBeVisible();
    await expect(approach).toBeVisible();

    const ib = await intro.boundingBox();
    const ab = await approach.boundingBox();
    expect(ab!.x).toBeGreaterThan(ib!.x + ib!.width);

    // --- Mobile ---
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const ibM = await intro.boundingBox();
    const abM = await approach.boundingBox();
    expect(abM!.y).toBeGreaterThan(ibM!.y + ibM!.height);
  });
});
