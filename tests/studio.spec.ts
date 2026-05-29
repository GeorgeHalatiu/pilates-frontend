import { test, expect } from '@playwright/test';

test.describe('Pilates Studio E2E Tests', () => {

  test('should load the app and show empty sessions list', async ({ page }) => {
    await page.goto('https://localhost:4200/sessions');
    await expect(page.locator('h2').first()).toHaveText('My Sessions');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state')).toContainText('No upcoming sessions booked');
  });

  test('should successfully book a new session', async ({ page }) => {
    await page.goto('https://localhost:4200/schedule');

    await page.locator('.date-box').first().click();
    await page.locator('.time-card').first().click();
    await expect(page.locator('.type-modal')).toBeVisible();
    await page.locator('.type-choice-card').first().click();
    await expect(page.locator('.instructor-modal')).toBeVisible();
    await page.locator('.instructor-item').first().click();
    await page.locator('.confirm-modal-btn').click();

    await expect(page).toHaveURL(/.*sessions/);
    await expect(page.locator('.empty-state')).not.toBeVisible();
    
    await expect(page.locator('.delete-btn')).toHaveCount(1);
  });

  test('should book and then delete a session', async ({ page }) => {
    await page.goto('https://localhost:4200/schedule');
    await page.locator('.date-box').first().click();
    await page.locator('.time-card').first().click();
    await page.locator('.type-choice-card').first().click();
    await page.locator('.instructor-item').first().click();
    await page.locator('.confirm-modal-btn').click();

    await expect(page.locator('.delete-btn')).toHaveCount(1);

    await page.locator('.delete-btn').click();

    await expect(page.locator('.delete-btn')).not.toBeVisible();
    await expect(page.locator('.empty-state')).toBeVisible();
  });

});