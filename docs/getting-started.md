# Getting Started

Perfect Autocomplete is a high-quality, accessible autocomplete web component that works with any framework or vanilla JavaScript.

## Installation

### Using npm/bun

```bash
bun add perfect-autocomplete
# or
npm install perfect-autocomplete
```

### Using CDN

```html
<script type="module">
  import { register } from 'https://unpkg.com/perfect-autocomplete@latest/dist/perfect-autocomplete.es.js'
  register()
</script>
```

## Basic Usage

### Step 1: Import and Register

```javascript
import { register } from 'perfect-autocomplete'

// Register the custom element
register()
```

### Step 2: Add HTML

```html
<input type="search" id="search-input" placeholder="Search..." />
<perfect-autocomplete
  for="search-input"
  url="/api/search"
  query-param="q"
  min-chars="2"
  debounce="300"
></perfect-autocomplete>
```

### Step 3: Handle Selection

```javascript
const autocomplete = document.querySelector('perfect-autocomplete')

autocomplete.addEventListener('pac:select', (event) => {
  const { item } = event.detail
  console.log('Selected:', item)
})
```

## API Endpoint

The component expects your API to return an array of items. Each item should have at least a `label` property:

```json
[
  { "id": 1, "label": "Apple", "value": "apple" },
  { "id": 2, "label": "Banana", "value": "banana" },
  { "id": 3, "label": "Cherry", "value": "cherry" }
]
```

You can include additional properties like `image` and `description` for richer displays:

```json
[
  {
    "id": 1,
    "label": "John Doe",
    "value": "john",
    "image": "https://example.com/john.jpg",
    "description": "Software Engineer"
  }
]
```

## Next Steps

- Learn about all [Configuration Options](/configuration)
- Explore [Custom Templates](/templates)
- See [Styling Guide](/styling) for theming
- Check [Examples](/examples/) for common use cases
