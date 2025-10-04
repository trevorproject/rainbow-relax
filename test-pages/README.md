# Rainbow Relax Widget Test Pages

This directory contains test pages for the Rainbow Relax widget that are **not affected by the build process**.

## Files

- `dynamic-test.html` - Interactive test page with dimension controls and widget management
- `serve-test.py` - Python script to serve both test pages and widget files
- `README.md` - This file

## Usage

### Option 1: Use the Python Server (Recommended)

```bash
# From the project root
python3 test-pages/serve-test.py
```

Then visit: http://localhost:8086/test-pages/dynamic-test.html

### Option 2: Use the Existing Server

If you already have a server running on port 8085:

```bash
# From the project root
python3 -m http.server 8085 --directory .
```

Then visit: http://localhost:8085/test-pages/dynamic-test.html

## Features

The dynamic test page allows you to:

- **Test Different Dimensions**: Use sliders or presets to test various widget sizes
- **Language Testing**: Switch between English and Spanish
- **Theme Testing**: Test light/dark themes
- **Widget Management**: Create, destroy, and refresh widgets
- **Breathing Exercise Testing**: Automatically test the breathing exercise functionality
- **Responsive Testing**: Verify that elements scale properly at different sizes
- **Audio Testing**: Test audio functionality with different configurations
- **Logo Testing**: Verify logo positioning and sizing across different widget dimensions
- **Animation Testing**: Test breathing animations and visual feedback
- **Error Handling**: Test widget behavior with invalid configurations

## Preset Sizes

- **Small**: 400×300px - Compact widget for sidebars
- **Medium**: 600×400px - Standard widget size
- **Large**: 800×600px - Full-featured widget
- **Mobile**: 375×500px - Mobile device simulation
- **Tablet**: 768×600px - Tablet device simulation
- **Desktop**: 1024×700px - Desktop device simulation
- **Square**: 500×500px - Square aspect ratio
- **Wide**: 800×300px - Wide aspect ratio
- **Tall**: 300×600px - Tall aspect ratio

## Manual Testing Guide

### Basic Widget Testing

1. **Load the test page** and verify the widget initializes correctly
2. **Test different sizes** using the preset buttons or sliders
3. **Switch languages** and verify all text updates correctly
4. **Test audio** by enabling/disabling and checking console for errors
5. **Test breathing exercise** by clicking start and following the visual cues

### Responsive Testing

1. **Small widgets** (300x200, 400x300): Verify all elements fit and are readable
2. **Medium widgets** (500x400, 600x500): Check proper scaling and spacing
3. **Large widgets** (800x600, 1000x800): Ensure elements don't become too large
4. **Mobile simulation**: Test touch interactions and mobile-specific features

### Logo and Visual Testing

1. **Logo positioning**: Verify logo appears correctly at different sizes
2. **Logo sizing**: Check that logo scales appropriately with widget size
3. **Animation circles**: Ensure breathing circles are properly positioned
4. **Color scheme**: Verify consistent theming across all elements

### Error Testing

1. **Invalid configurations**: Test with missing or invalid config options
2. **Network errors**: Test with slow or failed asset loading
3. **Browser compatibility**: Test in different browsers and versions

## Why This Directory Exists

The `dist-widget` directory is the build output and gets completely overwritten during the build process. By placing test pages in this separate `test-pages` directory, they remain available even after running `npm run build:widget`.

## File Structure

```
rainbow-relax/
├── dist-widget/          # Build output (gets overwritten)
│   ├── rainbowRelax.js   # Widget JavaScript
│   ├── style.css         # Widget CSS
│   └── assets/           # Widget assets
├── test-pages/           # Test pages (persistent)
│   ├── dynamic-test.html # Main test page
│   ├── serve-test.py     # Test server
│   └── README.md         # This file
└── src/                  # Source code
```
