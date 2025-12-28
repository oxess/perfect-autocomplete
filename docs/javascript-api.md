# JavaScript API

Beyond HTML attributes, Perfect Autocomplete provides a rich JavaScript API for programmatic control.

## Properties

All HTML attributes are also available as JavaScript properties:

```javascript
const autocomplete = document.querySelector('perfect-autocomplete')

// Set properties
autocomplete.url = '/api/search'
autocomplete.minChars = 3
autocomplete.debounce = 500
autocomplete.placement = 'top-start'

// Read properties
console.log(autocomplete.url)
console.log(autocomplete.isLoading)
```

## Methods

### open()

Opens the dropdown programmatically.

```javascript
autocomplete.open()
```

### close()

Closes the dropdown.

```javascript
autocomplete.close()
```

### refresh()

Re-fetches data for the current query.

```javascript
await autocomplete.refresh()
```

## Read-Only Properties

### items

Returns the current list of items.

```javascript
const items = autocomplete.items
console.log('Current items:', items)
```

### isLoading

Returns whether data is currently being fetched.

```javascript
if (autocomplete.isLoading) {
  console.log('Loading...')
}
```

## Custom Rendering

### renderItem

Set a custom function to render items:

```javascript
autocomplete.renderItem = (item, html, { highlighted, index }) => {
  return html`
    <div class="custom-item ${highlighted ? 'active' : ''}">
      <strong>${item.label}</strong>
      <span>${item.description}</span>
    </div>
  `
}
```

## Custom Fetch

For complex data fetching scenarios, you can use the `fetchFn` prop (requires import of composables):

```javascript
import { register, useFetch } from '@mikolaj.jeziorny/perfect-autocomplete'

// Custom fetch with authentication
autocomplete.fetchFn = async (query, signal) => {
  const response = await fetch(`/api/search?q=${query}`, {
    signal,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
  return data.results
}
```

## TypeScript

The package exports TypeScript types:

```typescript
import type {
  AutocompleteItem,
  AutocompleteConfig,
  AutocompleteEventMap,
  RenderItemFunction,
  Placement
} from '@mikolaj.jeziorny/perfect-autocomplete'

// Type-safe element access
const autocomplete = document.querySelector('perfect-autocomplete')!

// All properties are typed
autocomplete.url = '/api/search'
autocomplete.placement = 'bottom-start' // Type: Placement

// Events are typed
autocomplete.addEventListener('pac:select', (e) => {
  // e.detail.item is AutocompleteItem
  console.log(e.detail.item.label)
})
```

## Complete Example

```javascript
import { register } from '@mikolaj.jeziorny/perfect-autocomplete'

register()

const input = document.querySelector('#search')
const autocomplete = document.querySelector('perfect-autocomplete')

// Configure
autocomplete.url = '/api/users'
autocomplete.minChars = 2
autocomplete.debounce = 300
autocomplete.maxItems = 8

// Custom rendering
autocomplete.renderItem = (user, html, { highlighted }) => html`
  <div class="user-item ${highlighted ? 'highlighted' : ''}">
    <img src=${user.avatar} class="avatar" />
    <div class="info">
      <span class="name">${user.name}</span>
      <span class="role">${user.role}</span>
    </div>
  </div>
`

// Event handlers
autocomplete.addEventListener('pac:select', (e) => {
  const { item } = e.detail
  input.value = item.name
  console.log('Selected user:', item)
})

autocomplete.addEventListener('pac:error', (e) => {
  console.error('Search failed:', e.detail.error)
})

// Programmatic control
document.querySelector('#clear-btn').onclick = () => {
  input.value = ''
  autocomplete.close()
}

document.querySelector('#refresh-btn').onclick = () => {
  autocomplete.refresh()
}
```
