# Styling

Perfect Autocomplete uses CSS custom properties (variables) for easy theming. Override these properties on the `perfect-autocomplete` element or in your global styles.

## Built-in Themes

The component includes 5 built-in themes. Use the `theme` attribute to apply a theme:

```html
<perfect-autocomplete theme="modern" for="search" url="/api/search" />
```

### Available Themes

| Theme | Description |
|-------|-------------|
| `classic` | Traditional, timeless design with warm grays (default) |
| `basic` | Minimal styling with simple borders and no shadows |
| `modern` | Contemporary design with larger radius and smooth shadows |
| `bootstrap` | Bootstrap 5 inspired styling |
| `tailwind` | Tailwind CSS inspired with slate palette |

### Classic (Default)

Traditional, timeless design with warm gray palette and subtle shadows.

```html
<perfect-autocomplete theme="classic" for="search" url="/api/search" />
```

- Warm gray color palette (#374151, #6b7280)
- 6px border radius
- Subtle box shadow
- Traditional feel

### Basic

Minimal, no-frills design focused on simplicity.

```html
<perfect-autocomplete theme="basic" for="search" url="/api/search" />
```

- Pure black/white/gray colors
- No shadow
- 2px border radius
- Simple 1px border

### Modern

Contemporary design with smooth animations and accent colors.

```html
<perfect-autocomplete theme="modern" for="search" url="/api/search" />
```

- Cool slate palette (#0f172a, #64748b)
- 12px border radius
- Multi-layer shadows
- Gradient highlights
- Bouncy animations

### Bootstrap

Bootstrap 5 inspired styling with familiar aesthetics.

```html
<perfect-autocomplete theme="bootstrap" for="search" url="/api/search" />
```

- Bootstrap color palette (#0d6efd, #6c757d)
- 0.375rem (6px) border radius
- Bootstrap-style shadows
- Blue accent on selection

### Tailwind

Tailwind CSS inspired with their signature design patterns.

```html
<perfect-autocomplete theme="tailwind" for="search" url="/api/search" />
```

- Tailwind slate/blue palette (#1e293b, #3b82f6)
- 0.5rem (8px) border radius
- Tailwind shadow utilities
- Blue accent on selection

### Dark Mode Support

All themes automatically support dark mode via `prefers-color-scheme`:

```css
/* Themes automatically adjust in dark mode */
@media (prefers-color-scheme: dark) {
  /* Colors, shadows, and contrasts are adjusted */
}
```

## CSS Custom Properties

### Colors

```css
perfect-autocomplete {
  --pac-bg-color: #ffffff;
  --pac-text-color: #1f2937;
  --pac-border-color: #e5e7eb;
  --pac-highlight-bg: #f3f4f6;
  --pac-highlight-text: #111827;
  --pac-placeholder-color: #9ca3af;
  --pac-error-color: #dc2626;
  --pac-loading-color: #6b7280;
  --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Spacing

```css
perfect-autocomplete {
  --pac-padding: 8px 12px;
  --pac-item-padding: 10px 12px;
  --pac-gap: 8px;
  --pac-border-radius: 8px;
  --pac-item-border-radius: 4px;
}
```

### Typography

```css
perfect-autocomplete {
  --pac-font-family: system-ui, sans-serif;
  --pac-font-size: 14px;
  --pac-line-height: 1.5;
  --pac-description-font-size: 12px;
}
```

### Sizing

```css
perfect-autocomplete {
  --pac-max-height: 300px;
  --pac-min-width: 200px;
  --pac-item-min-height: 44px;
  --pac-image-size: 32px;
  --pac-image-border-radius: 4px;
}
```

### Animation

```css
perfect-autocomplete {
  --pac-animation-duration: 150ms;
  --pac-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Theming Examples

### Dark Theme

```css
perfect-autocomplete.dark {
  --pac-bg-color: #1f2937;
  --pac-text-color: #f9fafb;
  --pac-border-color: #374151;
  --pac-highlight-bg: #374151;
  --pac-highlight-text: #ffffff;
  --pac-placeholder-color: #6b7280;
  --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}
```

### Brand Colors

```css
perfect-autocomplete {
  --pac-highlight-bg: #3b82f6;
  --pac-highlight-text: #ffffff;
  --pac-border-radius: 12px;
}
```

### Compact Style

```css
perfect-autocomplete.compact {
  --pac-padding: 4px 8px;
  --pac-item-padding: 6px 8px;
  --pac-item-min-height: 32px;
  --pac-font-size: 13px;
  --pac-max-height: 200px;
}
```

## Automatic Dark Mode

The component automatically respects `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  perfect-autocomplete {
    --pac-bg-color: #1f2937;
    --pac-text-color: #f9fafb;
    /* ... other dark mode overrides */
  }
}
```

## Touch-Friendly Sizing

On touch devices, items automatically get larger touch targets:

```css
@media (pointer: coarse) {
  perfect-autocomplete {
    --pac-item-min-height: 48px;
    --pac-item-padding: 12px 16px;
  }
}
```

## High Contrast Mode

The component supports Windows High Contrast mode automatically:

```css
@media (forced-colors: active) {
  perfect-autocomplete {
    /* Browser handles colors automatically */
  }
}
```

## Reduced Motion

Animations are disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  perfect-autocomplete {
    --pac-animation-duration: 0ms;
  }
}
```

## CSS Classes

Internal elements use these classes for styling:

| Class | Element |
|-------|---------|
| `.pac-dropdown` | Dropdown container |
| `.pac-items` | Items list |
| `.pac-item` | Individual item |
| `.pac-item--highlighted` | Highlighted item |
| `.pac-item__image` | Item image |
| `.pac-item__content` | Item content wrapper |
| `.pac-item__label` | Item label text |
| `.pac-item__description` | Item description text |
| `.pac-loading` | Loading state |
| `.pac-empty` | Empty state |
| `.pac-error` | Error state |
