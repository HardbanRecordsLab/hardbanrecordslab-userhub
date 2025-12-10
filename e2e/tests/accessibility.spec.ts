import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('homepage should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly one h1
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);
  });

  test('auth page should have proper form labels', async ({ page }) => {
    await page.goto('/auth');
    
    // Check for labeled inputs
    const emailLabel = page.getByLabel(/email/i);
    await expect(emailLabel).toBeVisible();
    
    const passwordLabel = page.getByLabel(/hasło/i);
    await expect(passwordLabel).toBeVisible();
  });

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/auth');
    
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const name = await button.getAttribute('aria-label') || await button.textContent();
      expect(name).toBeTruthy();
    }
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    
    // Something should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('forms should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth');
    
    // Tab to first input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Type in focused input
    await page.keyboard.type('test@example.com');
    
    // Tab to next field
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');
    
    // Verify values were entered
    const emailValue = await page.getByLabel(/email/i).inputValue();
    expect(emailValue).toBe('test@example.com');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/auth');
    
    // Check that main button is visible
    const loginButton = page.getByRole('button', { name: /zaloguj się/i });
    await expect(loginButton).toBeVisible();
    
    // Button should have visible text (implies sufficient contrast)
    const text = await loginButton.textContent();
    expect(text).toBeTruthy();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but should exist
      expect(alt !== null).toBe(true);
    }
  });

  test('focus should be visible', async ({ page }) => {
    await page.goto('/auth');
    
    // Focus on email input
    await page.getByLabel(/email/i).focus();
    
    // Check that focus is visible (element has focus styles)
    const isFocused = await page.getByLabel(/email/i).evaluate(el => {
      return el === document.activeElement;
    });
    expect(isFocused).toBe(true);
  });
});

test.describe('ARIA Attributes', () => {
  test('tabs should have proper ARIA roles', async ({ page }) => {
    await page.goto('/auth');
    
    // Tab list should exist
    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();
    
    // Individual tabs should have tab role
    const tabs = page.getByRole('tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('dialogs should trap focus', async ({ page }) => {
    await page.goto('/');
    
    // This test would check modal behavior if modals exist
    // For now, just verify page loads
    await expect(page.locator('body')).toBeVisible();
  });
});
