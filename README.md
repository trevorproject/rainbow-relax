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

## `showquickescape` (optional)

- **Type:** `boolean` (`true` or `false`)
- **Default:** `false`
- **Description:** Controls whether the Quick Escape instructions are visible when the app is embedded.

### Example

```html
<iframe src="https://trevorproject.github.io/rainbow-relax/dev/?showquickescape=true" width="100%" height="600"></iframe>
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
- **Runs**: 
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
npx tsc --noEmit    # Verify TypeScript compilation
npm run build       # Verify build works
npm run test:e2e    # Run all tests
```

---
# Audio Credits

### Voice Generation
The voice instructions in this application were generated using **ElevenLabs** AI voice synthesis technology.

- **Voice Model Used**: Nathaniel C - Suspense,British calm
- **Platform**: [ElevenLabs](https://elevenlabs.io/)
- **Usage**: Voice instructions for breathing exercises and guided meditation

*All voice content was generated specifically for this open-source project to provide accessible breathing exercise guidance.*

## Authors

- [The Trevor Project] https://www.thetrevorproject.org/

## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
