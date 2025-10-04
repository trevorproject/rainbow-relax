# Widget Deployment Strategy

## Current Status

The `dist-widget` folder is currently ignored by git (see `.gitignore` line 14). This is actually a **good practice** for build artifacts, but requires a proper deployment strategy.

## Why dist-widget is Ignored

✅ **Benefits:**
- Prevents build artifacts from cluttering the repository
- Reduces repository size
- Avoids merge conflicts on generated files
- Keeps the repository clean and focused on source code

⚠️ **Considerations:**
- Widget files need to be built and deployed separately
- Requires CI/CD pipeline or manual deployment process
- Need to ensure widget is always available for testing

## Deployment Options

### Option 1: CI/CD Pipeline (Recommended)
```yaml
# Example GitHub Actions workflow
name: Build and Deploy Widget
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-widget:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:widget
      - name: Deploy to CDN
        # Deploy dist-widget contents to CDN or hosting service
```

### Option 2: Include Specific Widget Files
Add to `.gitignore`:
```
dist-widget/*
!dist-widget/widget-test.html
!dist-widget/comprehensive-test.html
!dist-widget/rainbowRelax.js
!dist-widget/style.css
!dist-widget/assets/
```

### Option 3: Separate Widget Repository
- Create a separate repository for the built widget
- Use GitHub Pages or similar for hosting
- Automate deployment from main repository

## Current Widget Files

The widget consists of:
- `rainbowRelax.js` - Main widget JavaScript bundle
- `style.css` - Widget CSS styles
- `assets/` - Static assets (images, sounds, translations)
- `widget-test.html` - Basic test page
- `comprehensive-test.html` - Multi-dimension test page

## Testing Strategy

1. **Local Development**: Use `npm run build:widget` to build locally
2. **CI Testing**: Run widget tests in CI pipeline
3. **Staging**: Deploy to staging environment for testing
4. **Production**: Deploy to production CDN/hosting

## Recommendations

1. **Keep current .gitignore** - It's following best practices
2. **Implement CI/CD** - Automate widget building and deployment
3. **Use CDN** - Host widget files on a CDN for better performance
4. **Version Control** - Tag widget releases for version management
5. **Documentation** - Keep deployment docs updated

## Quick Fix for Development

If you need to include widget files in git temporarily:

```bash
# Remove from .gitignore temporarily
sed -i 's/dist-widget/#dist-widget/' .gitignore

# Add widget files
git add dist-widget/
git commit -m "Add widget build files"

# Restore .gitignore
git checkout .gitignore
```

**Note**: This is only recommended for development/testing purposes.
