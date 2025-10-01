# Rainbow Relax Widget Integration Guide

This guide provides comprehensive instructions for integrating the Rainbow Relax breathing exercise widget into your website or application.

## Quick Start

### Basic HTML Integration

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
    containerId: 'rainbow-relax-container',
    showQuickExit: true,
    donateURL: 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
    getHelpURL: 'https://www.thetrevorproject.mx/ayuda/',
    width: '500px',
    height: '500px',
    audioEnabled: true
  };
</script>
```

## Configuration Options

| Parameter       | Type    | Default                     | Description                  |
| --------------- | ------- | --------------------------- | ---------------------------- |
| `containerId`   | string  | `'rainbow-relax-container'` | HTML element ID              |
| `showQuickExit` | boolean | `false`                     | Show quick exit instructions |
| `width`         | string  | `'500px'`                   | Widget width                 |
| `height`        | string  | `'500px'`                   | Widget height                |
| `donateURL`     | string  | PayPal URL                  | Donation link                |
| `getHelpURL`    | string  | Trevor Project URL          | Help/support link            |
| `audioEnabled`  | boolean | `true`                      | Enable audio features        |
| `cdnBase`       | string  | Auto-detected               | CDN base URL for assets      |
| `debug`         | boolean | `false`                     | Enable debug logging         |

### Advanced Configuration

```javascript
window.myWidgetConfig = {
  // Container settings
  containerId: 'my-breathing-widget',
  width: '100%',
  height: '600px',
  
  // Feature toggles
  showQuickExit: true,
  audioEnabled: true,
  debug: false,
  
  // Custom URLs
  donateURL: 'https://your-org.com/donate',
  getHelpURL: 'https://your-org.com/support',
  
  // CDN settings
  cdnBase: 'https://your-cdn.com/widget/',
  
  // Analytics (optional)
  GTAG: 'G-XXXXXXXXXX'
};
```

## JavaScript API

The widget exposes a global API for programmatic control:

```javascript
// Initialize widget manually
window.MyWidget.init();

// Destroy widget instance
window.MyWidget.destroy();

// Health check - returns boolean
const isHealthy = window.MyWidget.healthCheck();

// Check if widget is initialized
const isReady = window.MyWidget.isInitialized();
```

### API Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `init()` | Initialize the widget | `boolean` |
| `destroy()` | Destroy widget instance | `void` |
| `healthCheck()` | Check widget health | `boolean` |
| `isInitialized()` | Check initialization status | `boolean` |

## Events

Listen for widget lifecycle events:

```javascript
// Widget ready event
window.addEventListener('rainbowRelaxWidgetReady', (event) => {
    console.log('Widget is ready', event.detail);
});

// Widget destroyed event
window.addEventListener('rainbowRelaxWidgetDestroyed', () => {
    console.log('Widget destroyed');
});

// Widget error event
window.addEventListener('rainbowRelaxWidgetError', (event) => {
    console.error('Widget error:', event.detail);
});
```

### Event Details

| Event | Description | Detail |
|-------|-------------|---------|
| `rainbowRelaxWidgetReady` | Widget initialized successfully | Configuration object |
| `rainbowRelaxWidgetDestroyed` | Widget destroyed | None |
| `rainbowRelaxWidgetError` | Widget encountered error | Error object |

## Platform Integration Examples

### WordPress Integration

#### Shortcode Method
```php
function rainbow_relax_shortcode($atts) {
    $attributes = shortcode_atts(array(
        'width' => '500px',
        'height' => '500px',
        'container_id' => 'rainbow-relax-container-' . uniqid(),
        'audio_enabled' => 'true',
        'show_quick_exit' => 'false'
    ), $atts);
    
    $output = '<div id="' . esc_attr($attributes['container_id']) . '" style="width: ' . esc_attr($attributes['width']) . '; height: ' . esc_attr($attributes['height']) . ';"></div>';
    
    $output .= '<script>
        (function(w, d, s, src, id) {
            if (d.getElementById(id)) return;
            var js = d.createElement(s);
            js.id = id;
            js.src = src;
            js.async = true;
            d.head.appendChild(js);
        })(window, document, "script", "https://trevorproject.github.io/rainbow-relax/rainbowRelax.js", "rainbow-relax-' . esc_attr($attributes['container_id']) . '");

        window.myWidgetConfig = {
            containerId: "' . esc_attr($attributes['container_id']) . '",
            width: "' . esc_attr($attributes['width']) . '",
            height: "' . esc_attr($attributes['height']) . '",
            audioEnabled: ' . ($attributes['audio_enabled'] === 'true' ? 'true' : 'false') . ',
            showQuickExit: ' . ($attributes['show_quick_exit'] === 'true' ? 'true' : 'false') . '
        };
    </script>';
    
    return $output;
}
add_shortcode('rainbow_relax', 'rainbow_relax_shortcode');
```

Usage: `[rainbow_relax width="100%" height="600px"]`

### React Integration

#### Component Method
```jsx
import { useEffect, useRef, useState } from 'react';

function RainbowRelaxWidget({ config = {} }) {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const containerId = containerRef.current?.id || 'rainbow-relax-container';
        
        window.myWidgetConfig = {
            containerId,
            showQuickExit: true,
            audioEnabled: true,
            width: '100%',
            height: '600px',
            ...config
        };
        
        const script = document.createElement('script');
        script.src = 'https://trevorproject.github.io/rainbow-relax/rainbowRelax.js';
        script.async = true;
        
        script.onload = () => setIsLoaded(true);
        script.onerror = (err) => setError(err);
        
        document.head.appendChild(script);
        
        return () => {
            if (window.MyWidget) {
                window.MyWidget.destroy();
            }
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [config]);

    if (error) {
        return <div>Failed to load Rainbow Relax widget</div>;
    }

    return (
        <div
            ref={containerRef}
            id="rainbow-relax-container"
            style={{ width: '100%', height: '600px' }}
        />
    );
}

export default RainbowRelaxWidget;
```

#### Hook Method
```jsx
import { useEffect, useRef, useState } from 'react';

function useRainbowRelaxWidget(config = {}) {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const containerId = containerRef.current?.id || 'rainbow-relax-container';
        
        window.myWidgetConfig = {
            containerId,
            showQuickExit: true,
            audioEnabled: true,
            width: '100%',
            height: '600px',
            ...config
        };
        
        const script = document.createElement('script');
        script.src = 'https://trevorproject.github.io/rainbow-relax/rainbowRelax.js';
        script.async = true;
        
        script.onload = () => setIsLoaded(true);
        script.onerror = (err) => setError(err);
        
        document.head.appendChild(script);
        
        return () => {
            if (window.MyWidget) {
                window.MyWidget.destroy();
            }
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, [config]);

    return { containerRef, isLoaded, error };
}
```

### Vue.js Integration

```vue
<template>
  <div ref="container" :id="containerId" :style="containerStyle"></div>
</template>

<script>
export default {
  name: 'RainbowRelaxWidget',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      containerId: 'rainbow-relax-container-' + Date.now(),
      isLoaded: false,
      error: null
    }
  },
  computed: {
    containerStyle() {
      return {
        width: this.config.width || '100%',
        height: this.config.height || '600px'
      }
    }
  },
  mounted() {
    this.loadWidget();
  },
  beforeUnmount() {
    if (window.MyWidget) {
      window.MyWidget.destroy();
    }
  },
  methods: {
    loadWidget() {
      window.myWidgetConfig = {
        containerId: this.containerId,
        showQuickExit: true,
        audioEnabled: true,
        ...this.config
      };
      
      const script = document.createElement('script');
      script.src = 'https://trevorproject.github.io/rainbow-relax/rainbowRelax.js';
      script.async = true;
      
      script.onload = () => {
        this.isLoaded = true;
        this.$emit('loaded');
      };
      
      script.onerror = (err) => {
        this.error = err;
        this.$emit('error', err);
      };
      
      document.head.appendChild(script);
    }
  }
}
</script>
```

## Troubleshooting

### Common Issues

#### Widget Not Loading
- **Check container ID**: Ensure the container element exists and ID matches configuration
- **Verify script URL**: Confirm the CDN URL is accessible and correct
- **Check console errors**: Enable debug mode to see detailed error messages
- **Network issues**: Ensure HTTPS connection and no firewall blocking

#### Audio Not Working
- **HTTPS required**: Audio features require secure connection
- **Browser permissions**: Check if browser allows audio autoplay
- **Audio enabled**: Verify `audioEnabled: true` in configuration
- **Asset loading**: Ensure audio files are accessible from CDN

#### Styling Conflicts
- **Container dimensions**: Verify width/height are properly set
- **CSS conflicts**: Check for conflicting styles with `rr-` prefixed classes
- **Responsive issues**: Test on different screen sizes
- **Z-index problems**: Ensure widget container has proper stacking context

#### Performance Issues
- **Bundle size**: Widget is optimized but check network conditions
- **Memory leaks**: Use `destroy()` method when removing widget
- **Multiple instances**: Avoid loading multiple widgets simultaneously

### Debug Mode

Enable debug logging for detailed troubleshooting:

```javascript
window.myWidgetConfig = {
  debug: true,
  // ... other options
};
```

Debug mode provides:
- Detailed console logging
- Asset loading information
- Performance metrics
- Error stack traces

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Safari | 14+ | Full support |
| Chrome Mobile | 90+ | Full support |

### Performance Optimization

- **Preload assets**: Use `cdnBase` configuration for optimal loading
- **Lazy loading**: Load widget only when needed
- **Cleanup**: Always call `destroy()` when removing widget
- **CDN**: Use a fast CDN for better performance

## Support

- **Issues**: [GitHub Issues](https://github.com/trevorproject/rainbow-relax/issues)
- **Discussions**: [GitHub Discussions](https://github.com/trevorproject/rainbow-relax/discussions)
- **Documentation**: [Widget Guide](./widget-guide.md)
- **Organization**: [The Trevor Project](https://www.thetrevorproject.org/)
- **Crisis Support**: [TrevorLifeline](https://www.thetrevorproject.org/get-help/) - 24/7 crisis support
