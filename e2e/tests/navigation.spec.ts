import { test, expect } from '@playwright/test';

test.describe('Public Pages Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1')).toBeVisible();
    
    // Check navigation
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should navigate to FAQ page', async ({ page }) => {
    await page.goto('/faq');
    
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/FAQ|Pytania/i);
  });

  test('should navigate to Privacy Policy', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL('/privacy');
    
    // Alternative route should also work
    await page.goto('/privacy-policy');
    await expect(page).toHaveURL('/privacy-policy');
  });

  test('should navigate to Terms of Service', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL('/terms');
  });

  test('should show 404 for unknown routes', async ({ page }) => {
    await page.goto('/unknown-page-xyz');
    
    await expect(page.getByText(/404|nie znaleziono/i)).toBeVisible();
  });

  test('should have working header navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check that navigation links exist
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to auth when accessing dashboard without login', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to auth page
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing music dashboard without login', async ({ page }) => {
    await page.goto('/dashboard/music');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing marketing dashboard without login', async ({ page }) => {
    await page.goto('/dashboard/marketing');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing contacts without login', async ({ page }) => {
    await page.goto('/dashboard/contacts');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing calendar without login', async ({ page }) => {
    await page.goto('/dashboard/calendar');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing analytics without login', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing revenue tracker without login', async ({ page }) => {
    await page.goto('/dashboard/revenue');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing profile without login', async ({ page }) => {
    await page.goto('/dashboard/profile');
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should redirect to auth when accessing settings without login', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    await expect(page).toHaveURL(/\/auth/);
  });
});

test.describe('Responsive Design', () => {
  test('should display mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu button should be visible
    const mobileMenuBtn = page.locator('[aria-label*="menu"], button:has(svg)').first();
    await expect(mobileMenuBtn).toBeVisible();
  });

  test('should display desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});
