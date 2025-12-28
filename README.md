# Perfect Autocomplete

A high-quality, accessible autocomplete web component built with Vue 3 and exposed as a standard HTML Custom Element.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- **Fully Accessible** - Complete WAI-ARIA combobox pattern with keyboard navigation
- **Framework Agnostic** - Works with React, Vue, Angular, Svelte, or vanilla JS
- **5 Built-in Themes** - Classic, Basic, Modern, Bootstrap, and Tailwind
- **Mobile-First** - Touch gestures, virtual keyboard handling, responsive design
- **Dark Mode** - Automatic support via `prefers-color-scheme`
- **Customizable** - CSS custom properties, custom templates with htm
- **Lightweight** - ~42KB bundle including Vue 3, Floating UI, and htm
- **Smart Positioning** - Automatic flip and shift near viewport edges
- **TypeScript** - Full type definitions included
- **Well Tested** - Comprehensive unit and browser tests

## Installation

```bash
# npm
npm install perfect-autocomplete

# yarn
yarn add perfect-autocomplete

# pnpm
pnpm add perfect-autocomplete

# bun
bun add perfect-autocomplete
```

## Quick Start

```html
<!-- 1. Import and register -->
<script type="module">
  import { register } from 'perfect-autocomplete'
  register()
</script>

<!-- 2. Add HTML -->
<input type="search" id="search" placeholder="Search..." />
<perfect-autocomplete
  for="search"
  url="/api/search"
  min-chars="2"
></perfect-autocomplete>

<!-- 3. Handle selection -->
<script type="module">
  document.querySelector('perfect-autocomplete')
    .addEventListener('pac:select', (e) => {
      console.log('Selected:', e.detail.item)
    })
</script>
```

## Themes

Choose from 5 built-in themes:

```html
<perfect-autocomplete theme="modern" for="search" url="/api/search" />
```

| Theme | Description |
|-------|-------------|
| `classic` | Traditional, timeless design with warm grays (default) |
| `basic` | Minimal styling with simple borders and no shadows |
| `modern` | Contemporary design with smooth shadows and animations |
| `bootstrap` | Bootstrap 5 inspired styling |
| `tailwind` | Tailwind CSS inspired with slate palette |

All themes support automatic dark mode via `prefers-color-scheme`.

## Configuration

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `for` | string | - | ID of input element to connect |
| `url` | string | - | API endpoint URL |
| `query-param` | string | `"q"` | Query parameter name |
| `min-chars` | number | `2` | Minimum characters before fetch |
| `debounce` | number | `300` | Debounce delay in ms |
| `max-items` | number | `10` | Maximum items to display |
| `theme` | string | `"classic"` | Visual theme |
| `placement` | string | `"bottom-start"` | Dropdown placement |
| `close-on-select` | boolean | `true` | Close dropdown on selection |
| `highlight-first` | boolean | `true` | Auto-highlight first item |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `pac:open` | - | Dropdown opened |
| `pac:close` | - | Dropdown closed |
| `pac:select` | `{ item, index }` | Item selected |
| `pac:items-loaded` | `{ items, query }` | Items loaded from API |
| `pac:error` | `{ error }` | Fetch error occurred |

## API Response Format

Your API should return an array of items:

```json
[
  {
    "id": 1,
    "label": "Item Label",
    "value": "item-value",
    "description": "Optional description",
    "image": "https://example.com/image.jpg"
  }
]
```

## Custom Templates

```javascript
import { html } from 'perfect-autocomplete'

const autocomplete = document.querySelector('perfect-autocomplete')

autocomplete.renderItem = (item, html, { highlighted }) => html`
  <div class="user ${highlighted ? 'active' : ''}">
    <img src=${item.avatar} alt="" />
    <span>${item.name}</span>
  </div>
`
```

## Styling

Override CSS custom properties:

```css
perfect-autocomplete {
  --pac-bg-color: #ffffff;
  --pac-text-color: #1f2937;
  --pac-highlight-bg: #f3f4f6;
  --pac-highlight-text: #111827;
  --pac-border-color: #e5e7eb;
  --pac-border-radius: 8px;
  --pac-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --pac-max-height: 300px;
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↓` | Move to next item |
| `↑` | Move to previous item |
| `Enter` | Select highlighted item |
| `Escape` | Close dropdown |
| `Tab` | Close dropdown and move focus |

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 67+ |
| Firefox | 63+ |
| Safari | 10.1+ |
| Edge | 79+ |

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun run test

# Build for production
bun run build

# Start documentation
bun run docs:dev
```

## Documentation

Full documentation available at the docs site or run locally:

```bash
bun run docs:dev
```

## Author

Created by [Mikolaj Jeziorny](https://mikolaj-jeziorny.pl/)

## License

MIT License - see the [LICENSE](LICENSE) file for details.
