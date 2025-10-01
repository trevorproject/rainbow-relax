# Rainbow Relax Widget

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/trevorproject/rainbow-relax)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen)](https://trevorproject.github.io/rainbow-relax/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

An embeddable breathing exercise widget that guides users through the 4-7-8 breathing technique. Designed for easy integration into any website with a single script tag, supporting both full applications and lightweight widget deployments.

## 🌟 Features

- **4-7-8 Breathing Technique**: Guided breathing exercises with visual circles
- **Multilingual Support**: English and Spanish with i18n
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dual Architecture**: Full React app + embeddable widget
- **Audio Guidance**: Optional voice instructions and background music
- **Memory Optimized**: Efficient asset loading and cleanup
- **Error Resilient**: Comprehensive error handling for embedded environments
- **Easy Integration**: Single script tag deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Modern browser with ES2015 support

### Installation

```bash
# Clone the repository
git clone https://github.com/trevorproject/rainbow-relax.git
cd rainbow-relax

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the full application.

## 📦 Widget Integration

### Basic Integration

Add this to your HTML page:

```html
<div id="rainbow-relax-container" style="width: 500px; height: 500px;"></div>
<script>
  (function(w, d, s, src, id) {
    if (d.getElementById(id)) return;
    var js = d.createElement(s);
    js.id = id;
    js.src = src;
    js.async = true;
    d.head.appendChild(js);
  })(window, document, "script", "https://trevorproject.github.io/rainbow-relax/rainbowRelax.js", "rainbow-relax");

  window.myWidgetConfig = {
    showQuickExit: false,
    donateURL: 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
    getHelpURL: 'https://www.thetrevorproject.mx/ayuda/',
    width: '500px',
    height: '500px',
    containerId: "rainbow-relax-container",
    cdnBase: "https://trevorproject.github.io/rainbow-relax/assets/",
    audioEnabled: true
  };
</script>
```

### Configuration Options

| Option          | Type    | Default                     | Description                  |
| --------------- | ------- | --------------------------- | ---------------------------- |
| `showQuickExit` | boolean | `false`                     | Show quick exit instructions |
| `donateURL`     | string  | PayPal URL                  | Donation link                |
| `getHelpURL`    | string  | Trevor Project URL          | Help/support link            |
| `width`         | string  | `'500px'`                   | Widget width                 |
| `height`        | string  | `'500px'`                   | Widget height                |
| `containerId`   | string  | `'rainbow-relax-container'` | Container element ID         |
| `cdnBase`       | string  | Auto-detected               | CDN base URL for assets      |
| `audioEnabled`  | boolean | `true`                      | Enable audio features        |
| `debug`         | boolean | `false`                     | Enable debug logging         |

## 🛠️ Development

### Project Structure

```text
rainbow-relax/
├── src/
│   ├── components/          # React components
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # Internationalization
│   ├── router/             # Routing logic
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   └── widget/             # Widget-specific code
├── tests/                  # Test files
├── docs/                   # Documentation
└── dist-widget/            # Built widget files
```

### Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run dev:widget         # Start widget development server

# Building
npm run build              # Build full application
npm run build:widget       # Build widget bundle
npm run preview            # Preview production build

# Testing
npm run test               # Run all tests
npm run test:ui            # Run tests with UI
npm run test:qa            # Test QA environment
npm run test:coverage      # Run tests with coverage

# Linting & Formatting
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier

# Type Checking
npm run type-check         # Run TypeScript compiler
```

### Development Workflow

1. **Full App Development**:

   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

2. **Widget Development**:

   ```bash
   npm run dev:widget
   # Visit http://localhost:5173/widget-test.html
   ```

3. **Testing**:

   ```bash
   npm run test
   # Run specific test file
   npm run test -- BreathingExercise.spec.ts
   ```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **E2E Tests**: Full user workflows with Playwright
- **Performance Tests**: Memory usage and bundle size

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- --grep "BreathingExercise"

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Test Files

- `tests/e2e/` - End-to-end tests
- `tests/fixtures/` - Test data and helpers
- `tests/page-objects/` - Page object models
- `tests/setup/` - Test configuration

## 🏗️ Architecture

### Dual Architecture Design

The project supports two deployment modes:

1. **Full Application**: Complete React SPA with routing
2. **Embeddable Widget**: Lightweight, self-contained widget

### Key Architectural Decisions

- **Custom Navigation**: Replaced React Router with lightweight custom solution
- **Native Audio**: Uses HTML5 Audio instead of Howler.js for better performance
- **Asset Loading**: Custom lazy-loading system with CDN fallbacks
- **Scoped CSS**: Prefixed styles to prevent conflicts
- **Error Boundaries**: Comprehensive error handling for embedded environments

### Memory Optimization

- **Lazy Loading**: Assets loaded on demand
- **Blob Management**: Proper cleanup of blob URLs
- **Tree Shaking**: Unused code elimination
- **Single Bundle**: Reduced HTTP requests and memory fragmentation

## 📚 Documentation

- [Widget Integration Guide](./docs/widget-guide.md) - Detailed widget implementation
- [API Reference](./docs/api.md) - Component and hook documentation
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project

## 🚀 Deployment

### Environments

- **Development**: `https://trevorproject.github.io/rainbow-relax/dev/`
- **QA**: `https://trevorproject.github.io/rainbow-relax/qa/`
- **Production**: `https://trevorproject.github.io/rainbow-relax/`

### Build Process

```bash
# Build widget for production
npm run build:widget

# Files are output to dist-widget/
# - rainbowRelax.js (main widget bundle)
# - rainbow-relax.css (styles)
# - assets/ (images and logos)
# - sounds/ (audio files)
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. **Clone the repository** (if you haven't already)
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm run test`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Add tests for new features
- **Documentation**: Update docs for API changes
- **Type Safety**: Maintain TypeScript strict mode
- **Performance**: Consider memory usage and bundle size

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Add new breathing techniques or languages
- 📚 **Documentation**: Improve guides and examples
- 🧪 **Testing**: Add test coverage
- 🎨 **UI/UX**: Improve design and accessibility
- ⚡ **Performance**: Optimize bundle size and runtime performance

## 🐛 Troubleshooting

### Common Issues

**Widget not loading**:

- Check container ID matches configuration
- Verify CDN URLs are accessible
- Check browser console for errors

**Audio not working**:

- Ensure `audioEnabled: true` in config
- Check browser autoplay policies
- Verify audio files are accessible

**Styling conflicts**:

- Widget uses scoped CSS with `rr-` prefix
- Check for conflicting CSS in host page

### Debug Mode

Enable debug logging:

```javascript
window.myWidgetConfig = {
  // ... other config
  debug: true
};
```

## 📄 License

This project is licensed under the [GPL v3.0 License](https://choosealicense.com/licenses/gpl-3.0/) - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Trevor Project** - Mental health support and resources
- **React Community** - Excellent documentation and tools
- **Contributors** - Everyone who has helped improve this project

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/trevorproject/rainbow-relax/issues)
- **The Trevor Project**: [Get help and support](https://www.thetrevorproject.org/)
- **Documentation**: Check the [docs](./docs/) folder for detailed guides

---

## Made with ❤️ for mental health and wellness
