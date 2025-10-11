# Firebase Hosting Setup Guide

This document provides comprehensive instructions for setting up and managing Firebase Hosting deployment for the Rainbow Relax application.

## Prerequisites

- Firebase project: `rainbowrelax-46f61`
- GitHub repository with Actions enabled
- Firebase CLI installed locally (optional, for testing)

## Required GitHub Secrets

You need to set up the following secrets in your GitHub repository:

### 1. FIREBASE_TOKEN
- **Purpose**: Authenticates GitHub Actions with Firebase
- **How to get it**:
  1. Install Firebase CLI locally: `npm install -g firebase-tools`
  2. Login to Firebase: `firebase login`
  3. Generate token: `firebase login:ci`
  4. Copy the generated token
- **Where to set**: GitHub Repository → Settings → Secrets and variables → Actions → New repository secret

### 2. FIREBASE_PROJECT_ID
- **Purpose**: Identifies the Firebase project for deployment
- **Value**: `rainbowrelax-46f61`
- **Where to set**: GitHub Repository → Settings → Secrets and variables → Actions → Variables (not secret)

### 3. Environment Variables (Optional)
- **VITE_GTAG**: Google Analytics tracking ID
- **BASE_URL**: Base URL for the application

## Firebase Project Configuration

### Hosting Sites
The application will be deployed to different Firebase hosting sites based on the environment:

- **Develop**: `https://rainbowrelax-dev.web.app` (main branch)
- **QA**: `https://rainbowrelax-qa.web.app` (qa-** tags)
- **Live**: `https://rainbowrelax-prod.web.app` (prod-** tags)

*Note: Each environment has its own dedicated hosting site for proper isolation.*

### Multi-Site Architecture

This setup uses Firebase Hosting's multi-site feature to create separate hosting sites for each environment:

- **Site Isolation**: Each environment (dev, qa, prod) has its own Firebase hosting site
- **Independent Deployments**: Changes to one environment don't affect others
- **Environment-Specific Configuration**: Each site can have different environment variables and settings
- **Clear URLs**: Each environment has a predictable, hardcoded URL that won't change

**Benefits:**
- Complete environment isolation
- No risk of cross-environment contamination
- Easy to identify which environment you're viewing
- Simplified debugging and testing

### Firebase Configuration Files

#### firebase.json
```json
{
  "hosting": [
    {
      "target": "dev",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{"source": "**", "destination": "/index.html"}],
      "headers": [
        {
          "source": "**/*.@(js|css)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        }
      ]
    },
    {
      "target": "qa",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{"source": "**", "destination": "/index.html"}],
      "headers": [
        {
          "source": "**/*.@(js|css)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        }
      ]
    },
    {
      "target": "prod",
      "public": "dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [{"source": "**", "destination": "/index.html"}],
      "headers": [
        {
          "source": "**/*.@(js|css)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        },
        {
          "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
          "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
        }
      ]
    }
  ]
}
```

#### .firebaserc
```json
{
  "projects": {
    "default": "rainbowrelax-46f61"
  },
  "targets": {
    "rainbowrelax-46f61": {
      "hosting": {
        "dev": ["rainbowrelax-dev"],
        "qa": ["rainbowrelax-qa"],
        "prod": ["rainbowrelax-prod"]
      }
    }
  }
}
```

#### .gitignore
The following Firebase-related files and directories are automatically ignored:
```
# Firebase
.firebase/
firebase-debug.log
firebase-debug.*.log
.firebaserc.local
firebase.json.local
```

**Why these files are ignored:**
- **`.firebase/`**: Contains local Firebase cache and temporary files (e.g., `hosting.ZGlzdA.cache`)
- **`firebase-debug.log*`**: Debug logs generated during Firebase operations
- **`.firebaserc.local`**: Local Firebase configuration overrides (if any)
- **`firebase.json.local`**: Local Firebase hosting configuration overrides (if any)

These files are either temporary, contain sensitive information, or are specific to individual developer environments. They should not be committed to version control.

## Deployment Workflows

### 1. Development Deployment
- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/firebase-dev.yml`
- **Environment**: `develop`
- **URL**: `https://rainbowrelax-dev.web.app`

### 2. QA Deployment
- **Trigger**: Push tag with `qa-` prefix (e.g., `qa-v1.0`)
- **Workflow**: `.github/workflows/firebase-qa.yml`
- **Environment**: `qa`
- **URL**: `https://rainbowrelax-qa.web.app`

### 3. Production Deployment
- **Trigger**: Push tag with `prod-` prefix (e.g., `prod-v1.0`)
- **Workflow**: `.github/workflows/firebase-prod.yml`
- **Environment**: `live`
- **URL**: `https://rainbowrelax-prod.web.app`

## Manual Deployment via Firebase CLI

For testing, debugging, or one-off deployments, you can deploy directly using the Firebase CLI.

### Prerequisites for Manual Deployment

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```
   This will open a browser window for authentication.

3. **Verify Project Access**:
   ```bash
   firebase projects:list
   ```
   You should see `rainbowrelax-46f61` in the list.

### Manual Deployment Steps

#### Step 1: Build the Application
```bash
# Install dependencies
npm install

# Build the application
npm run build
```

#### Step 2: Deploy to Firebase
```bash
# Deploy to the project
firebase deploy --only hosting --project rainbowrelax-46f61
```

#### Step 3: Verify Deployment
- The CLI will output the deployment URL
- Visit the URL to verify the deployment
- Check the Firebase Console for deployment history

### Manual Deployment Commands

#### Deploy to DEV Environment
```bash
firebase deploy --only hosting:dev --project rainbowrelax-46f61
```

#### Deploy to QA Environment
```bash
firebase deploy --only hosting:qa --project rainbowrelax-46f61
```

#### Deploy to PROD Environment
```bash
firebase deploy --only hosting:prod --project rainbowrelax-46f61
```

#### Deploy with Debug Information
```bash
firebase deploy --only hosting:dev --project rainbowrelax-46f61 --debug
```

#### Deploy and Open in Browser
```bash
firebase deploy --only hosting:dev --project rainbowrelax-46f61 --open
```

#### Deploy with Custom Message
```bash
firebase deploy --only hosting:dev --project rainbowrelax-46f61 --message "Custom deployment message"
```

### Troubleshooting Manual Deployment

#### Common Issues and Solutions

**1. Authentication Error**
```bash
# Re-login to Firebase
firebase logout
firebase login
```

**2. Project Not Found**
```bash
# List available projects
firebase projects:list

# Set default project
firebase use [PROJECT_ID]
```

**3. Build Errors**
```bash
# Check for TypeScript errors
npm run build

# Or build with Vite directly
npx vite build
```

**4. Permission Denied**
- Ensure you have the correct Firebase project permissions
- Contact the project owner for access

### Manual Deployment vs GitHub Actions

| Aspect | Manual CLI | GitHub Actions |
|--------|-------------|----------------|
| **Speed** | Immediate | ~2-3 minutes |
| **Authentication** | Interactive login | Token-based |
| **Environment** | Local machine | GitHub runners |
| **Use Case** | Testing, debugging | Production, CI/CD |
| **Access** | Requires local setup | Repository access only |

### Best Practices for Manual Deployment

1. **Always test locally first**:
   ```bash
   npm run dev
   # Test at http://localhost:3000
   ```

2. **Build before deploying**:
   ```bash
   npm run build
   # Verify dist/ folder exists
   ```

3. **Check deployment status**:
   ```bash
   firebase hosting:channel:list --project [PROJECT_ID]
   ```

4. **Use descriptive messages**:
   ```bash
   firebase deploy --only hosting --project [PROJECT_ID] --message "Fix: Updated breathing instructions"
   ```

## Testing Deployments

### Test Development Deployment
```bash
# Push to main branch
git add .
git commit -m "Test dev deployment"
git push origin main
# Should deploy to: https://rainbowrelax-dev.web.app
```

### Test QA Deployment
```bash
# Create and push QA tag
git tag qa-v1.0
git push origin qa-v1.0
# Should deploy to: https://rainbowrelax-qa.web.app
```

### Test Production Deployment
```bash
# Create and push production tag
git tag prod-v1.0
git push origin prod-v1.0
# Should deploy to: https://rainbowrelax-prod.web.app
```

## Troubleshooting

### Common Issues

#### 1. Firebase Authentication Error
**Error**: `Error: Authentication failed`
**Solution**: 
- Verify `FIREBASE_TOKEN` secret is correctly set
- Regenerate token using `firebase login:ci`
- Ensure token has proper permissions

#### 2. Build Failures
**Error**: Build step fails
**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs for specific errors

#### 3. Deployment Timeout
**Error**: Deployment times out
**Solution**:
- Check Firebase project status
- Verify hosting is enabled
- Review Firebase console for errors

#### 4. Environment Variables Not Loading
**Error**: Environment variables not available during build
**Solution**:
- Verify variables are set in GitHub repository settings
- Check variable naming (case-sensitive)
- Ensure variables are set for the correct environment

### Debugging Steps

1. **Check GitHub Actions Logs**:
   - Go to Actions tab in GitHub
   - Click on the failed workflow
   - Review step-by-step logs

2. **Verify Firebase Project**:
   - Login to Firebase Console
   - Check hosting status
   - Verify project permissions

3. **Test Locally**:
   ```bash
   npm install
   npm run build
   firebase serve
   ```

4. **Check Firebase CLI**:
   ```bash
   firebase projects:list
   firebase hosting:sites:list
   ```

## Migration from GitHub Pages

### What Changed
- **Deployment Target**: GitHub Pages → Firebase Hosting
- **Build Process**: Same Vite build process
- **Environment Variables**: Same environment variable handling
- **Triggers**: Same branch/tag triggers maintained

### Benefits of Firebase Hosting
- **Better Performance**: Global CDN with edge caching
- **Custom Domains**: Easy custom domain setup
- **SSL Certificates**: Automatic SSL certificate management
- **Rollback Support**: Easy rollback to previous deployments
- **Analytics**: Built-in hosting analytics

## Monitoring and Maintenance

### Regular Checks
- Monitor deployment success rates
- Review Firebase hosting analytics
- Check for build warnings/errors
- Verify environment variable updates

### Updates
- Keep Firebase CLI updated
- Monitor GitHub Actions runner updates
- Review and update dependencies regularly

## Support

For issues related to:
- **Firebase**: Check Firebase Console and documentation
- **GitHub Actions**: Review GitHub Actions documentation
- **Build Process**: Check Vite and React documentation
- **Project Specific**: Contact the development team