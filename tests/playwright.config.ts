import { defineConfig, devices } from '@playwright/test';
import { findVitePort } from '../scripts/detect-port.js';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Base URL will be set dynamically
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes timeout
  },
  // Global setup to detect and update the port
  globalSetup: async () => {
    console.log('🔍 Detecting Vite dev server port...');
    
    // Wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const port = await findVitePort();
    if (port) {
      console.log(`✅ Detected Vite dev server on port ${port}`);
      // Update the baseURL for tests
      process.env.PLAYWRIGHT_BASE_URL = `http://localhost:${port}`;
    } else {
      console.log('⚠️  Could not detect Vite dev server port, using default 5173');
      process.env.PLAYWRIGHT_BASE_URL = 'http://localhost:5173';
    }
  },
});
