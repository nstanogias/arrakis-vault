/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

test.describe("LiquidityForm", () => {
  test("token inputs are updated based on proportion", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).isPlaywrightTest = true;
    });

    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const token0Input = page.locator('[data-testid="token0"]');
    const token1Input = page.locator('[data-testid="token1"]');

    // Input a value in token0 and check token1 updates correctly
    await token0Input.fill("50");

    const proportion = 2; // Token1 balance is double token0 balance
    const expectedToken1Value = (50 * proportion).toFixed(8);

    await expect(token1Input).toHaveValue(expectedToken1Value);

    await token1Input.fill("100");

    const expectedToken0Value = (100 / proportion).toFixed(8);
    await expect(token0Input).toHaveValue(expectedToken0Value);
  });
});
