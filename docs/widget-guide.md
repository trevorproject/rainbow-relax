# Rainbow Relax Widget Guide

## Basic Integration

```html
<div id="rainbow-relax-container" style="width: 500px; height: 500px;"></div>
<script>
  window.myWidgetConfig = {
    containerId: 'rainbow-relax-container',
    showQuickExit: true,
    donateURL: 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
    getHelpURL: 'https://www.thetrevorproject.mx/ayuda/',
    width: '500px',
    height: '500px'
  };
</script>
<script src="https://trevorproject.github.io/rainbow-relax/rainbowRelax.js"></script>
```

## Configuration

| Parameter       | Type    | Default   | Description             |
| --------------- | ------- | --------- | ----------------------- |
| `containerId`   | string  | Required  | HTML element ID         |
| `showQuickExit` | boolean | `true`    | Show quick exit button  |
| `width`         | string  | `'500px'` | Widget width            |
| `height`        | string  | `'500px'` | Widget height           |
| `donateURL`     | string  | Default   | Donation link           |
| `getHelpURL`    | string  | Default   | Help link               |
| `audioEnabled`  | boolean | `true`    | Enable audio            |
| `language`      | string  | `'en'`    | Language ('en' or 'es') |

## JavaScript API

```javascript
// Initialize widget
window.MyWidget.init();

// Destroy widget
window.MyWidget.destroy();

// Get configuration
const config = window.MyWidget.getConfig();

// Health check
const isHealthy = window.MyWidget.healthCheck();
```

## Events

```javascript
// Listen for widget events
window.addEventListener('rainbowRelaxWidgetReady', () => {
    console.log('Widget is ready');
});

window.addEventListener('rainbowRelaxWidgetDestroyed', () => {
    console.log('Widget destroyed');
});
```

## Platform Examples

### WordPress
```php
function add_rainbow_relax_widget() {
    ?>
    <div id="rainbow-relax-container"></div>
    <script>
        window.myWidgetConfig = {
            containerId: 'rainbow-relax-container',
            showQuickExit: true
        };
    </script>
    <script src="https://trevorproject.github.io/rainbow-relax/rainbowRelax.js"></script>
    <?php
}
add_action('wp_footer', 'add_rainbow_relax_widget');
```

### React
```jsx
import { useEffect, useRef } from 'react';

function RainbowRelaxWidget() {
    const containerRef = useRef(null);
    
    useEffect(() => {
        window.myWidgetConfig = {
            containerId: containerRef.current.id,
            showQuickExit: true
        };
        
        const script = document.createElement('script');
        script.src = 'https://trevorproject.github.io/rainbow-relax/rainbowRelax.js';
        document.head.appendChild(script);
        
        return () => {
            if (window.MyWidget) {
                window.MyWidget.destroy();
            }
        };
    }, []);
    
    return <div id="rainbow-relax-container" ref={containerRef} />;
}
```

## Troubleshooting

- **Widget not loading**: Check container ID exists
- **Audio not working**: Ensure HTTPS connection
- **Styling conflicts**: Verify container dimensions

## Support

- [GitHub Issues](https://github.com/trevorproject/rainbow-relax/issues)
- [GitHub Discussions](https://github.com/trevorproject/rainbow-relax/discussions)
