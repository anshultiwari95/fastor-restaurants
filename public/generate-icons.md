# PWA Icon Generation Instructions

The PWA requires icon files in the following sizes:
- `pwa-64x64.png` (64x64 pixels)
- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)
- `maskable-icon-512x512.png` (512x512 pixels, maskable)

## Quick Setup

You can generate these icons from the `fastor-logo.svg` file using online tools:

1. **Using PWA Asset Generator** (Recommended):
   - Visit: https://www.pwabuilder.com/imageGenerator
   - Upload `fastor-logo.svg`
   - Download the generated icons
   - Place them in the `public/` folder

2. **Using ImageMagick** (Command line):
   ```bash
   # Convert SVG to PNG at different sizes
   convert -background none -resize 64x64 fastor-logo.svg public/pwa-64x64.png
   convert -background none -resize 192x192 fastor-logo.svg public/pwa-192x192.png
   convert -background none -resize 512x512 fastor-logo.svg public/pwa-512x512.png
   convert -background none -resize 512x512 fastor-logo.svg public/maskable-icon-512x512.png
   ```

3. **Using Online Converters**:
   - Upload `fastor-logo.svg` to any SVG to PNG converter
   - Generate icons at the required sizes
   - Save them in the `public/` folder

## Temporary Placeholder

For development, you can create simple placeholder PNG files. The app will work, but you should replace them with proper icons before production.

## Icon Requirements

- **Format**: PNG
- **Background**: Transparent or solid color matching theme (#FF6D6A)
- **Maskable icon**: Should have safe zone (padding) for Android adaptive icons
- **Quality**: High resolution for crisp display on all devices

