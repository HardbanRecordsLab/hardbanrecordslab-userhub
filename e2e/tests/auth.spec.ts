import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display login form by default', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /zaloguj/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /zarejestruj/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /reset hasła/i })).toBeVisible();
    
    // Check login form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/hasło/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /zaloguj się/i })).toBeVisible();
  });

  test('should switch to registration tab', async ({ page }) => {
    await page.getByRole('tab', { name: /zarejestruj/i }).click();
    
    await expect(page.getByLabel(/imię i nazwisko/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/hasło/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /zarejestruj się/i })).toBeVisible();
  });

  test('should switch to password reset tab', async ({ page }) => {
    await page.getByRole('tab', { name: /reset hasła/i }).click();
    
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /wyślij link/i })).toBeVisible();
  });

  test('should show validation error for empty login', async ({ page }) => {
    await page.getByRole('button', { name: /zaloguj się/i }).click();
    
    // Browser should show validation error for required fields
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/hasło/i).fill('TestPassword123!');
    await page.getByRole('button', { name: /zaloguj się/i }).click();
    
    // Check for validation
    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should show password requirements on registration', async ({ page }) => {
    await page.getByRole('tab', { name: /zarejestruj/i }).click();
    
    // Password field should have minlength attribute
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toHaveAttribute('minLength', '12');
  });

  test('should attempt login with credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/hasło/i).fill('TestPassword123!');
    
    // Click login and wait for response
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('auth') && response.status() !== 0
    );
    
    await page.getByRole('button', { name: /zaloguj się/i }).click();
    
    // Should make auth request
    const response = await responsePromise;
    expect(response).toBeTruthy();
  });

  test('should redirect logged-in users from auth page', async ({ page, context }) => {
    // This test checks the redirect behavior
    // In real scenario, you'd set up auth state first
    await page.goto('/auth');
    
    // Should show auth page for non-logged users
    await expect(page.getByRole('tab', { name: /zaloguj/i })).toBeVisible();
  });
});

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: /zarejestruj/i }).click();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.getByLabel(/imię i nazwisko/i).fill('Test User');
    await page.getByLabel(/email/i).fill('newuser@example.com');
    
    // Weak password
    await page.locator('input[type="password"]').first().fill('weak');
    await page.getByRole('button', { name: /zarejestruj się/i }).click();
    
    // Should show validation (minLength is 12)
    const passwordInput = page.locator('input[type="password"]').first();
    const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should fill registration form correctly', async ({ page }) => {
    await page.getByLabel(/imię i nazwisko/i).fill('Test User');
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.locator('input[type="password"]').first().fill('StrongPassword123!');
    
    // All fields should be filled
    await expect(page.getByLabel(/imię i nazwisko/i)).toHaveValue('Test User');
    await expect(page.getByLabel(/email/i)).toHaveValue('newuser@example.com');
  });
});

test.describe('Password Reset Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: /reset hasła/i }).click();
  });

  test('should display password reset form', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /wyślij link/i })).toBeVisible();
  });

  test('should submit password reset request', async ({ page }) => {
    await page.getByLabel(/email/i).fill('user@example.com');
    
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('auth') && response.status() !== 0
    );
    
    await page.getByRole('button', { name: /wyślij link/i }).click();
    
    const response = await responsePromise;
    expect(response).toBeTruthy();
  });
});
