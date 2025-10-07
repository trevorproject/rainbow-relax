# Rainbow Relax

An open-source application designed to guide and support users in practicing the 4-7-8 breathing technique, an effective strategy for reducing anxiety and stress. The app provides visual and auditory instructions to help synchronize breathing, creating a calming environment with soothing sounds and an intuitive interface.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/trevorproject/rainbow-relax.git
cd rainbow-relax

# Install dependencies
npm install
```

### Development

#### Option 1: Auto Port Detection (Recommended)

```bash
# Start dev server and automatically open test page with correct port
npm run dev:test
```

This will:
- Start the Vite dev server
- Automatically detect the correct port (5173, 5174, 5175, etc.)
- Open the test page with the correct port configuration

#### Option 2: Manual Testing

```bash
# Start the widget development server
npm run dev
```

Then visit: **http://localhost:5173/test-pages/dynamic-test.html** (auto-detects port)

The test page will automatically find and use the correct port regardless of which port the dev server starts on.

## 🧪 Testing the Widget

### Local Testing (Recommended for Development)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the test page:**
   Navigate to: **http://localhost:5173/test-pages/dynamic-test.html**

3. **Test widget functionality:**
   - Use dimension sliders to test different widget sizes
   - Try preset buttons (Small, Medium, Large, etc.)
   - Switch between English/Spanish languages
   - Test the breathing exercise functionality
   - Verify logo positioning and animations

### Automated Testing

```bash
# Run all widget tests
npm run test

# Run tests with browser visible (for debugging)
npm run test:headed

# Run tests with UI interface
npm run test:ui

# View test reports
npm run test:report
```


## 🏗️ Building the Widget

```bash
# Build the widget for production
npm run build
```

The built widget files will be in the `dist-widget/` directory:
- `rainbowRelax.js` - Widget JavaScript bundle
- `style.css` - Widget CSS styles
- `assets/` - Widget assets (logos, audio, etc.)

## 📦 Widget Integration

The widget is designed to be embedded in any website. Here's how to integrate it:

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Widget container -->
    <div id="rainbow-relax-container"></div>
    
    <!-- Widget script -->
    <script src="https://your-cdn.com/rainbow-relax/rainbowRelax.js"></script>
    
    <!-- Widget CSS -->
    <link rel="stylesheet" href="https://your-cdn.com/rainbow-relax/style.css">
    
    <script>
        // Configure the widget
        window.myWidgetConfig = {
            containerId: 'rainbow-relax-container',
            width: '600px',
            height: '400px',
            language: 'en',
            audioEnabled: true,
            cdnBase: 'https://your-cdn.com/rainbow-relax/',
            assetBase: 'https://your-cdn.com/rainbow-relax/assets/',
            audioBase: 'https://your-cdn.com/rainbow-relax/sounds/'
        };
    </script>
</body>
</html>
```

### Configuration Options

| Option              | Type    | Default                     | Description                  |
| ------------------- | ------- | --------------------------- | ---------------------------- |
| `containerId`       | string  | `'rainbow-relax-container'` | ID of the container element  |
| `width`             | string  | `'500px'`                   | Widget width                 |
| `height`            | string  | `'500px'`                   | Widget height                |
| `language`          | string  | `'en'`                      | Language (`'en'` or `'es'`)  |
| `audioEnabled`      | boolean | `true`                      | Enable/disable audio         |
| `cdnBase`           | string  | `''`                        | Base URL for widget assets   |
| `assetBase`         | string  | `''`                        | Base URL for images          |
| `audioBase`         | string  | `''`                        | Base URL for audio files     |
| `showQuickExit`     | boolean | `false`                     | Show quick exit button       |
| `donateURL`         | string  | PayPal URL                  | Donation link                |
| `getHelpURL`        | string  | Trevor Project URL          | Help/support link            |
| `GTAG`              | string  | `null`                      | Google Analytics tracking ID |
| `showConsentBanner` | boolean | `true`                      | Show GDPR consent banner     |

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

## 🚀 Deployment

The widget is deployed to GitHub Pages with three environments: DEV, QA, and PROD.

### Development Deployment (DEV)

**Automatic deployment** - triggers on every push to `main` branch:

```bash
# Make your changes and commit them
git add .
git commit -m "Your changes"
git push origin main
```

- **URL**: https://trevorproject.github.io/rainbow-relax/dev/
- **Trigger**: Push to `main` branch
- **Status**: Check GitHub Actions → "Deploy to DEV"

### QA Deployment

**Manual deployment** - requires creating a QA tag:

```bash
# Create and push a QA tag
git tag qa-v1.0.0
git push origin qa-v1.0.0
```

- **URL**: https://trevorproject.github.io/rainbow-relax/qa/
- **Trigger**: Push tag with `qa-` prefix
- **Status**: Check GitHub Actions → "Deploy to QA"

### Production Deployment (PROD)

**Manual deployment** - requires creating a PROD tag:

```bash
# Create and push a PROD tag
git tag prod-v1.0.0
git push origin prod-v1.0.0
```

- **URL**: https://trevorproject.github.io/rainbow-relax/prod/
- **Trigger**: Push tag with `prod-` prefix
- **Status**: Check GitHub Actions → "Deploy to PROD"

### Deployment Verification

After deployment, verify the widget works correctly:

1. **Visit the deployment URL**
2. **Test widget functionality:**
   - Widget loads correctly
   - Language switching works
   - Breathing exercise functions properly
   - Audio plays (if enabled)
   - Logo displays correctly
3. **Check browser console** for any errors
4. **Test on different devices** (mobile, tablet, desktop)

### Pre-Deployment Checklist

Before deploying to QA or PROD:

- [ ] **Local testing passed**: Widget works on `http://localhost:5173/test-pages/dynamic-test.html`
- [ ] **Automated tests passed**: `npm run test` completes successfully
- [ ] **Build successful**: `npm run build:widget` completes without errors
- [ ] **No console errors**: Check browser console for JavaScript errors
- [ ] **Responsive design**: Test on different screen sizes
- [ ] **Cross-browser testing**: Test in Chrome, Firefox, Safari, Edge
- [ ] **Performance check**: Widget loads quickly and animations are smooth

## 🔧 Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally:
   ```bash
   npm run dev
   # Test at http://localhost:5173/test-pages/dynamic-test.html
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** to merge into `main`

### Testing Changes

- **Local Development**: Use `npm run dev` and test at `http://localhost:5173/test-pages/dynamic-test.html`
- **Automated Tests**: Run `npm run test` to ensure all tests pass
- **Manual Testing**: Use the dynamic test page to verify functionality
- **Cross-browser**: Test in different browsers and devices

## 🐛 Troubleshooting

### Common Issues

**Widget not loading:**
- Check browser console for errors
- Verify the server is running on the correct port
- Ensure all assets are accessible

**Resizing not working:**
- Check that CSS custom properties are set correctly
- Verify the widget container has the correct ID
- Ensure the widget CSS is loaded

**Audio not playing:**
- Check browser audio permissions
- Verify audio files are accessible
- Check console for audio-related errors

**Language switching broken:**
- Verify flag images are loading
- Check that language files are accessible
- Ensure the language toggle is properly configured

### Debug Commands

```bash
# Run tests with browser visible
npm run test:headed

# Run tests with debug output
npm run test:debug

# Check widget manually
open http://localhost:5173/test-pages/dynamic-test.html
```

### Getting Help

- **Check the console** for error messages
- **Review the test documentation** in `tests/README.md`
- **Check the test pages documentation** in `test-pages/README.md`
- **Run automated tests** to identify issues

## 🎯 Key Features

- **4-7-8 Breathing Technique**: Guided breathing exercises with visual cues
- **Multi-language Support**: English and Spanish interfaces
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Audio Guidance**: Voice instructions and soothing sounds
- **Embeddable Widget**: Easy integration into any website
- **Accessibility**: Screen reader friendly and keyboard navigation
- **Customizable**: Configurable dimensions, themes, and features

## 📋 Available Scripts

| Script                | Description                            |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Start development server               |
| `npm run dev:test`    | Start dev server + auto-open test page |
| `npm run build`       | Build widget for production            |
| `npm run test`        | Run automated tests                    |
| `npm run test:ui`     | Run tests with UI interface            |
| `npm run test:headed` | Run tests with browser visible         |
| `npm run test:report` | View test reports                      |
| `npm run lint`        | Run ESLint                             |

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test locally
4. **Run tests**: `npm run test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## 📄 License

This project is licensed under the [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)

## 🎵 Audio Credits

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
