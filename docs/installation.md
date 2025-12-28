# Installation

## Package Managers

### Bun (Recommended)

```bash
bun add perfect-autocomplete
```

### npm

```bash
npm install perfect-autocomplete
```

### pnpm

```bash
pnpm add perfect-autocomplete
```

### Yarn

```bash
yarn add perfect-autocomplete
```

## CDN

### ES Module

```html
<script type="module">
  import { register } from 'https://unpkg.com/perfect-autocomplete@latest/dist/perfect-autocomplete.es.js'
  register()
</script>
```

### IIFE (Global)

```html
<script src="https://unpkg.com/perfect-autocomplete@latest/dist/perfect-autocomplete.iife.js"></script>
<script>
  PerfectAutocomplete.register()
</script>
```

## Registration

The custom element must be registered before use. You have two options:

### Auto-Registration

Import the register module to automatically register:

```javascript
import 'perfect-autocomplete/register'
```

### Manual Registration

For more control, register manually:

```javascript
import { register } from 'perfect-autocomplete'

// Use default tag name
register()

// Or use a custom tag name
register('my-autocomplete')
```

## TypeScript

TypeScript types are included. The package augments `HTMLElementTagNameMap` for proper typing:

```typescript
const autocomplete = document.querySelector('perfect-autocomplete')

// TypeScript knows the element type
autocomplete.url = '/api/search'
autocomplete.addEventListener('pac:select', (e) => {
  // e.detail is properly typed
  console.log(e.detail.item)
})
```

## Browser Support

Perfect Autocomplete works in all modern browsers that support:

- Custom Elements v1
- ES Modules
- Shadow DOM

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 67+             |
| Firefox | 63+             |
| Safari  | 10.1+           |
| Edge    | 79+             |
