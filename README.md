# Rainbow Relax Widget

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/jfugalde/rainbow-relax)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen)](https://jfugalde.github.io/rainbow-relax/)

An embeddable breathing exercise widget that guides users through the 4-7-8 breathing technique. Easy to integrate into any website with a single script tag.

## Features

- 4-7-8 breathing technique with visual circles
- English and Spanish support
- Responsive design (desktop, tablet, mobile)
- Single script tag integration
- Optional audio guidance

## Quick Start

```bash
git clone https://github.com/jfugalde/rainbow-relax.git
cd rainbow-relax
npm install
npm run dev
```

## Integration

Add this to your HTML:

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
  })(window, document, "script", "https://jfugalde.github.io/rainbow-relax/rainbowRelax.js", "rainbow-relax");

  window.myWidgetConfig = {
    showQuickExit: false,
    donateURL: 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
    getHelpURL: 'https://www.thetrevorproject.mx/ayuda/',
    width: '500px',
    height: '500px',
    containerId: "rainbow-relax-container",
    cdnBase: "https://jfugalde.github.io/rainbow-relax/assets/",
    audioEnabled: true
  };
</script>
```

## Development

```bash
npm run dev          # Development server
npm run build:widget # Build widget
npm run test         # Run tests
```

## Deployment

- **QA**: `https://jfugalde.github.io/rainbow-relax/qa/`
- **Dev**: `https://jfugalde.github.io/rainbow-relax/dev/`
- **Production**: `https://jfugalde.github.io/rainbow-relax/`

## Testing

```bash
npm run test    # Run all tests
npm run test:qa # Test QA environment
```

## URL Parameters

- `showquickescape=true` - Show quick exit instructions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes and test
4. Submit a pull request

## License

[GPL v3.0](https://choosealicense.com/licenses/gpl-3.0/)

## Documentation

- [Widget Integration Guide](./docs/widget-guide.md)

## Support

- [GitHub Issues](https://github.com/jfugalde/rainbow-relax/issues)
- [The Trevor Project](https://www.thetrevorproject.org/)
