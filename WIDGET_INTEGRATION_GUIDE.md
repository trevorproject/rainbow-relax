# Rainbow Relax Widget Integration Guide

## Quick Start (5 minutes)

The Rainbow Relax widget is a drop-in embeddable component that brings the full breathing exercise experience to any website with just two lines of code.

### Basic Integration

```html
<!-- 1. Add the container where you want the widget to appear -->
<div id="rainbow-relax-container" style="width: 100%; height: 600px;"></div>

<!-- 2. Add the widget script with configuration -->
<script>
  window.myWidgetConfig = {
    containerId: "rainbow-relax-container",
    showQuickExit: false,
    donateURL: "https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW",
    getHelpURL: "https://www.thetrevorproject.mx/ayuda/",
    GTAG: "",
    width: "100%",
    height: "100%",
    cdnBase: "./src/assets" // Path to audio/image assets
  };
</script>
<script src="./dist-widget/rainbowRelax.js"></script>
```

### Testing Locally

To test the widget with audio support:

1. **Start a web server** (required for audio files):
   ```bash
   python3 -m http.server 8081
   ```

2. **Open in browser**: `http://localhost:8081/widget-demo.html`

3. **Test features**:
   - Click time buttons (1 min, 3 min, 5 min) to start exercises
   - Click volume icon in breathing exercise to enable sound
   - Observe animated breathing circles
   - Test pause/play controls

### Audio Assets Setup

The widget supports background music and voice instructions, but requires audio files to be hosted alongside the widget. To enable audio:

1. **Copy audio files** from `src/assets/sounds/` to your web server
2. **Configure cdnBase** to point to your audio files location
3. **Audio files needed**:
   - `Background.mp3` (background music)
   - `cycle-en.mp3` / `cycle-es.mp3` (breathing instructions)
   - `intro-en.mp3` / `intro-es.mp3` (introduction voice)

```html
<script>
  window.myWidgetConfig = {
    containerId: "rainbow-relax-container",
    cdnBase: "https://your-domain.com/rainbow-relax-assets", // Your audio files location
    // ... other config
  };
</script>
```

**Note**: Audio is disabled by default to ensure fast loading. The widget provides full visual breathing guidance even without audio.

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerId` | string | **required** | ID of the HTML element where the widget will render |
| `showQuickExit` | boolean | `false` | Show/hide the quick exit button for safety |
| `donateURL` | string | Trevor Project donate URL | Custom donation link |
| `getHelpURL` | string | Trevor Project help URL | Custom help/support link |
| `GTAG` | string | `""` | Google Analytics 4 measurement ID (leave empty to disable) |
| `width` | string | `"600px"` | Widget width (CSS units: px, %, em, etc.) |
| `height` | string | `"500px"` | Widget height (CSS units: px, %, em, etc.) |
| `cdnBase` | string | `"./src/assets"` | Base URL for audio and image assets |

## WordPress Integration

### Method 1: Custom HTML Block (Recommended)

1. Edit your page/post
2. Add a "Custom HTML" block
3. Paste this code:

```html
<div id="rainbow-relax-container"></div>

<script>
  window.myWidgetConfig = {
    containerId: "rainbow-relax-container",
    showQuickExit: false,
    donateURL: "https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW",
    getHelpURL: "https://www.thetrevorproject.mx/ayuda/",
    GTAG: "",
    width: "100%",
    height: "600px"
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/trevorproject/rainbow-relax@latest/dist-widget/rainbowRelax.js"></script>
```

4. Publish your page

### Method 2: Theme Integration

Add to your theme's `functions.php`:

```php
function add_rainbow_relax_widget() {
    ?>
    <script>
    window.myWidgetConfig = {
        containerId: "rainbow-relax-container",
        showQuickExit: false,
        donateURL: "https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW",
        getHelpURL: "https://www.thetrevorproject.mx/ayuda/",
        GTAG: "",
        width: "100%",
        height: "600px"
    };
    </script>
    <script src="https://cdn.jsdelivr.net/gh/trevorproject/rainbow-relax@latest/dist-widget/rainbowRelax.js"></script>
    <?php
}
add_action('wp_footer', 'add_rainbow_relax_widget');
```

Then add the container in your template:
```html
<div id="rainbow-relax-container"></div>
```

## Advanced Usage

### Programmatic Control

```javascript
// Initialize widget manually
window.RainbowRelax.init({
    containerId: "my-container",
    width: "800px",
    height: "600px"
});

// Check if widget is running
if (window.RainbowRelax.isInitialized()) {
    console.log("Widget is active");
}

// Destroy widget
window.RainbowRelax.destroy();

// Get version
console.log("Widget version:", window.RainbowRelax.version);
```

### Multiple Instances

```javascript
// Create independent widget instances
const widget1 = window.RainbowRelax.createInstance();
const widget2 = window.RainbowRelax.createInstance();

widget1.init({ containerId: "container-1" });
widget2.init({ containerId: "container-2" });
```

### Custom Styling

The widget uses CSS custom properties that you can override:

```css
#rainbow-relax-container {
    --color-primary: #your-brand-color;
    --color-text: #333333;
    --font-global: "Your Font", sans-serif;
    
    /* Container styling */
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
}
```

## Analytics Integration

### Google Analytics 4

Set your GA4 measurement ID to track widget usage:

```javascript
window.myWidgetConfig = {
    containerId: "rainbow-relax-container",
    GTAG: "G-XXXXXXXXXX" // Your GA4 measurement ID
    // ... other options
};
```

**Important**: The widget uses an isolated dataLayer (`dataLayer_rl`) to prevent conflicts with your site's existing analytics.

### Events Tracked

When analytics is enabled, the widget tracks:
- `widget_loaded` - Widget initialization
- `exercise_started` - User starts breathing exercise
- `exercise_completed` - User completes exercise
- `exercise_paused` - User pauses exercise

## Troubleshooting

### Widget Not Loading

1. **Check the container exists**: Ensure the element with your `containerId` exists in the DOM
2. **Check console for errors**: Open browser DevTools → Console
3. **Verify script URL**: Make sure the script URL is accessible

```javascript
// Debug: Check if widget loaded
if (typeof window.RainbowRelax === 'undefined') {
    console.error('Rainbow Relax widget script failed to load');
} else {
    console.log('Widget loaded successfully, version:', window.RainbowRelax.version);
}
```

### Styling Issues

1. **CSS conflicts**: The widget uses prefixed CSS classes (`rr-`) to avoid conflicts
2. **Container size**: Ensure the container has sufficient space (minimum 400x300px)
3. **Z-index issues**: The widget uses `z-index: 100` for modals

### Performance

- **Bundle size**: ~617KB gzipped
- **Load time**: Typically <1.2s on 4G
- **Memory usage**: Minimal impact on page performance

## Security

- ✅ **CSP friendly**: Works with Content Security Policy
- ✅ **No eval()**: Safe JavaScript execution
- ✅ **SRI support**: Subresource Integrity compatible
- ✅ **Sandboxed**: No access to parent page data

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Support

For technical support or feature requests:
- 📧 Email: [support@thetrevorproject.org](mailto:support@thetrevorproject.org)
- 🐛 Issues: [GitHub Issues](https://github.com/trevorproject/rainbow-relax/issues)
- 📚 Documentation: [Full Documentation](https://github.com/trevorproject/rainbow-relax)

## License

This widget is provided by The Trevor Project for mental health support. Please respect our [Terms of Service](https://www.thetrevorproject.org/terms-of-service/) when integrating.

---

**Need help?** This integration should take less than 5 minutes. If you encounter any issues, please reach out to our support team.
