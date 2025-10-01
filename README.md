# Rainbow Relax Widget

An embeddable breathing exercise widget that guides users through the 4-7-8 breathing technique to help with stress and anxiety relief. Built by The Trevor Project, this widget provides a safe, accessible way for users to practice mindfulness and breathing exercises directly on any website.

## Features

- **4-7-8 Breathing Technique**: Guided breathing exercise with visual animations
- **Multilingual Support**: English and Spanish language options
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Audio Guidance**: Optional voice instructions and background music
- **Easy Integration**: Single script tag implementation
- **Customizable**: Configurable dimensions, audio settings, and branding
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Performance Optimized**: Lightweight bundle with efficient loading

## Project Status

This project has evolved from a standalone React application to a focused, embeddable widget. The current implementation:

- ✅ **Widget-First Architecture**: Optimized for embedding in any website
- ✅ **Production Ready**: Deployed and accessible via CDN
- ✅ **Comprehensive Testing**: Full test coverage with Playwright E2E tests
- ✅ **Documentation**: Complete integration guides and examples
- ✅ **Performance Optimized**: Bundle size optimized for fast loading
- ✅ **Accessibility Compliant**: WCAG 2.1 AA standards met

## Quick Start

```bash
git clone https://github.com/trevorproject/rainbow-relax.git
cd rainbow-relax
npm install
npm run dev
```

## Widget Integration

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

### Advanced Integration Examples

Check out the `examples/` directory for:
- **React Integration** (`react-integration.jsx`): Component and hook patterns
- **WordPress Integration** (`wordpress-example.php`): Shortcode and widget implementation
- **HTML Embed Example** (`embed-example.html`): Complete working example

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

### JavaScript API

The widget exposes a global API for programmatic control:

```javascript
// Initialize widget manually
window.MyWidget.init();

// Destroy widget instance
window.MyWidget.destroy();

// Health check
const isHealthy = window.MyWidget.healthCheck();
```

### Events

Listen for widget lifecycle events:

```javascript
// Widget ready
window.addEventListener('rainbowRelaxWidgetReady', () => {
    console.log('Widget is ready');
});

// Widget destroyed
window.addEventListener('rainbowRelaxWidgetDestroyed', () => {
    console.log('Widget destroyed');
});
```

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
npm run dev          # Development server with hot reload
npm run build:widget # Build production widget bundle
npm run test         # Run comprehensive test suite
npm run lint         # Lint code with ESLint
```

### Development Commands

```bash
# Development
npm run dev                    # Start development server
npm run build:widget          # Build widget for production

# Testing
npm run test                   # Run all tests (unit + E2E)
npm run test:ui               # Run tests with Playwright UI
npm run test:headed           # Run tests with visible browser
npm run test:report           # View test reports

# Code Quality
npm run lint                  # Lint TypeScript/React code
```

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Widget functionality and user workflows  
- **E2E Tests**: Complete user journeys with Playwright
- **Visual Regression Tests**: Automated screenshot comparison
- **Performance Tests**: Load time and memory usage monitoring

```bash
npm run test              # Run all test suites
npm run test:ui          # Interactive test runner
npm run test:headed      # Run with visible browser
npm run test:report      # View detailed test reports
```

## Architecture

**Widget-First Design**: Built as a self-contained, embeddable React component with:

- **Scoped Styling**: Tailwind CSS with `rr-` prefix to prevent conflicts
- **Asset Management**: Intelligent loading and caching of audio/images
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Performance Optimized**: Tree-shaking, code splitting, and bundle optimization
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Internationalization**: i18next for English/Spanish support

## Deployment

### GitHub Pages

- **Development**: https://trevorproject.github.io/rainbow-relax/dev/
- **Production**: https://trevorproject.github.io/rainbow-relax/

### Build Process

```bash
npm run build:widget  # Builds optimized bundle to dist-widget/
```

The build process:
1. Compiles TypeScript to JavaScript
2. Bundles React components into single IIFE
3. Optimizes assets (images, audio, CSS)
4. Generates production-ready files

### CDN Integration

The widget is designed to work with any CDN. Update the `cdnBase` configuration to point to your CDN:

```javascript
window.myWidgetConfig = {
  cdnBase: "https://your-cdn.com/rainbow-relax/",
  // ... other options
};
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

```bash
git checkout -b MPI-XXX  # Use Jira ticket number
npm install
npm run dev
npm run test
git commit -m "feat(MPI-XXX): your changes"
```

### Development Workflow

1. **Create Jira ticket** for your feature/bug fix
2. **Create branch** using ticket number (e.g., `MPI-149`)
3. **Develop** with hot reload: `npm run dev`
4. **Test** your changes: `npm run test`
5. **Submit PR** with ticket reference

## Troubleshooting

### Common Issues

- **Widget not loading**: Verify container ID exists and matches config
- **Audio not working**: Ensure HTTPS connection and `audioEnabled: true`
- **Styling conflicts**: Check for CSS conflicts with `rr-` prefixed classes
- **Performance issues**: Enable debug mode: `debug: true` in config

### Debug Mode

Enable debug logging for troubleshooting:

```javascript
window.myWidgetConfig = {
  debug: true,
  // ... other options
};
```

### Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Requirements**: ES2015+ support, Web Audio API

## License

GPL v3.0 - see [LICENSE](LICENSE) file.

## Support

- **Issues**: [GitHub Issues](https://github.com/trevorproject/rainbow-relax/issues)
- **Discussions**: [GitHub Discussions](https://github.com/trevorproject/rainbow-relax/discussions)
- **Organization**: [The Trevor Project](https://www.thetrevorproject.org/)
- **Crisis Support**: [TrevorLifeline](https://www.thetrevorproject.org/get-help/) - 24/7 crisis support
