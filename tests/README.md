# Rainbow Relax - End-to-End Testing with Playwright 🎭

Welcome! This guide will help you understand and contribute to our Playwright E2E testing framework.

## 🎯 What is Playwright?

Playwright is a tool that lets us test our web application by:
- Opening a real browser (like Chrome)
- Clicking buttons, filling forms, and navigating pages
- Checking that everything works as expected
- Taking screenshots when something goes wrong

Think of it as a robot that uses your website the same way a real user would!

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- Basic understanding of JavaScript/TypeScript
- Familiarity with our React application

### Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Run your first test:**
   ```bash
   npm run test:e2e
   ```
   
   This will run all tests across our test files:
   - `screens/HomePage.spec.ts`
   - `screens/ConsentPage.spec.ts`
   - `screens/ThankYouPage.spec.ts`
   - `shared/Navigation.spec.ts`
   - `shared/Survey.spec.ts`
   - `shared/SoundControl.spec.ts`
   - `shared/TextContent.spec.ts`
   - `shared/WidgetConfiguration.spec.ts`
   - `exercises/4-7-8.spec.ts`

4. **See the results:**
   ```bash
   npm run test:e2e:report
   ```

## 📁 Project Structure

```
tests/
├── e2e/                        # 📂 All test files organized by feature
│   ├── screens/                # Screen-specific tests
│   │   ├── HomePage.spec.ts
│   │   ├── ConsentPage.spec.ts
│   │   └── ThankYouPage.spec.ts
│   ├── shared/                 # Shared functionality tests
│   │   ├── Navigation.spec.ts
│   │   ├── Survey.spec.ts
│   │   ├── SoundControl.spec.ts
│   │   ├── TextContent.spec.ts
│   │   └── WidgetConfiguration.spec.ts
│   └── exercises/             # Exercise-specific tests
│       └── 4-7-8.spec.ts
├── fixtures/                   # 🔧 Reusable test data and utilities
│   ├── fixtures.ts            # Custom fixtures
│   ├── testData.ts            # URLs, selectors, viewports, language data
│   ├── setupHelpers.ts        # Shared test utilities
│   ├── assertionsHelper.ts    # Custom assertion helpers
│   ├── widgetConfigHelpers.ts # Widget configuration helpers
│   └── testConstants.ts       # Test constants and timeouts
├── page-objects/              # 📄 Page Object Models for reusable components
│   ├── HomePage.ts            # Homepage POM with methods and locators
│   ├── ExercisePage.ts       # Exercise page POM
│   ├── SurveyPage.ts         # Survey page POM
│   └── index.ts               # Exports all POMs for easy importing
├── playwright.config.ts       # ⚙️ Playwright configuration
├── tsconfig.json             # 📝 TypeScript config for tests
└── README.md                 # 📖 This comprehensive guide
```

### 🗂️ File Organization by Feature

Our tests are organized by **feature** rather than by page, making it easier to:
- Find tests related to specific functionality
- Add new tests for similar features
- Maintain and update related test cases together

#### Test File Breakdown:

**screens/** - Screen-specific tests (HomePage, ConsentPage, ThankYouPage)

**shared/** - Shared functionality tests (Navigation, Survey, SoundControl, TextContent, WidgetConfiguration)

**exercises/** - Exercise-specific tests (4-7-8 breathing exercise)

### 🏗️ Test Architecture

Our test architecture follows a layered approach with clear separation of concerns:

#### Architecture Layers

**Fixture Layer**
- Provides pre-configured page states for different testing scenarios
- Handles navigation, setup, and ensures pages are ready for interaction
- Use fixtures for consistent test setup

**Helper Layer**
- Utilities organized by category (modals, assertions, widgets)
- Generic functions that work with any page fixture
- Reusable operations for common testing patterns

**Page Object Layer**
- Encapsulates page-specific interactions
- Always use with `pageObjects` fixture for fresh instances
- Provides stable, maintainable selectors and methods

#### Key Principles
- **Page Object Model**: Centralized component interactions for maintainability  
- **Fixture-Based Setup**: Pre-configured page states eliminate manual setup
- **Feature-Based Organization**: Tests grouped by functionality, not page structure
- **Real Component Testing**: Tests interact with actual React components, not mocks

#### Best Practices
- Use page-specific fixtures for different starting points
- Use helpers for reusable utilities
- Use page objects for page interactions
- Avoid manual page setup in tests

For detailed fixture usage, see [fixtures/README.md](fixtures/README.md).

## 🧪 Using Test Fixtures

Our test suite uses fixtures to provide pre-configured page states. This eliminates the need for manual setup in each test:

```typescript
import { test, expect } from '../fixtures/fixtures';

// Homepage tests use homePage fixture
test('homepage feature', async ({ homePage, pageObjects }) => {
  // Page is already navigated and set up
  const home = pageObjects.homePage;
  await home.clickOneMinButton();
});

// Survey tests use thankYouPage fixture
test('survey feature', async ({ thankYouPage }) => {
  // Page is already navigated to /thank-you
  const yesButton = thankYouPage.getByRole('button', { name: 'Yes' });
  await yesButton.click();
});
```

**Available Fixtures:**
- `homePage` / `optimizedPage`: Homepage with setup complete
- `thankYouPage`: Thank-you page for survey tests
- `pageObjects`: Fresh page object instances
- `exerciseFixture`: Exercise-specific helpers

For detailed fixture usage patterns, see [fixtures/README.md](fixtures/README.md).

#### Shared Test Helpers

Helper functions provide reusable utilities organized by category:

**Modal & Overlay Utilities:**
- `closeQuickEscapeModal(page)`: Closes the QuickEscape modal if visible
- `acceptCookieIfExist(page)`: Accepts cookie consent if present
- `closeSoundControlPanel(page)`: Closes sound control panel

**Exercise Phase Utilities:**
- `waitForExerciseIntroPhase(page)`: Waits for exercise intro phase
- `waitForExerciseRunningPhase(page)`: Waits for exercise running phase

**Why Use Helpers Instead of Hardcoded Waits:**
```typescript
// ❌ Bad: Unreliable and slow
await page.waitForTimeout(9000);

// ✅ Good: Wait for specific conditions
await waitForExerciseIntroPhase(page);
```

### Current Test Data Structure

Our test suite uses centralized test data in `fixtures/testData.ts` to avoid repetition and make maintenance easier.

```typescript
// From fixtures/testData.ts
export const TestData = {
  // Responsive design testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },

  // Page titles for verification
  titles: {
    homepage: /Breathing Exercise/,
    exercise: /4-7-8 Breathing/,
  },

  // URL patterns for navigation
  urls: {
    homepage: '/',
    exercise: '/exercise',
  },

  // Language-specific test data
  languages: {
    english: { code: 'en', welcomeText: 'Welcome' },
    spanish: { code: 'es', welcomeText: 'Bienvenido' },
  },

  // Common selectors (add data-testid to your components)
  selectors: {
    startButton: '[data-testid="start-exercise-button"]',
    languageToggle: '[data-testid="language-toggle"]',
    // ... more selectors
  },
};
```

### How to Use Test Data

```typescript
// In your test files
import TestData from '../fixtures/testData';

test('should be responsive on mobile', async ({ page }) => {
  await page.goto(TestData.urls.homepage);
  await page.setViewportSize(TestData.viewports.mobile);
  await expect(page).toHaveTitle(TestData.titles.homepage);
});
```

## 🏗️ Test File Structure (The Foundation)

Every test file should follow this pattern:

```typescript
import { test, expect } from '../fixtures/fixtures';

test.describe('Feature Name', () => {
  
  // Run before each test in this group
  test.beforeEach(async ({ page }) => {
    // Common setup goes here
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // 1. Arrange: Set up the test
    // 2. Act: Perform the action
    // 3. Assert: Check the result
  });

  test('should handle edge case', async ({ page }) => {
    // Another test...
  });
});
```

## ✨ Best practices

### 1. **Write Clear Test Names**
```typescript
// ❌ Bad: Unclear what's being tested
test('test login', async ({ page }) => {

// ✅ Good: Clear and descriptive
test('should show error message when login fails with invalid credentials', async ({ page }) => {
```

### 2. **Use data-testid Attributes**
In your React components, add `data-testid` attributes:

```jsx
// In your React component
<button data-testid="start-breathing-button">
  Start Exercise
</button>
```

```typescript
// In your test
await page.click('[data-testid="start-breathing-button"]');
```

**Why?** HTML can change, but test IDs are stable and won't break your tests.

It's acceptable to omit a `data-testid` attribute if the element is unique across the entire application (for example, the logo or main navigation menu). In such cases, ensure that the element's selector is stable and unlikely to change. For all other elements—especially those that may appear multiple times or whose structure might change—always use a `data-testid` to keep your tests reliable and maintainable.

### 3. **Wait for Elements Properly**
```typescript
// ❌ Bad: Hard wait (flaky and slow)
await page.waitForTimeout(9000);

// ✅ Good: Wait for specific condition
await expect(page.locator('[data-testid="breathing-animation"]')).toBeVisible();

// ✅ Even Better: Use our custom helpers for common scenarios
await waitForExerciseIntroPhase(page);
await waitForExerciseRunningPhase(page);
```

### 4. **Use Meaningful Assertions**
```typescript
// ❌ Bad: Vague assertion
await expect(page.locator('h1')).toBeVisible();

// ✅ Good: Specific assertion
await expect(page.locator('h1')).toContainText('4-7-8 Breathing Exercise');
```

### 5. **Group Related Tests**
```typescript
test.describe('Breathing Exercise', () => {
  test.describe('when user starts exercise', () => {
    test('should show breathing animation', async ({ page }) => {
      // Test animation
    });
    
    test('should play breathing sounds', async ({ page }) => {
      // Test audio
    });
  });
});
```

## 🎭 Common Testing Patterns

### Testing Navigation

```typescript
// From our actual Navigation.spec.ts
test.describe('Language Switching', () => {
  test('should switch to Spanish when Spanish flag is clicked', async ({ pageObjects, optimizedPage }) => {
    const homePage = pageObjects.homePage;
    await homePage.switchLanguage('ES');
    
    // Check URL includes language parameter
    await expect(optimizedPage).toHaveURL(/\?.*lng=es/);
  });
});
```

### Testing Responsive Design

```typescript
// From our actual HomePage.spec.ts
Object.entries(TestData.viewports).forEach(([device, viewport]) => {
  test(`should display correctly on ${device}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    
    await expect(page).toHaveTitle(TestData.titles.homepage);
    await expect(page.locator(TestData.selectors.logo)).toBeVisible();
  });
});
```

### Testing Animations and Audio
```typescript
test('should start breathing animation', async ({ exerciseFixture }) => {
  await exerciseFixture.navigateToExercise('1min');
  
  // Wait for animation to start
  await expect(page.locator('[data-testid="breathing-circle"]')).toHaveClass(/animated/);
  
  // Check animation is running
  const animationElement = page.locator('[data-testid="breathing-circle"]');
  await expect(animationElement).toBeVisible();
});
```

## 🐛 Debugging Tests

### 1. **Run Tests in Debug Mode**
```bash
# Debug a specific test
npx playwright test --debug tests/e2e/screens/HomePage.spec.ts

# Debug with headed browser (see what's happening)
npx playwright test --headed tests/e2e/screens/HomePage.spec.ts
```

### 2. **Use Console Logs**
```typescript
test('debugging example', async ({ page }) => {
  await page.goto('/');
  
  // Log current URL
  console.log('Current URL:', page.url());
  
  // Log element text
  const titleText = await page.locator('h1').textContent();
  console.log('Title text:', titleText);
});
```

### 3. **Take Screenshots**
```typescript
test('visual debugging', async ({ page }) => {
  await page.goto('/');
  
  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png' });
  
  // Continue test...
});
```

## 🔍 Running Commands Cheat Sheet

```bash
# Development Commands
npm run dev                  # Start development server (required for testing)

# Test Commands
npm run test:e2e            # Run all tests
npm run test:e2e:ui         # Interactive test runner (great for beginners!)
npm run test:e2e:headed     # See tests run in browser
npm run test:e2e:report     # View detailed test reports

# Specific Test Commands
npx playwright test screens/HomePage.spec.ts                    # Run specific file
npx playwright test --grep "should show title"                # Run tests matching pattern
npx playwright test --project=chromium                        # Run on specific browser

# Debugging Commands
npx playwright test --debug                                  # Debug mode
npx playwright test --headed                                 # See browser
npx playwright codegen http://localhost:3000                 # Generate tests by recording

# Utility Commands
npx playwright show-report                                   # View last test report
npx playwright show-trace test-results/trace.zip             # Debug with trace viewer
```

## 📝 Writing Your First Test (Step by Step)

Let's write a test for the language switcher:

### Step 1: Create the test file
Create `tests/e2e/shared/LanguageSwitcher.spec.ts`:

```typescript
import { test, expect } from '../../fixtures/fixtures';

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ optimizedPage }) => {
    // Page is already loaded by fixture
  });

  test('should switch to Spanish when Spanish flag is clicked', async ({ pageObjects, optimizedPage }) => {
    // 1. Arrange: Page is already loaded (beforeEach)
    
    // 2. Act: Click Spanish flag
    const homePage = pageObjects.homePage;
    await homePage.switchLanguage('ES');
    
    // 3. Assert: Check that URL changed
    await expect(optimizedPage).toHaveURL(/\?.*lng=es/);
  });
});
```

### Step 2: Add data-testid to React component
In your React component:

```jsx
// src/components/LanguageSwitcher.tsx
function LanguageSwitcher() {
  return (
    <div>
      <button data-testid="spanish-flag-button" onClick={() => setLanguage('es')}>
        🇪🇸
      </button>
      <h1 data-testid="welcome-text">{t('welcome')}</h1>
    </div>
  );
}
```

### Step 3: Run your test
```bash
npm run test:e2e:headed
```

## 🚨 Common Mistakes to Avoid

### 1. **Don't use hard waits**
```typescript
// ❌ Bad: Unreliable timing
await page.waitForTimeout(5000);

// ✅ Good: Wait for specific condition
await expect(page.locator('[data-testid="loading"]')).toBeHidden();
```

### 2. **Don't use brittle selectors**
```typescript
// ❌ Bad: Will break if HTML changes
await page.click('div > div > button:nth-child(3)');

// ✅ Good: Stable selector
await page.click('[data-testid="submit-button"]');
```

### 3. **Don't write giant tests**
```typescript
// ❌ Bad: Tests everything at once
test('should do everything', async ({ page }) => {
  // 50 lines of test code...
});

// ✅ Good: One responsibility per test
test('should show error message when form is invalid', async ({ page }) => {
  // Focused test
});
```

### 4. **Don't forget to wait for async actions**
```typescript
// ❌ Bad: Might fail if action is slow
await page.click('[data-testid="save-button"]');
await expect(page.locator('[data-testid="success"]')).toBeVisible();

// ✅ Good: Wait for the action to complete
await page.click('[data-testid="save-button"]');
await expect(page.locator('[data-testid="loading"]')).toBeHidden();
await expect(page.locator('[data-testid="success"]')).toBeVisible();
```

## 🆘 Troubleshooting Guide

### Test fails with "Element not found"
```bash
# Solution: Check if element exists and wait for it
await expect(page.locator('[data-testid="your-element"]')).toBeVisible();
```

### Test is slow or times out
```bash
# Solution: Check for proper waits and reduce unnecessary delays
# Look for hard waits and replace with conditional waits
```

### Test passes locally but fails in CI
```bash
# Solution: Add proper waits and check for timing issues
# Ensure tests don't depend on specific timing
```

### CI Artifacts: Debugging with Test Reports

When tests run in Continuous Integration (CI), a `test-report.zip` file is generated and retained as a build artifact. You can download this file from your CI job summary to review detailed test results, screenshots, and traces. This makes it easier to validate failures and debug issues locally using Playwright's reporting tools.

```bash
# To view the report locally after downloading:
unzip test-report.zip
npx playwright show-report
```

### Browser doesn't open in headed mode
```bash
# Solution: Install browsers
npx playwright install chromium
```

## 📚 Additional Resources

### Documentation
- [Playwright Official Docs](https://playwright.dev/docs/intro) - Complete reference
- [Best Practices Guide](https://playwright.dev/docs/best-practices) - Dos and don'ts
- [API Reference](https://playwright.dev/docs/api/class-test) - All available methods

### Video Tutorials
- [Playwright Crash Course](https://www.youtube.com/watch?v=sAzpwb4X8VQ) - Great for beginners

### Community
- [Playwright Discord](https://discord.gg/playwright-807756831384403968) - Get help from community
- [GitHub Issues](https://github.com/microsoft/playwright/issues) - Report bugs and feature requests

## 🤝 Contributing to Tests

### Before Writing a Test
1. Check if similar test already exists
2. Think about what you're testing (user behavior)
3. Write test name first (helps clarify purpose)
4. Keep tests simple and focused

### Code Review Checklist
- [ ] Test name clearly describes what's being tested
- [ ] Uses `data-testid` selectors where possible
- [ ] Has proper waits (no hard waits)
- [ ] Tests one specific behavior
- [ ] Includes meaningful assertions
- [ ] Follows existing patterns in codebase

### Getting Help
- Ask questions in team chat
- Review existing tests for patterns
- Use `npx playwright codegen http://localhost:3000` to generate test code
- Don't hesitate to ask for code review

---

**Remember**: Good tests make our application more reliable and give us confidence when making changes. Start small, ask questions, and keep learning! 🚀
