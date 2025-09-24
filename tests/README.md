# Rainbow Relax Widget Testing

This directory contains comprehensive test suites for the Rainbow Relax widget, adapted from the original app tests to ensure the same functionality works in the widget environment.

## Test Structure

### Widget Integration Tests (`widget-integration.spec.ts`)
Comprehensive test suite covering all widget functionality:
- **Widget Loading**: Container initialization, configuration, structure
- **Language Switching**: Toggle between English/Spanish with flag display
- **Navigation**: Time selection buttons (1min, 3min, 5min, custom)
- **Breathing Exercise Interface**: Exercise controls, instructions, timing
- **Animation Functionality**: Circular breathing animations, pause/play
- **Responsive Design**: Mobile, tablet, desktop viewports
- **Error Handling**: Graceful degradation, missing assets

### Performance Tests (`performance/widget-performance.spec.ts`)
Performance testing for widget optimization:
- **Load Time Performance**: Core Web Vitals, network conditions
- **Bundle Size Performance**: Asset loading efficiency
- **Memory Performance**: Memory leaks, cleanup
- **Animation Performance**: Smooth animations, multiple instances
- **Audio Performance**: Audio loading and playback
- **Error Logging Performance**: Impact of error logging
- **Performance Under Load**: Multiple instances, long sessions

### Visual Regression Tests (`visual-regression.spec.ts`) 🎨
**Last line of QA defense** - Automated screenshot comparison with QA reference:
- **Animation Circle Verification**: Dimensions, circularity, size ratios
- **Positioning Verification**: Centering, alignment, layout
- **Style Verification**: Opacity, colors, border radius
- **Responsive Screenshots**: Mobile, tablet, desktop viewports
- **QA Reference Comparison**: Side-by-side with production QA environment

📊 **See [QA-COMPARISON.md](./QA-COMPARISON.md) for detailed comparison results**

## Running Tests

### Prerequisites
1. Build the widget: `npm run build:widget`
2. Start the widget server: `cd dist-widget && python3 -m http.server 8082`

### Test Commands

```bash
# Run all widget tests
npm run test:widget

# Run specific test suites
npm run test:widget:integration    # Integration tests only
npm run test:widget:performance    # Performance tests only

# Run visual regression tests (QA comparison)
npx playwright test tests/visual-regression.spec.ts --config=tests/playwright.config.ts

# Interactive testing
npm run test:widget:ui             # Open Playwright UI
npm run test:widget:headed         # Run with browser visible

# View test results
npm run test:widget:report         # Open test report

# View screenshots
open tests/screenshots/            # macOS
explorer tests/screenshots/        # Windows
```

### Quick Test Runner
Use the convenient test runner script:

```bash
# Run integration tests (default)
node test-widget-runner.js

# Run specific test types
node test-widget-runner.js integration
node test-widget-runner.js performance
node test-widget-runner.js all
node test-widget-runner.js ui
```

## Test Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL**: `http://localhost:8082`
- **Web Server**: Automatically starts widget server
- **Browser**: Chromium (headless by default)
- **Retries**: 2 retries on CI, 0 locally
- **Workers**: Single worker for consistent execution

### Widget Configuration
Tests use a standard widget configuration:
```javascript
{
  showQuickExit: false,
  donateURL: 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
  getHelpURL: 'https://www.thetrevorproject.mx/ayuda/',
  width: '100%',
  height: '100%',
  containerId: 'rainbow-relax-container',
  cdnBase: './assets/',
  audioEnabled: true,
}
```

## Test Coverage

### Original App Functionality → Widget Equivalent
| Original Test                | Widget Test                        | Status |
| ---------------------------- | ---------------------------------- | ------ |
| Homepage loading             | Widget loading                     | ✅      |
| Language switching           | Language toggle with flags         | ✅      |
| Navigation to exercise       | Time selection buttons             | ✅      |
| Breathing exercise interface | Exercise controls and instructions | ✅      |
| Exercise functionality       | Pause/play, back navigation        | ✅      |
| Exercise timing              | Countdown timer, instructions      | ✅      |
| Responsive design            | Mobile/tablet/desktop              | ✅      |
| Language support             | Multi-language interface           | ✅      |

### Additional Widget-Specific Tests
- **Animation Functionality**: Circular breathing animations (matches QA reference)
- **Visual Regression**: Automated screenshot comparison with QA environment
- **Error Handling**: Graceful degradation
- **Performance**: Load time, memory usage, bundle size
- **Configuration**: Widget initialization and setup

### QA Reference Alignment ✅
Our widget implementation uses the **exact same code** as the reference repository:
- Same `MainAnimation.tsx` component with inline styles
- Same `animationObjects.ts` with `handlePosition` logic
- Same `MainAnimationProvider.tsx` with animation state management
- Same responsive sizing using `clamp(vh, vw, vh)`
- Same browser-specific positioning (Safari vs others)

**Result**: Visual regression tests confirm 100% parity with QA reference

## Debugging Tests

### Common Issues
1. **Widget not loading**: Check server is running on port 8082
2. **Tests timing out**: Increase timeout in test configuration
3. **Animation not working**: Check for JavaScript errors in console
4. **Language toggle broken**: Verify flag images are loading

### Debug Commands
```bash
# Run with browser visible for debugging
npm run test:widget:headed

# Run specific test with debug output
npx playwright test tests/widget-integration.spec.ts --headed --debug

# Check widget manually
open http://localhost:8082/widget-test.html
```

### Test Helpers
- `initializeWidget()`: Sets up widget with configuration
- `waitForBreathingExerciseToStart()`: Waits for exercise interface
- `waitForBreathingInstructions()`: Waits for breathing instructions
- `closeQuickEscapeModal()`: Closes quick escape modal if present

## Continuous Integration

Tests are designed to run in CI environments:
- Automatic server startup
- Headless browser execution
- Retry failed tests
- Generate HTML reports
- Performance monitoring

## Maintenance

### Adding New Tests
1. Follow existing test structure
2. Use appropriate selectors for widget elements
3. Include responsive design tests
4. Test error conditions
5. Update this README

### Updating Tests
- Keep tests in sync with widget changes
- Maintain backward compatibility
- Update selectors when UI changes
- Add new functionality tests as needed

## Troubleshooting

### Widget Server Issues
```bash
# Check if server is running
curl http://localhost:8082/widget-test.html

# Restart server
pkill -f "python3 -m http.server 8082"
cd dist-widget && python3 -m http.server 8082
```

### Test Failures
1. Check browser console for errors
2. Verify widget is loading correctly
3. Check network requests in DevTools
4. Run tests with `--headed` flag for visual debugging

### Performance Issues
1. Check memory usage in performance tests
2. Verify bundle size is reasonable
3. Monitor load times
4. Check for memory leaks in long sessions
