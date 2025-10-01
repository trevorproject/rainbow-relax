# Rainbow Relax Widget

An embeddable breathing exercise widget that guides users through the 4-7-8 breathing technique. Easy integration with a single script tag.

## Features

- 4-7-8 breathing technique with visual guidance
- English and Spanish support
- Responsive design
- Audio guidance and background music
- Easy single script integration

## Quick Start

```bash
git clone https://github.com/trevorproject/rainbow-relax.git
cd rainbow-relax
npm install
npm run dev
```

## Widget Integration

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

## Development

```bash
npm run dev          # Development server
npm run build:widget # Build widget
npm run test         # Run tests
npm run lint         # Lint code
```

## Testing

```bash
npm run test    # Run all tests
npm run test:ui # Run with UI
```

## Architecture

Lightweight, self-contained React widget with custom navigation, native audio, and scoped CSS for easy embedding.

## Deployment

- **Development**: https://trevorproject.github.io/rainbow-relax/dev/
- **Production**: https://trevorproject.github.io/rainbow-relax/

```bash
npm run build:widget  # Builds to dist-widget/
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

```bash
git checkout -b MPI-XXX  # Use Jira ticket number
npm run test
git commit -m "feat(MPI-XXX): your changes"
```

## Troubleshooting

- Check container ID matches configuration
- Verify CDN URLs are accessible
- Enable debug mode: `debug: true` in config

## License

GPL v3.0 - see [LICENSE](LICENSE) file.

## Support

- [GitHub Issues](https://github.com/trevorproject/rainbow-relax/issues)
- [The Trevor Project](https://www.thetrevorproject.org/)
