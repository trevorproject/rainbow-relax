# Rainbow Relax

An open-source application designed to guide and support users in practicing the 4-7-8 breathing technique, an effective strategy for reducing anxiety and stress. The app would provide visual and auditory instructions to help synchronize breathing, creating a calming environment with soothing sounds and an intuitive interface. Additionally, it would include personalized reminders and progress tracking to encourage consistent practice. Its goal is to offer an accessible and effective tool to reassure users during moments of emotional or nervous distress.

## Installation

You must have Git and NodeJS on your terminal.

```bash
    git clone [Repository-Link]
    cd Breathing-exercise
```

To install dependencies:

```bash
    npm install
```

To run project in development enviroment:

```bash
    npm run dev
```

# Embedding Options

When embedding the Rainbow Relax application in another site (e.g., via an `<iframe>`), you can control specific behaviors via URL parameters.

## Quick Escape (`showquickescape`)

- **Type:** `boolean` (`true` or `false`)
- **Default:** `false`
- **Description:** Controls whether the Quick Escape instructions are visible when the app is embedded.

### Example

```html
<iframe src="https://trevorproject.github.io/rainbow-relax/dev/?showquickescape=true" width="100%" height="600"></iframe>
```

## Asset Customization

### Logo (`logoUrl`)

- **Type:** `string` (URL)
- **Default:** Trevor Project logo (language-specific)
- **Description:** Replace the default Trevor Project logo with your organization's logo.
- **Requirements:**
  - Must be HTTPS URL
  - Recommended: Square aspect ratio (1:1)
  - Recommended size: 150x150px to 300x300px
  - Supported formats: SVG, PNG, JPG, WebP

### Audio Files

#### Background Audio (`backgroundUrl`)

- **Type:** `string` (URL)
- **Default:** Default ambient background audio
- **Description:** Custom background audio that plays during the breathing exercise.
- **Requirements:**
  - Must be HTTPS URL
  - Supported formats: MP3, WAV, OGG
  - Recommended: 2-5 minute loopable audio

#### Instructions Audio (`instructionsUrl`)

- **Type:** `string` (URL)
- **Default:** Default instruction audio
- **Description:** Custom audio for breathing exercise instructions.
- **Requirements:**
  - Must be HTTPS URL
  - Supported formats: MP3, WAV, OGG
  - Recommended: Clear, calm voice

#### Guided Voice (`guidedVoiceUrl`)

- **Type:** `string` (URL)
- **Default:** Default guided voice
- **Description:** Custom guided voice for the breathing exercise.
- **Requirements:**
  - Must be HTTPS URL
  - Supported formats: MP3, WAV, OGG
  - Recommended: Calm, soothing voice

#### Breathing Cycle Audio (`audioUrl`)

- **Type:** `string` (URL)
- **Default:** Default breathing cycle audio
- **Description:** Custom audio for the breathing cycle (inhale, hold, exhale).
- **Requirements:**
  - Must be HTTPS URL
  - Supported formats: MP3, WAV, OGG
  - Recommended: Subtle, non-distracting audio

## Navigation Customization

### Donation Button (`donationUrl`)

- **Type:** `string` (URL) or `"no"`
- **Default:** Trevor Project donation page
- **Description:** Custom donation page URL or hide the donation button entirely.
- **Special Values:**
  - `"no"` - Hides the donation button
  - Any valid URL - Redirects to custom donation page

### Help Button (`helpUrl`)

- **Type:** `string` (URL) or `"no"`
- **Default:** Trevor Project help page
- **Description:** Custom help page URL or hide the help button entirely.
- **Special Values:**
  - `"no"` - Hides the help button
  - Any valid URL - Redirects to custom help page

### Home/Logo Link (`homeUrl`)

- **Type:** `string` (URL) or `"no"`
- **Default:** Trevor Project homepage
- **Description:** Custom home page URL when clicking the logo or hide the home link entirely.
- **Special Values:**
  - `"no"` - Removes home link functionality from logo
  - Any valid URL - Redirects to custom home page

## Complete Examples

### Basic Embed

```html
<iframe src="https://rainbowrelax.web.app/" width="100%" height="600"></iframe>
```

### Custom Branding

```html
<iframe 
  src="https://rainbowrelax.web.app/?logoUrl=https://example.com/logo.svg&backgroundUrl=https://example.com/ambient.mp3" 
  width="100%" 
  height="600">
</iframe>
```

### Hidden Navigation

```html
<iframe 
  src="https://rainbowrelax.web.app/?donationUrl=no&helpUrl=no&homeUrl=no" 
  width="100%" 
  height="600">
</iframe>
```

### All Parameters

```html
<iframe 
  src="https://rainbowrelax.web.app/?showquickescape=true&logoUrl=https://example.com/logo.svg&backgroundUrl=https://example.com/ambient.mp3&instructionsUrl=https://example.com/instructions.mp3&guidedVoiceUrl=https://example.com/voice.mp3&audioUrl=https://example.com/breathing.mp3&donationUrl=https://example.com/donate&helpUrl=https://example.com/help&homeUrl=https://example.com" 
  width="100%" 
  height="600">
</iframe>
```

## Best Practices & Notes

### Security & Performance

- **HTTPS Required:** All custom asset URLs must use HTTPS for security
- **CORS Headers:** Ensure your asset servers include proper CORS headers
- **CDN Recommended:** Use a CDN for better performance and reliability
- **Asset Optimization:** Compress images and audio files for faster loading

### Audio Guidelines

- **Format Priority:** MP3 > WAV > OGG (for best browser compatibility)
- **Quality:** 128kbps is sufficient for most use cases
- **Duration:** Keep audio files under 5MB for optimal loading
- **Testing:** Test audio playback across different browsers and devices

### Image Guidelines

- **Format Priority:** SVG > PNG > WebP > JPG
- **Aspect Ratio:** Square (1:1) works best with the existing layout
- **Size Range:** 150x150px to 300x300px recommended
- **Fallback:** The app will gracefully fall back to the default Trevor Project logo if your custom logo fails to load

### URL Encoding

When using special characters in URLs, ensure proper URL encoding:

```javascript
// Example: URL with spaces and special characters
const logoUrl = encodeURIComponent('https://example.com/my logo (v2).svg');
const iframeSrc = `https://rainbowrelax.web.app/?logoUrl=${logoUrl}`;
```

# Deployment

This project uses Firebase Hosting with three environments:

| Environment     | Site Name          | URL                              | Trigger               |
| --------------- | ------------------ | -------------------------------- | --------------------- |
| **Development** | `rainbowrelax-dev` | https://rainbowrelax-dev.web.app | Push to `main` branch |
| **QA**          | `rainbowrelax-qa`  | https://rainbowrelax-qa.web.app  | Push tag `qa-*`       |
| **Production**  | `rainbowrelax`     | https://rainbowrelax.web.app     | Push tag `prod-*`     |

---

### 1. Development (DEV)
Deploys automatically when pushing to the `main` branch.

**Steps:**
1. Commit your changes to the `main` branch
2. Push to trigger deployment:
   ```bash
   git push origin main
   ```
3. View deployment: https://rainbowrelax-dev.web.app
4. Monitor status: **Actions > Deploy to Firebase DEV**

---

### 2. Quality Assurance (QA)
Deploys when pushing a tag with the `qa-` prefix.

**Steps:**
1. Create and push a QA tag:
   ```bash
   git tag qa-0.4.14
   git push origin qa-0.4.14
   ```
2. View deployment: https://rainbowrelax-qa.web.app
3. Monitor status: **Actions > Deploy to Firebase QA**

---

### 3. Production (PROD)
Deploys when pushing a tag with the `prod-` prefix.

**Steps:**
1. Create and push a production tag:
   ```bash
   git tag prod-v1.0
   git push origin prod-v1.0
   ```
2. View deployment: https://rainbowrelax.web.app
3. Monitor status: **Actions > Deploy to Firebase PROD**

---
# CI/CD Pipeline

This project uses GitHub Actions for automated testing, linting, and deployment. All workflows run on pull requests and pushes to ensure code quality.

## Workflows

### 1. Lint Validation (`lint.yml`)
- **Triggers**: Pull requests and pushes to `main`
- **Purpose**: Validates code quality before merge
- **Runs**: ESLint and TypeScript compilation checks
- **Duration**: ~2-3 minutes
- **Benefit**: Prevents linting errors from reaching main branch, avoiding deployment failures

### 2. Playwright Tests (`playwright-tests.yml`)
- **Triggers**: Pull requests and pushes to `main`
- **Purpose**: Run end-to-end tests to ensure functionality
- **Runs:**
  - ESLint validation
  - TypeScript compilation
  - Build application
  - Run all 84+ E2E tests (using 4 parallel workers)
- **Duration**: ~5-7 minutes
- **Benefit**: Comprehensive validation before merge and deployment

### 3. Firebase Deployment Workflows

All deployment workflows use the reusable `firebase-deployment.yml` workflow which ensures:
1. ✅ ESLint validation passes
2. ✅ TypeScript compilation succeeds
3. ✅ Application builds successfully
4. ✅ Only validated code reaches production

#### Development Deployment (`firebase-dev.yml`)
- **Triggers**: Push to `main` branch
- **Includes**: Full validation (linting, TypeScript, build)
- **Deploy**: Automatically to `rainbowrelax-dev` site
- **URL**: https://rainbowrelax-dev.web.app

#### QA Deployment (`firebase-qa.yml`)
- **Triggers**: Push tag matching `qa-*` pattern
- **Includes**: Full validation before deployment
- **Deploy**: To `rainbowrelax-qa` site
- **URL**: https://rainbowrelax-qa.web.app

#### Production Deployment (`firebase-prod.yml`)
- **Triggers**: Push tag matching `prod-*` pattern
- **Includes**: Full validation before deployment
- **Deploy**: To `rainbowrelax` site
- **URL**: https://rainbowrelax.web.app

## Workflow Integration

The CI/CD pipeline ensures that:
- **Pull Requests**: Lint validation and tests run automatically
- **Main Branch**: All validations pass before any deployment
- **Deployments**: Only validated code reaches DEV, QA, and PROD environments

This prevents duplicate PRs caused by linting failures and ensures only tested, validated code is deployed.

## Local Development

Before pushing, run locally to catch issues early:

```bash
npm run lint        # Check for linting errors
npm run typecheck   # Verify TypeScript compilation
npm run build       # Verify build works
npm run test:e2e    # Run all tests
npm run precommit   # Run all checks (typecheck + lint + e2e tests)
```

---
## Testing

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing. Playwright enables us to test the application by automating real browser interactions, ensuring that all features work correctly across different scenarios.

### Overview

Our test suite includes 84+ E2E tests covering:
- Homepage loading and responsive design
- Navigation and language switching
- Breathing exercise functionality
- Widget configuration and customization

Tests run automatically in our CI/CD pipeline on every pull request and push to `main`, ensuring code quality before deployment. See the [CI/CD Pipeline](#cicd-pipeline) section for more details.

### Quick Start

To run tests locally, use the following commands:

```bash
npm run test:e2e            # Run all E2E tests
npm run test:e2e:ui         # Interactive test runner (great for debugging!)
npm run test:e2e:headed     # Run tests with visible browser
npm run test:e2e:report     # View detailed test reports
```

**Prerequisites:**
- Install Playwright browsers: `npx playwright install chromium`
- Development server must be running (tests use `http://localhost:3000`)

### Testing Bandwidth Consent Feature

The app includes a bandwidth consent prompt that appears for users on slow connections (3G, 2G, slow-2G) before loading heavy assets. To test this feature locally:

#### Quick Start

1. **Build with asset size calculation:**
   ```bash
   npm run build:performance
   ```
   This builds the app and calculates total asset size, creating `dist/app-size.json`.

2. **Start preview server:**
   ```bash
   npm run preview
   ```

3. **Simulate slow connection in browser:**
   - Open DevTools (F12)
   - Go to Console tab
   - Run this code:
   ```javascript
   Object.defineProperty(navigator, 'connection', {
     writable: true,
     value: { effectiveType: '3g', downlink: 1.5, rtt: 600, saveData: false }
   });
   location.reload();
   ```

4. **Test the flow:**
   - Navigate to the app (should redirect to `/consent`)
   - Consent prompt should appear with asset size estimate
   - Test "Load Full Experience" button (should consent and redirect)
   - Test "Stay Lightweight" button (should keep you blocked)

#### Testing Scenarios

- **Slow Connection**: Prompt appears with size estimate
- **Fast Connection**: Auto-consents and redirects (no prompt)
- **No Connection API**: Auto-consents (assumes fast connection)
- **After Consent**: App works normally, no re-prompt

#### Verifying Asset Size

After building, check the generated file:
```bash
cat dist/app-size.json
```

### Detailed Documentation

For comprehensive testing documentation, including:
- Writing your first test
- Test architecture and best practices
- Debugging tips and troubleshooting
- Common testing patterns

See the **[Testing README](tests/README.md)** for complete details.

---
## Widget Parameter Persistence

The application automatically preserves widget configuration parameters across React Router navigation. This ensures that custom branding and configuration (logoUrl, audioUrl, etc.) persist when users navigate between pages.

### How It Works

Widget configuration parameters are automatically extracted from URL query parameters and preserved during navigation:

- **Internal Navigation**: All internal links use `useNavigateWithParams()` hook or `NavLinkWithParams` component
- **Parameter Preservation**: These components automatically append widget config parameters to navigation URLs
- **Supported Parameters**: `logoUrl`, `backgroundUrl`, `instructionsUrl`, `guidedVoiceUrl`, `audioUrl`, `donationUrl`, `helpUrl`, `homeUrl`

### Developer Usage

**For Programmatic Navigation:**
```typescript
import { useNavigateWithParams } from '../hooks/useNavigateWithParams';

function MyComponent() {
  const navigate = useNavigateWithParams();
  
  // Navigate with automatic parameter preservation
  navigate('/breathing');
  navigate('/thank-you', { state: { minutes: 3 } });
}
```

**For Declarative Navigation:**
```typescript
import { NavLinkWithParams } from '../components/common/NavLinkWithParams';

function MyComponent() {
  return (
    <NavLinkWithParams to="/breathing">
      Start Exercise
    </NavLinkWithParams>
  );
}
```

**External Links:**
External links (donation, help, home) use standard `<a>` tags with `target="_blank"` and `rel="noopener"` for security.

### Implementation Details

- `navigationHelpers.ts`: Utility functions for extracting and building URLs with widget parameters
- `useNavigateWithParams.ts`: Custom hook wrapping React Router's `useNavigate` with parameter preservation
- `NavLinkWithParams.tsx`: Enhanced NavLink component with automatic parameter preservation

---
# Audio Credits

Español: Abraham Roldán (elle/they/them/él/he/him)
English: Chris Camacho (elle/they/them)

## Authors

- [The Trevor Project] https://www.thetrevorproject.org/

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
