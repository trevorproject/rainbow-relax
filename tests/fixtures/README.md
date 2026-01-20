# Test Fixtures

Fixtures provide pre-configured page states for testing scenarios.

## Available Fixtures

### `homePage` / `optimizedPage`
Homepage with automatic setup:
- Navigates to `/?showquickescape=false`
- Closes quick escape modal
- Accepts cookie consent
- Waits for page ready

**Usage**: Homepage tests, navigation, language switching

### `thankYouPage`
Thank-you page for survey testing:
- Navigates to `/thank-you?showquickescape=false`
- Closes quick escape modal
- Accepts cookie consent
- Waits for page ready

**Usage**: Survey interactions, feedback submission

### `exerciseFixture`
Exercise-specific helpers:
- Navigation to exercises
- Wait helpers for exercise phases
- Exercise-specific methods

**Usage**: Breathing exercise flows, sound controls, phase transitions

### `pageObjects`
Fresh page object instances (always use with other fixtures):
- `pageObjects.homePage`
- `pageObjects.exercisePage`
- etc.

**Usage**: Page interactions after navigation

## Examples

```typescript
// Homepage test
test('feature', async ({ homePage, pageObjects }) => {
  const home = pageObjects.homePage;
  await home.clickOneMinButton();
});

// Survey test
test('survey', async ({ thankYouPage }) => {
  const button = thankYouPage.getByRole('button', { name: 'Yes' });
  await button.click();
});

// Exercise test
test('exercise', async ({ exerciseFixture }) => {
  await exerciseFixture.navigateToExercise('1min');
  await exerciseFixture.waitForRunning();
});
```

## Best Practices

- Use page-specific fixtures for different starting points
- Always use `pageObjects` with fixtures for page interactions
- Let fixtures handle navigation and setup (avoid manual setup)
