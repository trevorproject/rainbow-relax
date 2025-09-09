# Rainbow Relax - End-to-End Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Playwright is a Node.js library that automates browsers (Chromium, Firefox, and WebKit) with a single API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

#### Run all tests:
```bash
npm run test:e2e
```

#### Run tests in UI mode (interactive):
```bash
npx playwright test --ui
```

#### Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

#### Run specific test file:
```bash
npx playwright test tests/e2e/HomePage.spec.ts
```

#### Run tests in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 Test Reports

After running tests, you can view the HTML report:
```bash
npx playwright show-report
```

## 🔧 Configuration

The Playwright configuration is in `tests/playwright.config.ts`. Key features:

- **Multi-browser testing**: Chromium, Firefox, WebKit, and mobile browsers
- **Parallel execution**: Tests run in parallel for faster execution
- **Auto-retry**: Failed tests retry automatically on CI
- **Screenshots & Videos**: Captured on test failures
- **Trace viewer**: Debug failed tests with trace files
- **Local dev server**: Automatically starts your app before tests

## 📝 Writing Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

### Best Practices

1. **Use Page Object Model**: Create reusable page classes
2. **Use data-testid attributes**: For reliable element selection
3. **Wait for elements**: Use `await expect()` instead of `waitFor()`
4. **Group related tests**: Use `test.describe()` blocks
5. **Use beforeEach/afterEach**: For setup and cleanup

### Common Patterns

#### Waiting for elements:
```typescript
await expect(page.locator('[data-testid="submit-button"]')).toBeVisible();
```

#### Interacting with forms:
```typescript
await page.fill('[data-testid="email-input"]', 'test@example.com');
await page.click('[data-testid="submit-button"]');
```

#### Checking URL changes:
```typescript
await expect(page).toHaveURL('/dashboard');
```

## 🐛 Debugging Tests

### Debug specific test:
```bash
npx playwright test --debug tests/e2e/HomePage.spec.ts
```

### Use VS Code extension:
- Install "Playwright Test for VSCode" extension
- Set breakpoints and run tests in debug mode

### View trace files:
```bash
npx playwright show-trace test-results/trace.zip
```

## 🏗️ CI/CD Integration

### GitHub Actions
The project includes a GitHub Actions workflow for running tests on CI. Tests will:
- Run on multiple browsers
- Retry failed tests automatically
- Upload test reports and videos as artifacts

### Environment Variables
- `CI=true`: Enables CI-specific settings (retries, single worker)
- Custom environment variables can be added to the config

## 📂 Project Structure

```
tests/
├── e2e/                    # End-to-end test files
│   └── HomePage.spec.ts    # Example test file
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript config for tests
└── README.md              # This file
```

## 🔍 Useful Commands

```bash
# Start your dev server first
npm run dev

# Then in another terminal, generate new test
npx playwright codegen localhost:5173

# Alternative: Generate test with custom config
npx playwright codegen --config=tests/playwright.config.ts localhost:5173

# Update snapshots
npx playwright test --update-snapshots

# Run tests with specific grep pattern
npx playwright test --grep "homepage"

# Check test files without running
npx playwright test --dry-run

# Clear test results
rm -rf test-results/
```

## 📚 Learning Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Your First Test](https://playwright.dev/docs/writing-tests)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Auto-waiting](https://playwright.dev/docs/actionability)

## 🆘 Troubleshooting

### Common Issues

1. **Tests fail locally but pass on CI**
   - Check for timing issues or browser differences
   - Use `await expect()` instead of hard waits

2. **"No tests found" error**
   - Check test file naming (must end with `.spec.ts` or `.test.ts`)
   - Verify `testDir` in `playwright.config.ts`

3. **Browser launch failures**
   - Run `npx playwright install` to ensure browsers are installed
   - Check for conflicting browser processes

4. **Slow test execution**
   - Use `fullyParallel: true` in config
   - Optimize selectors and reduce unnecessary waits


## Testing

This project includes end-to-end tests using Playwright to ensure the application works correctly across different browsers and devices.

### Running Tests Locally

#### Prerequisites
- Node.js (v18 or higher)
- npm

#### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

#### Running Tests
- **Run all tests:**
  ```bash
  npm run test:e2e
  ```

- **Run tests in interactive UI mode:**
  ```bash
  npm run test:e2e:ui
  ```

- **Run tests in headed mode (see browser):**
  ```bash
  npm run test:e2e:headed
  ```

- **View test reports:**
  ```bash
  npm run test:e2e:report
  ```

#### Test Features
- **Multi-browser testing**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Parallel execution**: Tests run in parallel for faster execution
- **Screenshots & Videos**: Captured automatically on test failures
- **HTML Reports**: Detailed test reports with traces for debugging

### Running Tests via GitHub Actions

Tests can be run automatically through GitHub Actions:

1. **Automatic triggers**: Tests run on every push to `main` branch and on pull requests
2. **Manual trigger**: 
   - Go to the repository on GitHub
   - Navigate to **Actions** tab
   - Select **Playwright Tests** workflow
   - Click **Run workflow** button
3. **View results**: Test results, screenshots, and videos are available in the workflow run logs and as downloadable artifacts

For detailed testing documentation, see [`tests/README.md`](tests/README.md).

### Getting Help
- Check [Playwright GitHub Issues](https://github.com/microsoft/playwright/issues)
- Join [Playwright Discord](https://discord.gg/playwright-807756831384403968)
- Review test logs and trace files for debugging
