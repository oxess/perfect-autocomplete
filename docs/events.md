# Events

Perfect Autocomplete emits custom events that bubble and cross shadow DOM boundaries. All event names are prefixed with `pac:`.

## pac:open

Fired when the dropdown opens.

```javascript
autocomplete.addEventListener('pac:open', () => {
  console.log('Dropdown opened')
})
```

**Event Detail:** `void`

## pac:close

Fired when the dropdown closes.

```javascript
autocomplete.addEventListener('pac:close', () => {
  console.log('Dropdown closed')
})
```

**Event Detail:** `void`

## pac:select

Fired when an item is selected.

```javascript
autocomplete.addEventListener('pac:select', (event) => {
  const { item, index } = event.detail
  console.log('Selected item:', item)
  console.log('At index:', index)
})
```

**Event Detail:**
```typescript
{
  item: AutocompleteItem
  index: number
}
```

## pac:items-loaded

Fired when items are loaded from the API.

```javascript
autocomplete.addEventListener('pac:items-loaded', (event) => {
  const { items, query } = event.detail
  console.log(`Loaded ${items.length} items for query "${query}"`)
})
```

**Event Detail:**
```typescript
{
  items: AutocompleteItem[]
  query: string
}
```

## pac:error

Fired when an error occurs during fetching.

```javascript
autocomplete.addEventListener('pac:error', (event) => {
  const { error } = event.detail
  console.error('Autocomplete error:', error.message)
})
```

**Event Detail:**
```typescript
{
  error: Error
}
```

## TypeScript Support

Events are fully typed. When using TypeScript, event handlers receive proper types:

```typescript
const autocomplete = document.querySelector('perfect-autocomplete')!

autocomplete.addEventListener('pac:select', (event) => {
  // event.detail is typed as { item: AutocompleteItem; index: number }
  const { item, index } = event.detail
})
```

## Event Delegation

Since events bubble, you can use event delegation:

```javascript
document.addEventListener('pac:select', (event) => {
  const autocomplete = event.target
  console.log('Selection made in:', autocomplete.getAttribute('for'))
})
```

## React Integration

```jsx
function SearchInput() {
  const handleSelect = (e) => {
    console.log('Selected:', e.detail.item)
  }

  return (
    <>
      <input id="search" type="search" />
      <perfect-autocomplete
        for="search"
        url="/api/search"
        onPac:select={handleSelect}
      />
    </>
  )
}
```

## Vue Integration

```vue
<template>
  <input id="search" type="search" />
  <perfect-autocomplete
    for="search"
    url="/api/search"
    @pac:select="handleSelect"
  />
</template>

<script setup>
function handleSelect(event) {
  console.log('Selected:', event.detail.item)
}
</script>
```
