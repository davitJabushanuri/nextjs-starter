import fs from "node:fs";
import path from "node:path";
import { expect, test as setup } from "@playwright/test";

// Use an absolute path that matches the path in playwright.config.ts
const authFile = path.join(__dirname, "../../.auth/admin.json");

setup("authenticate", async ({ page }) => {
  // Ensure auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto("en/auth/signin");
  await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL ?? "");
  await page.fill(
    'input[name="password"]',
    process.env.TEST_USER_PASSWORD ?? "",
  );
  await page.click('button[type="submit"]');

  // Verify successful login with redirect to dashboard
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Set cookie to prevent the "take tour" popup from showing
  await page.context().addCookies([
    {
      name: "hasSeenTour",
      value: "true",
      url: page.url(),
    },
  ]);

  // Save auth state and log the path for debugging
  await page.context().storageState({ path: authFile });
});
