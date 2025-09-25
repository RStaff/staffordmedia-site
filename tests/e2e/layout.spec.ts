import { test, expect } from '@playwright/test';

test.describe('Right-column cards layout', () => {
  test('desktop: cards right; mobile: cards stack', async ({ page }) => {
    // --- Desktop ---
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const intro = page.locator('[data-testid="intro"]');
    const cards = page.locator('[data-testid="cards"]');

    await expect(intro).toBeVisible();
    await expect(cards).toBeVisible();

    const ib = await intro.boundingBox();
    const cb = await cards.boundingBox();
    // cards should be to the right of the intro block
    expect(cb!.x).toBeGreaterThan(ib!.x + ib!.width + 16);

    // --- Mobile ---
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    const ibM = await intro.boundingBox();
    const cbM = await cards.boundingBox();
    // cards should be below the intro block
    expect(cbM!.y).toBeGreaterThan(ibM!.y + ibM!.height + 8);
  });
});
